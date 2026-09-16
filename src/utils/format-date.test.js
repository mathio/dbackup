import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "./format-date.js";

test("formats a unix timestamp with zero-padding", () => {
  const date = new Date(2024, 0, 5, 9, 3);
  assert.equal(formatDate(date.getTime() / 1000), "2024-01-05 09:03");
});
