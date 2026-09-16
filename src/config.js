import { error } from "./utils/log.js";

export const ROOT_DIR_NAME = "db backup";
export const PAGE_TITLE = process.env.ADMIN_TITLE || "🐘 dbackup";

export const THEMES = [
  "teal",
  "copper",
  "violet",
  "steel",
  "mono",
  "garnet",
  "cobalt",
];
const requestedTheme = process.env.ADMIN_THEME;

if (requestedTheme && !THEMES.includes(requestedTheme)) {
  error(
    `Unknown ADMIN_THEME "${requestedTheme}", falling back to "teal"`,
    `Valid values: ${THEMES.join(", ")}`
  );
}

export const THEME = THEMES.includes(requestedTheme) ? requestedTheme : "teal";
