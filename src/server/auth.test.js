import { test } from "node:test";
import assert from "node:assert/strict";
import { auth } from "./auth.js";

const fakeRes = () => {
  const res = { statusCode: null, headers: {}, ended: false, redirected: null };
  res.header = (name, value) => (res.headers[name] = value);
  res.status = (code) => (res.statusCode = code);
  res.redirect = (code, url) => (res.redirected = { code, url });
  res.end = () => (res.ended = true);
  return res;
};

test("does not crash and shows login page when POST has no body", async () => {
  const req = { header: () => "", method: "POST", body: undefined };
  const res = fakeRes();
  await auth(req, res, () => assert.fail("next should not be called"));
  assert.equal(res.statusCode, 403);
  assert.equal(res.ended, true);
});

test("sets a cookie and redirects on correct password", async () => {
  process.env.ADMIN_PWD = "secret";
  const req = { header: () => "", method: "POST", body: { pwd: "secret" } };
  const res = fakeRes();
  await auth(req, res, () => assert.fail("next should not be called"));
  assert.equal(res.redirected.url, "/");
  assert.match(res.headers["Set-Cookie"], /^dbackup_token=/);
  delete process.env.ADMIN_PWD;
});
