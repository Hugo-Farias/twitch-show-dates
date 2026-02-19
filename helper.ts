const { log, warn, error } = console;

const logPrefix = "tsd:";

export const clog = (...content: Parameters<typeof log>) => {
  log(logPrefix, ...content);
};

export const dlog = (...content: Parameters<typeof log>) => {
  if (!import.meta.env.DEV) return;
  log("dev", logPrefix, ...content);
};
