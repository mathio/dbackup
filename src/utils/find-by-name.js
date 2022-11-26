export const findByName = (map, name) => {
  if (map) {
    for (let [key, value] of map.entries()) {
      if (value?.name === name) {
        return map[key];
      }
    }
  }
  return null;
};
