import express from "express";
import secure from "express-force-https";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { auth, logout } from "./server/auth.js";
import { viewBackups } from "./server/view-backups.js";
import { newBackup } from "./server/new-backup.js";
import { checkBackup } from "./server/check-backup.js";
import { restoreBackup } from "./server/restore-backup.js";
import { downloadBackup } from "./server/download-backup.js";
import { removeBackup } from "./server/remove-backup.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(secure);
app.use(compression());
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: false,
    legacyHeaders: false,
    message: {},
  })
);

app.use(
  express.static("src/server/static", {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      res.setHeader("cache-control", "private, max-age=0, must-revalidate");
    },
  })
);

app.use(express.urlencoded({ extended: true }), auth);
app.use("/logout", logout);

app.get("/", viewBackups);

app.use(express.json());
app.post("/api/new", newBackup);
app.post("/api/check", checkBackup);
app.post("/api/restore", restoreBackup);
app.post("/api/download", downloadBackup);
app.post("/api/remove", removeBackup);

app.listen(port, () => {
  console.log(`server @ ${port}`);
});
