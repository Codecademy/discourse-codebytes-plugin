import { withPluginApi } from "discourse/lib/plugin-api";

function initializeCodeByte(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      title: "CodeBytes",
      id: "codebyte",
      group: "insertions",
      icon: "far-copyright",
      action: () => toolbar.context.send("insertCodeByte", "test"),
    });

    window.updateCodeByte = function(footext) {
      toolbar.context.send("updateCodeByte", footext);
    };

    if (window.addEventListener) {
      window.addEventListener("message", onMessage, false);        
    } 
    else if (window.attachEvent) {
        window.attachEvent("onmessage", onMessage, false);
    }
    
    function onMessage(event) {
      if (event.data.payload) {
        window.updateCodeByte(event.data.payload);
      }
    }

  });

  api.modifyClass("component:d-editor", {
    actions: {
      insertCodeByte(text) {
        this._insertText('[codebyte]\n' + text + '\n[/codebyte]');
      },
      updateCodeByte(text) {
        this.set("value", '[codebyte]\n' + text + '\n[/codebyte]');
      },
    },
  });

  function renderCodebyteFrame() {
    const frame = document.createElement('iframe');

    frame.src = `http://localhost:8000/codebyte-editor`;

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
      const code = div.textContent.trim();
      const codebyteFrame = renderCodebyteFrame({
        code
      });
      div.innerHTML = '';
      div.appendChild(codebyteFrame);      

      const onReady = (event) => {
        if (event.data === 'READY') {
          codebyteFrame.contentWindow.postMessage({ payload: { code } }, '*')
          window.removeEventListener('message', onReady);
        }
      }
      
      window.addEventListener('message', onReady, false)


      if (elem.classList.contains('d-editor-preview')) {
        const saveButton = document.createElement('button');
        saveButton.className = 'btn-primary';
        saveButton.textContent = 'Save to post';
        saveButton.style.marginTop = '24px';
        saveButton.onclick = () => codebyteFrame.contentWindow.postMessage({payload: {save: true}}, '*');
        div.appendChild(saveButton);
      }
    });
  });
}

export default {
  name: "code-bytes",

  initialize() {
    withPluginApi("0.8.31", initializeCodeByte);
  }
};
