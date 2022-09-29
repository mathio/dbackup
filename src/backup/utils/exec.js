import { spawn } from "node:child_process";

export const exec = async (cmd) => {
  return new Promise((resolve) => {
    const [cmdName, ...args] = cmd.split(" ");
    const spawnedCmd = spawn(cmdName, args);

    spawnedCmd.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    spawnedCmd.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    spawnedCmd.on("exit", (code) => {
      if (code !== 0) {
        throw new Error(cmd);
      }
      resolve();
    });
  });
};
