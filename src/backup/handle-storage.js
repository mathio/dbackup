import { createReadStream, statSync } from "fs";
import { Storage } from "megajs";
import { getDir } from "./utils/get-dir.js";
import { log } from "../utils/log.js";

const uploadBackup = async (
  backupDir,
  { archiveFilename, backupDirName, rootDirName }
) => {
  const { size } = statSync(archiveFilename);

  const { name } = await backupDir.upload(
    { name: archiveFilename, size },
    createReadStream(archiveFilename)
  ).complete;

  log(`Upload complete: ${rootDirName}/${backupDirName}/${name}`);
};

const deleteOldBackups = async (backupDir, { daysToKeepBackups }) => {
  const backupExpirationDate = new Date();
  backupExpirationDate.setDate(
    backupExpirationDate.getDate() - daysToKeepBackups
  );
  const backupExpirationTimestamp = Math.floor(
    backupExpirationDate.getTime() / 1000
  );

  for (let [, file] of backupDir.children.entries()) {
    if (!file.directory && file.timestamp < backupExpirationTimestamp) {
      log(`Delete backup: ${file.name}`);
      await file.delete();
    }
  }
};

export const handleStorage = async (config) => {
  const { backupDirName, rootDirName } = config;

  const storage = await new Storage({
    email: "mldevx@gmail.com",
    password: process.env.MEGA_PWD,
  }).ready;

  const rootDir = await getDir(storage.root, rootDirName);
  const backupDir = await getDir(rootDir, backupDirName);

  await uploadBackup(backupDir, config);
  await deleteOldBackups(backupDir, config);

  await storage.close();
};
