import { withPluginApi } from "discourse/lib/plugin-api";

function initializeCodeByte(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      title: "CodeBytes",
      id: "codebyte",
      group: "insertions",
      icon: "far-copyright",
      action: () => toolbar.context.send("insertCodeByte"),
    });
  });

  api.modifyClass("component:d-editor", {
    actions: {
      insertCodeByte() {
        this._insertText('[codebyte]\nprint("Hello, world!")\n[/codebyte]');
      },
    },
  });

  api.decorateCookedElement((elem) => {
    const codebyteDivs = elem.querySelectorAll("div.d-codebyte");
    codebyteDivs.forEach((div) => {
      // TODO: Replace with iFrame or other node
      // Content might flash, that's ok.
      // TODO: Check allow list for markdown parser Option B of doing it the Markdown
      // TODO: Plan C: Communicate with a specific iFrame node.
      // TODO: Plan D: Don't use iFrame, but attach a React component.
      div.innerHTML = `<iframe width="560" height="800" src="https://tengu.codecademy.com/student-center" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    });
  });
}

export default {
  name: "code-bytes",

  initialize() {
    withPluginApi("0.8.31", initializeCodeByte);
  },
};
