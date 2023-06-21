import { formatDate } from "../utils/format-date.js";
import { getFile } from "../utils/get-file.js";
import { humanSize } from "../utils/human-size.js";

const checkBackupFile = async (backupPath) => {
  const backupFile = await getFile(backupPath);

  if (backupFile) {
    return {
      name: backupFile.name,
      timestamp: backupFile.timestamp,
      date: formatDate(backupFile.timestamp),
      size: humanSize(backupFile?.size),
    };
  }

  return false;
};

export const checkBackup = async (req, res) => {
  const file = await checkBackupFile(req.body.path);
  res.json(
    file
      ? {
          ready: true,
          ...file,
        }
      : {
          ready: false,
        }
  );
};
