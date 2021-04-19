import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

const CODEBYTE_CLASS = "d-codebyte";

const blockRule = {
  tag: "codebyte",

  replace(state, tagInfo, content) {
    let token = state.push("codebyte_open", "div", 1);
    token.attrs = [["class", CODEBYTE_CLASS]];
    if (tagInfo.attrs.language) {
      token.attrs.push(['data-language', tagInfo.attrs.language]);
    }
    token = state.push('text', "", 0)
    token.content = content;
    state.push("codebyte_close", "div", -1);
    return true;
  }
};

export function setup(helper) {
  helper.registerOptions((opts,siteSettings)=>{
    opts.features["code-bytes"] = !!siteSettings.code_bytes_enabled;
  });

  helper.registerPlugin((md) => {
    md.block.bbcode.ruler.push("block-codebyte", blockRule);
  });

  helper.allowList([`div.${CODEBYTE_CLASS}`, `span.${CODEBYTE_CLASS}`, "span[data-*]"]);
}
