import * as fs from "fs";
import { cleanupFiles } from "../backup/cleanup-files.js";
import { getFile } from "../utils/get-file.js";
import { decompressFile } from "../utils/decompress-file.js";

const getDecompressedFile = async (backupPath, buffer, extension) => {
  const [, archiveFileName] = backupPath.split("/");
  const fileName = await decompressFile(archiveFileName, buffer);
  const file = fs.readFileSync(`${fileName}.${extension}`, "utf-8");
  await cleanupFiles(fileName);
  return file;
};

export const downloadBackup = async (req, res) => {
  const { path, format = "archive" } = req.body;
  const file = await getFile(path, async (f) =>
    Buffer.from(await f.downloadBuffer(), "base64")
  );

  if (format === "sql") {
    res.setHeader("Content-type", "text/plain");
    res.end(await getDecompressedFile(path, file, format));
  } else if (format === "dump") {
    res.setHeader("Content-type", "application/octet-stream");
    res.end(await getDecompressedFile(path, file, format));
  } else {
    res.setHeader("Content-type", "application/octet-stream");
    res.end(file);
  }
};
