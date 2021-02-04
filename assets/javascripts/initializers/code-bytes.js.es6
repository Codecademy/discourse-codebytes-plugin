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
}

export default {
  name: "code-bytes",

  initialize() {
    withPluginApi("0.8.31", initializeCodeByte);
  }
};
