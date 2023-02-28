const envVarPrefix = "DBACKUP_";

const isConnectionString = (value) => value.startsWith("postgres://");

const getConnectionString = (value) => {
  if (isConnectionString(value)) {
    return value;
  }

  const otherEnvVar = process.env[value];
  if (isConnectionString(otherEnvVar)) {
    return otherEnvVar;
  }

  return null;
};

export const getAllDatabases = () =>
  Object.entries(process.env)
    .filter(
      ([key, value]) =>
        key.startsWith(envVarPrefix) && getConnectionString(value)
    )
    .map(([key, value]) => [
      key.substring(envVarPrefix.length).replace("_", " ").toLowerCase(),
      getConnectionString(value),
    ]) || [];
