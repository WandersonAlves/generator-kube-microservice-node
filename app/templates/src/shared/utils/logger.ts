import { createLogger, format, transports } from 'winston';
const { printf, colorize } = format;
const colorizer = colorize();

const timestampFormatter = () =>
  new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

const consoleFormatter = printf(({ stack, level, message, label, timestamp }: { [key: string]: string }) => {
  const levelLabelColorized = colorizer.colorize(level, `${level}:${label}`);
  const timestampColorized = `\u{1b}[90;1m${new Date(timestamp).toLocaleTimeString('pt-BR', { hour12: false })}\u{1b}[0m`;
  return `${timestampColorized} ${levelLabelColorized}: ${stack ? stack : message}`;
});

const baseLogger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { label: 'main' },
  // @ts-ignore
  format: format.combine(format.errors({ stack: true }), format.timestamp({ format: timestampFormatter })),
});

/**
 * Returns a pretty represetation of a json for a give object
 * @param obj An object
 */
export const jsonString = (obj: any) => `\n${JSON.stringify(obj, null, 2)}\n`;

baseLogger.add(
  new transports.Console({
    format: consoleFormatter,
  }),
);

export const logger = baseLogger;
