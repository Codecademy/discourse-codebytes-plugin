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

    const onSaveResponse = (message) => {
      if (toolbar.context.isDestroyed || toolbar.context.isDestroying) {
        window.removeEventListener("message", onSaveResponse);
      } else if (message.data.codeBytesSaveResponse) {
        toolbar.context.send("updateCodeByte", message.data.codeBytesSaveResponse);
      }
    };

    window.addEventListener("message", onSaveResponse, false);
  });

  api.modifyClass("component:d-editor", {
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
      updateCodeByte({code, language, index}) {
        let matchIndex = -1;
        editorValue.replace(/\[codebyte( language=(.*))?]\n?(.*)?\n?\[\/codebyte]/g, (match) => {
          matchIndex++;
          return matchIndex === index ? `[codebyte language=${language}]\n${code}\n[/codebyte]` : match;
        });
      },
    },
  });

  function renderCodebyteFrame(language = '', code = '') {
    return loadScript(
      "https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js"
    ).then(() => {
      const frame = document.createElement('iframe');

      const encodedURI = Base64.encodeURI(code);
      frame.src = `http://localhost:8000/codebyte-editor?lang=${language}&code=${encodedURI}`;

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
    elem.querySelectorAll("div.d-codebyte").forEach( async (div, index) => {
      const codebyteFrame = await renderCodebyteFrame(div.dataset.language, div.textContent.trim());
      div.innerHTML = '';
      div.appendChild(codebyteFrame);

      if (elem.classList.contains('d-editor-preview')) {
        const saveButton = document.createElement('button');
        saveButton.className = 'btn-primary';
        saveButton.textContent = 'Save to post';
        saveButton.style.marginTop = '24px';
        saveButton.onclick = () => codebyteFrame.contentWindow.postMessage({codeBytesSaveRequested: {id: index}}, '*');
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
