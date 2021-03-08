import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

const CODEBYTE_CLASS = "d-codebyte";

function parseAttributes(tagInfo) {
  const attributes = tagInfo.attrs._default || "";

  return (
    parseBBCodeTag(`[codebyte codebyte=${attributes}]`, 0, attributes.length + 20)
      .attrs || {}
  );
}

function camelCaseToDash(str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}

const blockRule = {
  tag: "codebyte",

  replace(state, info, content) {
    let token = state.push("codebyte_open", "div", 1);
    token.attrs = [["class", CODEBYTE_CLASS]];
    token = state.push('text', "", 0)
    token.content = content;
    state.push("codebyte_close", "div", -1);
    return true;
  }
};

export function setup(helper) {
  helper.registerPlugin((md) => {
    md.block.bbcode.ruler.push("block-codebyte", blockRule);
  });

  helper.allowList([`div.${CODEBYTE_CLASS}`, `span.${CODEBYTE_CLASS}`, "span[data-*]"]);
}
