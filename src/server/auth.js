import handlebars from "handlebars";
import * as fs from "node:fs";
import { randomFillSync } from "node:crypto";
import { PAGE_TITLE } from "../config.js";

let authTokens = [];
const COOKIE_NAME = "dbackup_token";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const auth = async (req, res, next) => {
  authTokens = authTokens.filter(({ expiresAt }) => expiresAt > Date.now());

  const cookie = req.header("Cookie") || "";
  const [, token] = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`)) || [];

  if (token && authTokens.some((t) => t.token === token)) {
    req.token = token;
    next();
  } else {
    if (req.method.toLowerCase() === "post") {
      const pwd = req.body?.pwd;
      if (pwd && pwd === process.env.ADMIN_PWD) {
        const buf = Buffer.alloc(64);
        const newToken = randomFillSync(buf).toString("base64");

        authTokens.push({ token: newToken, expiresAt: Date.now() + SESSION_TTL_MS });
        res.header(
          "Set-Cookie",
          `${COOKIE_NAME}=${newToken};path=/;HttpOnly;Secure;Max-Age=${SESSION_TTL_MS / 1000}`
        );
        res.redirect(302, "/");
        res.end();
        return;
      }
    }

    const template = handlebars.compile(
      fs.readFileSync("src/server/auth.html", "utf-8")
    );

    res.status(403);
    res.header("Content-type", "text/html");
    res.end(template({ title: PAGE_TITLE }));
  }
};

export const logout = async (req, res) => {
  authTokens = authTokens.filter((t) => t.token !== req.token);
  res.header("Set-Cookie", `${COOKIE_NAME}=;path=/;HttpOnly;Secure;Max-Age=-1`);
  res.redirect(302, "/");
  res.end();
};
