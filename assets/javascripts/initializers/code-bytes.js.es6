import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

function initializeCodeByte(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      title: "CodeBytes",
      id: "codebyte",
      group: "insertions",
      icon: "far-copyright",
      action: () => toolbar.context.send("insertCodeByte", "test"),
    });

    const onSaveResponse = (message) => {
      if (message.data.codeBytesSaveResponse)
        toolbar.context.send("updateCodeByte", message.data.codeBytesSaveResponse);
    };

    window.addEventListener("message", onSaveResponse, false);
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
