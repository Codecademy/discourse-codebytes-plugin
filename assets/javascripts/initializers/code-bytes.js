import loadScript from 'discourse/lib/load-script';
import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from "discourse/lib/show-modal";

export function findCodeByte(lines = [], index) {
  const startTagLines = [];
  const range = [];
  let matchIndex = -1;

  lines.some((line, lineNumber) => {
    if (line.match(/^\[codebyte([ ]+language=([^\s]*?))?[ ]*]$/)) {
      startTagLines.push(lineNumber);
    } else if (line.match(/^\[\/codebyte]$/) && startTagLines.length) {
      const start = startTagLines.pop();
      if (startTagLines.length === 0) {
        matchIndex++
      }
      if (matchIndex === index) {
        range.push(start, lineNumber);
        return true; // break
      }
    }
  });

  return range;
}

function initializeCodeByte(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.groups.lastObject.lastGroup = false;

    toolbar.groups.addObject({
      group: 'codecademy',
      buttons: [],
      lastGroup: true,
    });

    toolbar.addButton({
      id: 'codebyte',
      title: 'composer.codebyte',
      group: 'codecademy',
      icon: 'codecademy-logo',
      className: 'codecademy-codebyte-discourse-btn',
      action: () => toolbar.context.send('insertCodeByte'),
    });
  });

  api.modifyClass('component:d-editor', {
    init() {
      this._super(...arguments);

      this.onSaveResponse = (message) => {
        if (message.data.codeByteSaveResponse) {
          const editableCodebytes = Array.from(
            this.element.querySelectorAll(
              '.d-editor-preview .d-codebyte iframe'
            )
          ).map((frame) => frame.contentWindow);

          const index = editableCodebytes.indexOf(message.source);
          if (index >= 0) {
            this.send(
              'updateCodeByte',
              index,
              message.data.codeByteSaveResponse
            );
          }
        }
      };

      window.addEventListener('message', this.onSaveResponse, false);
    },

    willDestroyElement() {
      this._super(...arguments);
      window.removeEventListener('message', this.onSaveResponse, false);
    },

    actions: {
      insertCodeByte() {
        let exampleFormat = '[codebyte]\n\n[/codebyte]';
        let startTag = '[codebyte]\n';
        let endTag = '\n[/codebyte]';

        const lineValueSelection = this._getSelected('', { lineVal: true });
        const selection = this._getSelected();
        const addBlockInSameline = lineValueSelection.lineVal.length === 0;
        const isTextSelected = selection.value.length > 0;
        const isWholeLineSelected =
          lineValueSelection.lineVal === lineValueSelection.value;
        const isBeginningOfLineSelected = lineValueSelection.pre.trim() === '';
        const newLineAfterSelection = selection.post[0] === '\n';

        if (isTextSelected) {
          if (
            !(
              addBlockInSameline ||
              isWholeLineSelected ||
              isBeginningOfLineSelected
            )
          ) {
            startTag = '\n' + startTag;
          }
          if (!newLineAfterSelection) {
            endTag = endTag + '\n';
          }
          this.set(
            'value',
            `${selection.pre}${startTag}${selection.value}${endTag}${selection.post}`
          );
        } else {
          if (!addBlockInSameline) {
            exampleFormat = '\n' + exampleFormat;
          }
          if (!newLineAfterSelection) {
            exampleFormat = exampleFormat + '\n';
          }
          this._insertText(exampleFormat);
        }
      },
      updateCodeByte(index, { text, language }) {
        const lines = this.get('value').split('\n');
        const [start, end] = findCodeByte(lines, index);

        if (start !== undefined && end !== undefined) {
          const replacementLines = [`[codebyte language=${language}]`, ...text.split('\n')];
          lines.splice(start, end - start, ...replacementLines);
        }
        this.set('value', lines.join('\n'));
      },
    },
  });

  function renderCodebyteFrame(language = '', text = '') {
    return loadScript(
      'https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js'
    ).then(() => {
      const frame = document.createElement('iframe');

      const encodedURI = Base64.encodeURI(text);
      frame.allow = 'clipboard-write';
      frame.src = `https://www.codecademy.com/codebyte-editor?lang=${language}&text=${encodedURI}`;

      Object.assign(frame.style, {
        display: 'block',
        height: '400px',
        width: '100%',
        maxWidth: '712px',
        marginBottom: '24px',
        border: 0,
      });

      return frame;
    });
  }

  api.decorateCookedElement((elem) => {
    elem.querySelectorAll('div.d-codebyte').forEach(async (div, index) => {
      const codebyteFrame = await renderCodebyteFrame(
        div.dataset.language,
        div.textContent.trim()
      );
      div.innerHTML = '';
      div.appendChild(codebyteFrame);

      if (elem.classList.contains('d-editor-preview')) {
        const saveButton = document.createElement('button');
        saveButton.className = 'btn-primary';
        saveButton.textContent = 'Save to post';
        saveButton.style.marginBottom = '24px';
        saveButton.onclick = () =>
          codebyteFrame.contentWindow.postMessage(
            { codeByteSaveRequest: true },
            '*'
          );
        div.appendChild(saveButton);
      }
    });
  },
  { id: 'codebyte-preview' });

  api.modifyClass("controller:composer", {
    save(...args) {
      let allCodebytesAreValid = true;
      let index = 0;
      let start, end;
      const inputLines = this.model.reply.split('\n');

      do {
        [start, end] = findCodeByte(inputLines, index);
        index++;
        if (start !== undefined && !inputLines[start].match(/^\[codebyte[ ]+language=([^\s]*?)[ ]*]$/)) {
          allCodebytesAreValid = false;
        }
      } while (allCodebytesAreValid && start !== undefined)

      if (!allCodebytesAreValid) {
        const warningModal = showModal("invalidCodebyteModal", {
          model: this.model
        });
        warningModal.actions.goBackAndFix = () =>
          this.send("closeModal");
      } else {
        this._super(...args);
      }
    }
  });
}

export default {
  name: 'code-bytes',

  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.code_bytes_enabled) {
      withPluginApi('0.8.31', initializeCodeByte);
    }
  },
};
