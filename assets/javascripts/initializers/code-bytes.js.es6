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
        // Check sender origin to be trusted
        // if (event.origin !== "http://example.com") return;
        window.updateCodeByte(event.data);
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

  api.decorateCookedElement((elem) => {
    const codebyteDivs = elem.querySelectorAll("div.d-codebyte");
    codebyteDivs.forEach((div) => {
      const snippet = div.textContent.trim();
      div.innerHTML = `<iframe width="600" height="280" src="http://localhost:8000/codebyte-editor?code=${encodeURIComponent(snippet)}" ></iframe>`;
    });

  });
}

export default {
  name: "code-bytes",

  initialize() {
    withPluginApi("0.8.31", initializeCodeByte);
  }
};
