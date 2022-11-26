import * as fs from "fs";
import { Storage } from "megajs";
import { getDir } from "../utils/get-dir.js";
import { log } from "../utils/log.js";

const uploadBackup = async (
  backupDir,
  { fileName, backupDirName, rootDirName }
) => {
  const archiveFilename = `${fileName}.lzo`;
  const { size } = fs.statSync(archiveFilename);

  const { name, timeStamp } = await backupDir.upload(
    { name: archiveFilename, size },
    fs.createReadStream(archiveFilename)
  ).complete;

  log(`Upload complete: ${rootDirName}/${backupDirName}/${name}`);

  return {
    name,
    time: timeStamp,
  };
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
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PWD,
  }).ready;

  const rootDir = await getDir(storage.root, rootDirName);
  const backupDir = await getDir(rootDir, backupDirName);

  const result = await uploadBackup(backupDir, config);
  await deleteOldBackups(backupDir, config);

  await storage.close();

  return result;
};
