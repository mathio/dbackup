import * as fs from "node:fs";

export const cleanupFiles = async (fileName) => {
  fs.readdirSync(".").forEach((file) => {
    if (file.startsWith(fileName)) {
      fs.unlinkSync(file);
    }
  });
};
