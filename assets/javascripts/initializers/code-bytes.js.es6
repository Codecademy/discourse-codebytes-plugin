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
        const exampleFormat = '[codebyte]\nhello world\n[/codebyte]'
        const lineValueSelection = this._getSelected("", {lineVal:true})
        const selection = this._getSelected()
        const addBlockInline = lineValueSelection.lineVal.length === 0
        const isTextSelected = selection.value.length > 0
        if(isTextSelected){
          if(addBlockInline || 
            lineValueSelection.lineVal === lineValueSelection.value || 
            lineValueSelection.pre.trim() === ""){
            this.set('value',`${selection.pre}[codebyte]\n${selection.value}\n[/codebyte]${selection.post}`)
          } else {
            this.set('value',`${selection.pre}\n[codebyte]\n${selection.value}\n[/codebyte]${selection.post}`)
          }
          return 
        }
        else {
          if(addBlockInline){
            this._insertText(exampleFormat)
          } else {
            this._insertText(`\n${exampleFormat}`)
          }
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
