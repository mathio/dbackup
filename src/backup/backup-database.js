import { exec } from "./utils/exec.js";
import { log } from "../utils/log.js";

export const backupDatabase = async ({ dbConnectionString, sqlFilename }) => {
  await exec(`pg_dump ${dbConnectionString} -f ${sqlFilename}`);
  await exec(`lzop -f ${sqlFilename} ${sqlFilename}`);
  log(`Backup created: ${sqlFilename}`);
};
