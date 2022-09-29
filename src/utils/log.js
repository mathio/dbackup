const doLog = (firstLine, lines, logFn) => {
  const time = new Date().toISOString();
  const spacer = new Array(time.length + 1).join(" ");

  logFn(time, firstLine);
  lines?.forEach((line) => {
    logFn(spacer, line);
  });
};

export const log = (firstLine, ...lines) =>
  doLog(firstLine, lines, console.log);

export const error = (firstLine, ...lines) =>
  doLog(firstLine, lines, console.error);
