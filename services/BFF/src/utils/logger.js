import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "auth-imagebox-BFF",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
