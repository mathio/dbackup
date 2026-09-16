import handlebars from "handlebars";
import * as fs from "node:fs";
import { Storage } from "megajs";
import { PAGE_TITLE, ROOT_DIR_NAME, THEME } from "../config.js";
import { getDir } from "../utils/get-dir.js";
import { formatDate } from "../utils/format-date.js";
import { sortBy } from "../utils/sort-by.js";
import { humanSize } from "../utils/human-size.js";
import { getAllDatabases } from "../utils/get-all-databases.js";
import { error } from "../utils/log.js";

const getConfiguredDatabases = () => getAllDatabases().map(([name]) => name);

const getBackups = async () => {
  const storage = await new Storage({
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PWD,
  }).ready;

  const rootDir = await getDir(storage.root, ROOT_DIR_NAME);
  const backupDirs = rootDir?.children?.filter((c) => c.directory) || [];

  await storage.close();

  const allDbNames = getConfiguredDatabases();
  const connectedDbNames = new Set(allDbNames);

  const envVarName = (name) => `DBACKUP_${name.toUpperCase().replace(/\s+/g, "_")}`;

  const existingBackups = backupDirs.map(({ name, children }) => ({
    backup: name,
    connected: connectedDbNames.has(name),
    envVarName: envVarName(name),
    files: children
      ?.filter((c) => !c.directory)
      .map(({ name, timestamp, size }) => ({
        name,
        timestamp,
        date: formatDate(timestamp),
        size: humanSize(size),
      }))
      .sort(sortBy("timestamp", false)),
  }));

  const existingNames = new Set(existingBackups.map((b) => b.backup));
  const missingBackups = allDbNames
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ backup: name, connected: true, files: [] }));

  return [...existingBackups, ...missingBackups].sort(sortBy("backup"));
};

export const viewBackups = async (req, res) => {
  const template = handlebars.compile(
    fs.readFileSync("src/server/view-backups.html", "utf-8")
  );

  let backups;
  let storageError = null;

  try {
    backups = await getBackups();
  } catch (err) {
    error("Failed to connect to backup storage", err.message);
    storageError = "Could not connect to backup storage. Check MEGA_EMAIL and MEGA_PWD.";
    backups = getConfiguredDatabases()
      .map((name) => ({ backup: name, connected: true, files: [] }))
      .sort(sortBy("backup"));
  }

  res.header("Content-type", "text/html");
  res.end(
    template({
      title: PAGE_TITLE,
      theme: THEME,
      backups,
      storageError,
    })
  );
};
