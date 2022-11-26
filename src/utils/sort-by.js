export const sortBy =
  (key, asc = true) =>
  (a, b) => {
    if (a[key] < b[key]) {
      return asc ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return asc ? 1 : -1;
    }
    return 0;
  };
