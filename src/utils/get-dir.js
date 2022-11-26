import { findByName } from "./find-by-name.js";

export const getDir = async (parent, name) => {
  let dir = findByName(parent.children, name);
  if (dir) {
    return dir;
  }
  await parent.mkdir(name);
  return findByName(parent.children, name);
};
