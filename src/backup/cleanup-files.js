import { exec } from "./utils/exec.js";

export const cleanupFiles = ({ archiveFilename, sqlFilename }) =>
  exec(`rm ${sqlFilename} ${archiveFilename}`);
