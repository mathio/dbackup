import { test } from "node:test";
import assert from "node:assert/strict";
import { humanSize } from "./human-size.js";

test("formats bytes, kilobytes and megabytes", () => {
  assert.equal(humanSize(512), "512 B");
  assert.equal(humanSize(2048), "2 KB");
  assert.equal(humanSize(5 * 1024 * 1024), "5 MB");
});
