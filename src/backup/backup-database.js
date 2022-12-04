import { exec } from "../utils/exec.js";
import { log } from "../utils/log.js";

export const backupDatabase = async ({
  dbConnectionString,
  fileName,
  dbName,
}) => {
  await exec(`pg_dump ${dbConnectionString} -f ${fileName}.sql`);
  await exec(`pg_dump ${dbConnectionString} -Fc -f ${fileName}.dump`);
  await exec(`lzop -fU ${fileName}.sql ${fileName}.dump -o ${fileName}.lzo`);
  log(`Backup created: ${dbName}/${fileName}`);
};
