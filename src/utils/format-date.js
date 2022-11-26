const padWithZero = (value) => (value < 10 ? `0${value}` : `${value}`);

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);

  const day = padWithZero(date.getDate());
  const month = padWithZero(date.getMonth() + 1);
  const year = padWithZero(date.getFullYear());

  const hour = padWithZero(date.getHours());
  const minute = padWithZero(date.getMinutes());

  return `${year}-${month}-${day} ${hour}:${minute}`;
};
