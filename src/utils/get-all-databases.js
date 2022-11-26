const envVarPrefix = "DBACKUP_";

export const getAllDatabases = () =>
  Object.entries(process.env)
    .filter(
      ([key, value]) =>
        key.startsWith(envVarPrefix) && value.startsWith("postgres://")
    )
    .map(([key, value]) => [
      key.substring(envVarPrefix.length).replace("_", " ").toLowerCase(),
      value,
    ]) || [];
