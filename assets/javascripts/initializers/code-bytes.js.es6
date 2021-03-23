import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

function initializeCodeByte(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      title: "CodeBytes",
      id: "codebyte",
      group: "insertions",
      icon: "far-copyright",
      action: () => toolbar.context.send("insertCodeByte")
    });

    const onSaveResponse = (message) => {
      if (message.data.codeBytesSaveResponse)
      console.log(message)
        toolbar.context.send("updateCodeByte", message.data.codeBytesSaveResponse);
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
          console.log(lineValueSelection, selection)
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

  function renderCodebyteFrame(params = {}) {
    const frame = document.createElement('iframe');

    const encodedURI = Base64.encodeURI(params.code);
    frame.src = `http://localhost:8000/codebyte-editor?code=${encodedURI}`;

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
      const codebyteFrame = renderCodebyteFrame({
        code: div.textContent.trim()
      });
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
