const findByName = (map, name) => {
  if (map) {
    for (let [key, value] of map.entries()) {
      if (value?.name === name) {
        return map[key];
      }
    }
  }
  return null;
};

export const getDir = async (parent, name) => {
  let dir = findByName(parent.children, name);
  if (dir) {
    return dir;
  }
  await parent.mkdir(name);
  return findByName(parent.children, name);
};
