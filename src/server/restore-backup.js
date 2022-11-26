import { getAllDatabases } from "../utils/get-all-databases.js";
import { exec } from "../utils/exec.js";
import { cleanupFiles } from "../backup/cleanup-files.js";
import { getFile } from "../utils/get-file.js";
import { decompressFile } from "../utils/decompress-file.js";

const restoreDatabase = async (backupPath) => {
  const [dbName, fileName] = backupPath.split("/");

  const [, dbConnectionString] =
    getAllDatabases().find(([name]) => name === dbName) || [];

  if (!dbConnectionString) {
    return false;
  }

  const file = await getFile(backupPath, async (f) =>
    Buffer.from(await f.downloadBuffer(), "base64")
  );
  const bkpFileName = await decompressFile(fileName, file);

  // await exec(`psql ${dbConnectionString} -f ${bkpFileName}.sql`, true);
  await exec(`pg_restore -d ${dbConnectionString} ${bkpFileName}.dump`, true);

  await cleanupFiles(bkpFileName);
  return true;
};

export const restoreBackup = async (req, res) => {
  res.json({
    done: await restoreDatabase(req.body.path),
  });
};
