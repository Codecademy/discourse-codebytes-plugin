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
        const addBlockInNewLine = lineValueSelection.lineVal.length === 0
        const isTextSelected = selection.value.length > 0
        if(isTextSelected){
          this.set('value',`${selection.pre}[codebyte]\n${selection.value}\n[/codebyte]${selection.post}`)
          return 
        }
        else {
          if(addBlockInNewLine){
            this._insertText(exampleFormat)
          } else {
            this._insertText(`\n${exampleFormat}`)
          }
          return
        }
      },
      updateCodeByte(text) {
        const startTag = '[codebyte]'
        const endTag = '[/codebyte]'
        const editorValue = this.get('value')
        const startTagPos = editorValue.indexOf(startTag)
        const endTagPos = editorValue.indexOf(endTag)
        const preValue = editorValue.slice(0,startTagPos)
        const postValue = editorValue.slice(endTagPos+endTag.length)
        const codeBlock = `${startTag}\n${text}\n${endTag}`
        this.set('value', `${preValue}${codeBlock}${postValue}`)
        
      },
    },
  });

  function renderCodebyteFrame(language = '', code = '') {
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
  }

  api.decorateCookedElement((elem) => {
    elem.querySelectorAll("div.d-codebyte").forEach((div) => {
      const codebyteFrame = renderCodebyteFrame(div.dataset.language, div.textContent.trim());
      div.innerHTML = '';
      div.appendChild(codebyteFrame);

      if (elem.classList.contains('d-editor-preview')) {
        const saveButton = document.createElement('button');
        saveButton.className = 'btn-primary';
        saveButton.textContent = 'Save to post';
        saveButton.style.marginTop = '24px';
        saveButton.onclick = () => codebyteFrame.contentWindow.postMessage({codeBytesSaveRequested: true}, '*');
        div.appendChild(saveButton);
      }
    });
  });
}

export default {
  name: "code-bytes",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      loadScript(
        "https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js"
      ).then(() => {
        return initializeCodeByte(api);
      });
    });
  },
};
