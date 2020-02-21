import * as appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';
const { printf, colorize } = format;
const colorizer = colorize();

const consoleFormatter = printf(({ level, message, label, timestamp }: { [key: string]: string }) => {
  const levelLabelColorized = colorizer.colorize(level, `${level}:${label}`);
  const timestampColorized = `\u{1b}[90;1m${new Date(timestamp).toLocaleTimeString('pt-BR', { hour12: false })}\u{1b}[0m`;
  return `${timestampColorized} ${levelLabelColorized}: ${message}`;
});

const fileFormatter = printf(({ level, message, label, timestamp }: { [key: string]: string }) => {
  const hour = new Date(timestamp).toLocaleTimeString('pt-BR', { hour12: false });
  return `${hour} ${level}:${label} - ${message}`;
});

export const logger = createLogger({
  level: 'silly',
  defaultMeta: { label: 'main' },
  format: format.combine(format.timestamp()),
  transports: [
    new transports.File({
      level: 'info',
      handleExceptions: true,
      filename: `${appRoot}/logs/app.log`,
      format: fileFormatter,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.Console({
      format: consoleFormatter,
    }),
  ],
});
