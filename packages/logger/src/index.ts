import pino from "pino";

/**
 * Logger estruturado para o monorepo.
 *
 * Usa pino para performance e redação automática de dados sensíveis.
 * Em produção, usa JSON estruturado. Em desenvolvimento, usa pretty print.
 *
 * Uso:
 *   import { logger } from "@repo/logger";
 *   logger.info({ userId }, "Usuário autenticado");
 *   logger.error({ err }, "Falha no callback de auth");
 */

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }),
  // Redação automática de campos sensíveis
  redact: {
    paths: [
      "password",
      "token",
      "access_token",
      "refresh_token",
      "authorization",
      "cookie",
      "headers.authorization",
      "headers.cookie",
      "*.password",
      "*.token",
      "*.secret",
    ],
    censor: "[REDACTED]",
  },
});

export type Logger = typeof logger;
