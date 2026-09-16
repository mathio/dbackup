import { test } from "node:test";
import assert from "node:assert/strict";
import { findByName } from "./find-by-name.js";

test("finds entry by name in a children array, or returns null", () => {
  const children = [{ name: "foo" }, { name: "bar" }];
  assert.equal(findByName(children, "bar"), children[1]);
  assert.equal(findByName(children, "missing"), null);
  assert.equal(findByName(null, "foo"), null);
});
