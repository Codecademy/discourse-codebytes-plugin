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

function applyDataAttributes(token, state, attributes) {
  Object.keys(attributes).forEach((tag) => {
    const value = state.md.utils.escapeHtml(attributes[tag]);
    tag = camelCaseToDash(
      state.md.utils.escapeHtml(tag.replace(/[^A-Za-z\-0-9]/g, ""))
    );

    if (value && tag && tag.length > 1) {
      token.attrs.push([`data-${tag}`, value]);
    }
  });
}

const blockRule = {
  tag: "codebyte",

  replace(state, info, content) {
    let token = state.push("codebyte_open", "div", 1);
    token.attrs = [["class", CODEBYTE_CLASS]];
    // debugger;
    token = state.push('text', "", 0)
    token.content = content
    state.push("codebyte_close", "div", -1);
    return true;
  }

};

const inlineRule = {
  tag: "codebyte",

  replace(state, tagInfo, content) {
    let token = state.push("codebyte_open", "span", 1);
    token.attrs = [["class", CODEBYTE_CLASS]];

    applyDataAttributes(token, state, parseAttributes(tagInfo));

    if (content) {
      token = state.push("text", "", 0);
      token.content = content;
    }

    state.push("codebyte_close", "span", -1);
    return true;
  },
};

export function setup(helper) {
  helper.registerPlugin((md) => {
    md.inline.bbcode.ruler.push("inline-codebyte", inlineRule);
    md.block.bbcode.ruler.push("block-codebyte", blockRule);
  });

  helper.allowList([`div.${CODEBYTE_CLASS}`, `span.${CODEBYTE_CLASS}`, "span[data-*]"]);
}
