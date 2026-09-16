import { test } from "node:test";
import assert from "node:assert/strict";
import { sortBy } from "./sort-by.js";

test("sorts ascending and descending by key", () => {
  const items = [{ n: 3 }, { n: 1 }, { n: 2 }];
  assert.deepEqual(
    items
      .slice()
      .sort(sortBy("n"))
      .map((i) => i.n),
    [1, 2, 3],
  );
  assert.deepEqual(
    items
      .slice()
      .sort(sortBy("n", false))
      .map((i) => i.n),
    [3, 2, 1],
  );
});
