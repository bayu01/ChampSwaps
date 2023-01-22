import * as winston from "winston";
import "winston-daily-rotate-file";
const { combine, timestamp, json } = winston.format;

export const eventlogger = winston.createLogger({
  // Creates quite a lot of chattiness across all endpoints X_X
  format: winston.format.combine(
    winston.format.printf((obj) => {
      return `{"uri": "${obj.message.uri}", "data": ${JSON.stringify(
        obj.message.data
      )}}`;
    })
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      filename: "logs/local-agent-event-%DATE%.log",
      auditFile: false,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export const lolChatlogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      filename: "logs/lol-chat-%DATE%.log",
      auditFile: false,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export const sessionlogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      filename: "logs/champ-select-session-%DATE%.log",
      auditFile: false,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
export const lcuResponselogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      filename: "logs/lol-summoners-%DATE%.log",
      auditFile: false,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
