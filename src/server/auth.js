import handlebars from "handlebars";
import * as fs from "fs";
import { randomFillSync } from "node:crypto";
import { PAGE_TITLE } from "../config.js";

const authTokens = [];
const COOKIE_NAME = "dbackup_token";

export const auth = async (req, res, next) => {
  const cookie = req.header("Cookie") || "";
  const [, token] = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`)) || [];

  if (token && authTokens.includes(token)) {
    req.token = token;
    next();
  } else {
    if (req.method.toLowerCase() === "post") {
      const pwd = req.body.pwd;
      if (pwd && pwd === process.env.ADMIN_PWD) {
        const buf = Buffer.alloc(64);
        const newToken = randomFillSync(buf).toString("base64");

        authTokens.push(newToken);
        res.header("Set-Cookie", `${COOKIE_NAME}=${newToken};path=/;HttpOnly;`);
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
  authTokens.splice(authTokens.indexOf(req.token), 1);
  res.header("Set-Cookie", `${COOKIE_NAME}=;path=/;HttpOnly;Max-Age=-1`);
  res.redirect(302, "/");
  res.end();
};
