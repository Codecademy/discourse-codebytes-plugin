import { acceptance, queryAll } from "discourse/tests/helpers/qunit-helpers";

acceptance("CodeBytes", function (needs) {
  needs.user();
  needs.settings({ code_bytes_enabled: true });

  test("it inserts a codebyte when the Create a Codebyte composer toolbar button is clicked", async function (assert) {
    await visit("/");
    await click("#create-topic");
    
    await click(".d-editor button.codecademy-codebyte-discourse-btn");
    assert.equal(
      queryAll(".d-editor-input").val(),
      '[codebyte]\n\n[/codebyte]\n',
      "it inserts a blank codebyte when no text is selected"
    );

    await fillIn(
      ".d-editor-input",
      'print("Hello, world!")'
    );
    const textarea = queryAll(".d-editor-input")[0];
    textarea.selectionStart = 0;
    textarea.selectionEnd = textarea.value.length;
    await click(".d-editor button.codecademy-codebyte-discourse-btn");
    assert.equal(
      queryAll(".d-editor-input").val(),
      '[codebyte]\nprint("Hello, world!")\n[/codebyte]\n',
      "it wraps selected text in a [codebyte] tag"
    );
  });

  test("it renders an iframe in the preview area", async function (assert) {
    await visit("/");
    await click("#create-topic");
    
    await fillIn(
      ".d-editor-input",
      '[codebyte]\n\n[/codebyte]'
    );

    assert.equal(
      queryAll(".d-editor-preview .d-codebyte iframe").attr('src'),
      "https://www.codecademy.com/codebyte-editor?lang=&text=",
      "it renders an iframe pointing to the codebyte editor on codecademy.com"
    );
  });

  test("it updates the markdown when the iframe sends a save response message", async function (assert) {
    await visit("/");
    await click("#create-topic");
    
    await fillIn(
      ".d-editor-input",
      '[codebyte]\n\n[/codebyte]'
    );

    await triggerEvent(window, 'message', {
      data: { codeByteSaveResponse: { language: 'python', text: 'new value single line' } },
      source: queryAll(".d-codebyte").first().find('iframe')[0].contentWindow,
    });
    assert.equal(
      queryAll(".d-editor-input").val(),
      '[codebyte language=python]\nnew value single line\n[/codebyte]',
      "it updates the language and text for a newly inserted codebyte"
    );

    await triggerEvent(window, 'message', {
      data: { codeByteSaveResponse: { language: 'python', text: 'new value\nmulti line' } },
      source: queryAll(".d-codebyte").first().find('iframe')[0].contentWindow,
    });
    assert.equal(
      queryAll(".d-editor-input").val(),
      '[codebyte language=python]\nnew value\nmulti line\n[/codebyte]',
      "it updates the text for a codebyte that has one line of text"
    );

    await triggerEvent(window, 'message', {
      data: { codeByteSaveResponse: { language: 'python', text: 'line1\nline2\nline3' } },
      source: queryAll(".d-codebyte").first().find('iframe')[0].contentWindow,
    });
    assert.equal(
      queryAll(".d-editor-input").val(),
      '[codebyte language=python]\nline1\nline2\nline3\n[/codebyte]',
      "it updates the text for a codebyte that has many lines of text"
    );
  });
});
