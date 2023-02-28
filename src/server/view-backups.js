import handlebars from "handlebars";
import * as fs from "fs";
import { Storage } from "megajs";
import { PAGE_TITLE, ROOT_DIR_NAME } from "../config.js";
import { getDir } from "../utils/get-dir.js";
import { formatDate } from "../utils/format-date.js";
import { sortBy } from "../utils/sort-by.js";
import { humanSize } from "../utils/human-size.js";

const getBackups = async () => {
  const storage = await new Storage({
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PWD,
  }).ready;

  const rootDir = await getDir(storage.root, ROOT_DIR_NAME);
  const backupDirs = rootDir?.children?.filter((c) => c.directory) || [];

  await storage.close();

  return backupDirs.sort(sortBy("name")).map(({ name, children }) => {
    return {
      backup: name,
      files: children
        ?.filter((c) => !c.directory)
        .map(({ name, timestamp, size }) => ({
          name,
          timestamp,
          date: formatDate(timestamp),
          size: humanSize(size),
        }))
        .sort(sortBy("timestamp", false)),
    };
  });
};

export const viewBackups = async (req, res) => {
  const backups = await getBackups();
  const template = handlebars.compile(
    fs.readFileSync("src/server/view-backups.html", "utf-8")
  );

  res.header("Content-type", "text/html");
  res.end(
    template({
      title: PAGE_TITLE,
      backups,
    })
  );
};
