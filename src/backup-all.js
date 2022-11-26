import { backup } from "./backup/index.js";
import { log } from "./utils/log.js";
import { getAllDatabases } from "./utils/get-all-databases.js";

const backupAll = async () => {
  const dbsToBackup = getAllDatabases();

  if (dbsToBackup.length === 0) {
    log("No databases to backup");
  } else {
    log("Starting backups:", ...dbsToBackup.map(([name]) => `- ${name}`));
    await Promise.all(dbsToBackup.map(([name, uri]) => backup(name, uri)));
    log("All backups complete");
  }
};

backupAll();
