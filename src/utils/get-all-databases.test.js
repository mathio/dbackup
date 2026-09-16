import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllDatabases } from "./get-all-databases.js";

test("reads DBACKUP_ env vars into [name, connectionString] pairs", () => {
  process.env.DBACKUP_MY_DB = "postgres://user:pass@host/db";
  process.env.DBACKUP_INDIRECT = "OTHER_ENV_VAR";
  process.env.OTHER_ENV_VAR = "postgres://user:pass@host/other";
  process.env.DBACKUP_INVALID = "not-a-connection-string";

  const result = Object.fromEntries(getAllDatabases());

  assert.equal(result["my db"], "postgres://user:pass@host/db");
  assert.equal(result["indirect"], "postgres://user:pass@host/other");
  assert.equal(result["invalid"], undefined);

  delete process.env.DBACKUP_MY_DB;
  delete process.env.DBACKUP_INDIRECT;
  delete process.env.OTHER_ENV_VAR;
  delete process.env.DBACKUP_INVALID;
});
