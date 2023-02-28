const makeDecimal = (value) => Math.round(value * 10) / 10;

export const humanSize = (bytesValue) => {
  if (bytesValue < 1024) {
    return `${bytesValue} B`;
  } else if (bytesValue < 1024 * 1024) {
    return `${makeDecimal(bytesValue / 1024, false)} KB`;
  } else {
    return `${makeDecimal(bytesValue / 1024 / 1024, true)} MB`;
  }
};
