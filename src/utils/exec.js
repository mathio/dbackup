import { spawn } from "node:child_process";

export const exec = async (cmdName, args = [], ignoreErrors = false) => {
  return new Promise((resolve) => {
    const spawnedCmd = spawn(cmdName, args);

    spawnedCmd.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    spawnedCmd.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    spawnedCmd.on("exit", (code) => {
      if (code !== 0 && !ignoreErrors) {
        throw new Error(`${cmdName} ${args.join(" ")}`);
      }
      resolve();
    });
  });
};
