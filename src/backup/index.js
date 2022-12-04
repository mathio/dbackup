import { backupDatabase } from "./backup-database.js";
import { handleStorage } from "./handle-storage.js";
import { error } from "../utils/log.js";
import { ROOT_DIR_NAME } from "../config.js";

export const backup = async (
  dbName,
  dbConnectionString,
  startCallback = null
) => {
  if (!dbName || !dbConnectionString) {
    error(`Error during backup of ${dbName}`);
    return;
  }

  const now = new Date().toISOString();
  const fileName = `${now}-${dbName.replace(" ", "-")}-backup`;

  const config = {
    dbName,
    dbConnectionString,
    daysToKeepBackups: 30,
    fileName,
    rootDirName: ROOT_DIR_NAME,
    backupDirName: `${dbName}`,
  };

  if (startCallback) {
    startCallback(`${fileName}.lzo`);
  }

  await backupDatabase(config);
  return await handleStorage(config);
};
