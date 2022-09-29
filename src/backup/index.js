import { backupDatabase } from "./backup-database.js";
import { handleStorage } from "./handle-storage.js";
import { cleanupFiles } from "./cleanup-files.js";
import { error } from "../utils/log.js";

export const backup = async (dbName, dbConnectionString) => {
  if (!dbName || !dbConnectionString) {
    error(`Error during backup of ${dbName}`);
    return;
  }

  const now = new Date().toISOString();
  const getFilename = (ext) =>
    `${now}-${dbName.replace(" ", "-")}-backup.${ext}`;

  const config = {
    dbName,
    dbConnectionString,
    daysToKeepBackups: 30,
    sqlFilename: getFilename("sql"),
    archiveFilename: getFilename("sql.lzo"),
    rootDirName: "db backup",
    backupDirName: `${dbName}`,
  };

  await backupDatabase(config);
  await handleStorage(config);
  await cleanupFiles(config);
};
