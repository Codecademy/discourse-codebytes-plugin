import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("CodeBytes", { loggedIn: true });

test("CodeBytes works", async assert => {
  await visit("/admin/plugins/code-bytes");

  assert.ok(false, "it shows the CodeBytes button");
});
