import pinoLogger, { Logger } from "pino";

let logger: Logger;
export const getLogger = () => {
  if (!logger) {
    const deploymentEnv = process.env.NODE_ENV || "development";
    logger = pinoLogger({
      level: deploymentEnv === "production" ? "info" : "debug",
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: () =>
        `,"timestamp":"${new Date(Date.now()).toLocaleString()}"`,
    });
  }
  return logger;
};
