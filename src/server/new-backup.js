import { getAllDatabases } from "../utils/get-all-databases.js";
import { backup } from "../backup/index.js";

const createNewBackup = async (dbName, callback) => {
  const [, dbConnectionString] =
    getAllDatabases().find(([name]) => name === dbName) || [];

  if (dbConnectionString) {
    return await backup(dbName, dbConnectionString, callback);
  } else {
    return callback(null);
  }
};

export const newBackup = async (req, res) => {
  createNewBackup(req.body.name, (filename) => {
    res.json({
      filename,
    });
  });
};
