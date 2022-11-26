import { Storage } from "megajs";
import { getDir } from "./get-dir.js";
import { ROOT_DIR_NAME } from "../config.js";
import { findByName } from "./find-by-name.js";

const returnAsIs = (value) => value;

export const getFile = async (backupPath, operation = returnAsIs) => {
  const storage = await new Storage({
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PWD,
  }).ready;

  const [dirName, fileName] = backupPath.split("/");

  const rootDir = await getDir(storage.root, ROOT_DIR_NAME);
  const backupDir = findByName(rootDir?.children, dirName);
  const backupFile = findByName(backupDir?.children, fileName);

  if (!backupFile) {
    return false;
  }

  const result = await operation(backupFile);
  await storage.close();
  return result;
};
