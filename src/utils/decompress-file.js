import fs from "fs";
import { exec } from "./exec.js";

const createFile = async (fileName, buffer) => {
  const stream = fs.createWriteStream(fileName);
  stream.write(buffer);
  stream.end();
  await new Promise((res) => setTimeout(res, 2_000));
};

export const decompressFile = async (fileName, buffer) => {
  await createFile(fileName, buffer);
  await exec(`lzop -dfq ${fileName} --ignore-warn`);
  return fileName.replace(/\.lzo$/, "");
};
