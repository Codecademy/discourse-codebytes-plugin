import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

function initializeCodeByte(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      title: "CodeBytes",
      id: "codebyte",
      group: "insertions",
      icon: "codecademy-logo",
      action: () => toolbar.context.send("insertCodeByte"),
    });
  });

  api.modifyClass("component:d-editor", {
    init() {
      this._super(...arguments);

      this.onSaveResponse = (message) => {
        const editableCodebytes = Array.from(
          this.element.querySelectorAll('.d-editor-preview .d-codebyte iframe')
        ).map((frame) => frame.contentWindow);

        if (message.data.codeByteSaveResponse) {
          const index = editableCodebytes.indexOf(message.source);
          if (index >= 0) {
            this.send("updateCodeByte", index, message.data.codeByteSaveResponse);
          }
        }
      };

      window.addEventListener("message", this.onSaveResponse, false);
    },

    willDestroyElement() {
      this._super(...arguments);
      window.removeEventListener("message", this.onSaveResponse, false);
    },

    actions: {
      insertCodeByte() {
        let exampleFormat = '[codebyte]\nhello world\n[/codebyte]'
        let startTag = '[codebyte]\n'
        let endTag = '\n[/codebyte]'
        const lineValueSelection = this._getSelected("", {lineVal:true})
        const selection = this._getSelected()
        const addBlockInSameline = lineValueSelection.lineVal.length === 0
        const isTextSelected = selection.value.length > 0
        const isWholeLineSelected = lineValueSelection.lineVal === lineValueSelection.value
        const isBeginningOfLineSelected = lineValueSelection.pre.trim() === ""
        const newLineAfterSelection = selection.post[0]==='\n'
        if(isTextSelected){
          if(!(addBlockInSameline || isWholeLineSelected || isBeginningOfLineSelected)) {
            startTag = '\n' + startTag
          }
          if(!newLineAfterSelection) {
            endTag = endTag + '\n'
          }
          this.set('value', `${selection.pre}${startTag}${selection.value}${endTag}${selection.post}`)
          return 
        }
        else {
          if(!addBlockInSameline){
            exampleFormat = '\n'+exampleFormat
          }
          if(!newLineAfterSelection) {
            exampleFormat = exampleFormat + '\n'
          }
          this._insertText(exampleFormat)
          return
        }
      },
      updateCodeByte(index, { text, language }) {
        const editorValue = this.get('value')
        let matchIndex = -1;
        const newValue = editorValue.replace(/\[codebyte( language=(.*))?]\n?(.*)?\n?\[\/codebyte]/g, (match) => {
          matchIndex++;
          return matchIndex === index ? `[codebyte language=${language}]\n${text}\n[/codebyte]` : match;
        });
        this.set('value', newValue);
      },
    },
  });

  function renderCodebyteFrame(language = '', text = '') {
    return loadScript(
      "https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js"
    ).then(() => {
      const frame = document.createElement('iframe');

      const encodedURI = Base64.encodeURI(text);
      frame.allow = "clipboard-write";
      frame.src = `http://localhost:8000/codebyte-editor?lang=${language}&text=${encodedURI}`;

      Object.assign(frame.style, {
        display: 'block',
        height: '400px',
        width: '100%',
        maxWidth: '712px',
        border: 0,
      });

      return frame;
    });
  };

  api.decorateCookedElement((elem) => {
    elem.querySelectorAll("div.d-codebyte").forEach(async (div, index) => {
      const codebyteFrame = await renderCodebyteFrame(div.dataset.language, div.textContent.trim());
      div.innerHTML = '';
      div.appendChild(codebyteFrame);

      if (elem.classList.contains('d-editor-preview')) {
        const saveButton = document.createElement('button');
        saveButton.className = 'btn-primary';
        saveButton.textContent = 'Save to post';
        saveButton.style.marginTop = '24px';
        saveButton.onclick = () => codebyteFrame.contentWindow.postMessage({codeByteSaveRequest: true}, '*');
        div.appendChild(saveButton);
      }
    });
  });
}

export default {
  name: "code-bytes",

  initialize() {
    withPluginApi("0.8.31", initializeCodeByte);
  },
};
