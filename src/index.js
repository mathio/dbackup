import { backup } from "./backup/index.js";
import { log } from "./utils/log.js";

const envVarPrefix = "DBACKUP_";

const getAllDatabasesToBackup = () =>
  Object.entries(process.env)
    .filter(
      ([key, value]) =>
        key.startsWith(envVarPrefix) && value.startsWith("postgres://")
    )
    .map(([key, value]) => [
      key.substring(envVarPrefix.length).replace("_", " ").toLowerCase(),
      value,
    ]);

const backupAll = async () => {
  const dbsToBackup = getAllDatabasesToBackup();

  if (dbsToBackup.length === 0) {
    log("No databases to backup");
  } else {
    log("Starting backups:", ...dbsToBackup.map(([name]) => `- ${name}`));
    await Promise.all(dbsToBackup.map(([name, uri]) => backup(name, uri)));
    log("All backups complete");
  }
};

backupAll();
