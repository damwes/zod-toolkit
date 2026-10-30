import type { _StepDefaults } from "@/types";

export type DatabaseUrlStep = "format" | "protocol";

export const DATABASE_PROTOCOLS = [
  "postgres",
  "postgresql",
  "mysql",
  "mongodb",
  "mongodb+srv",
  "redis",
  "rediss",
] as const;

export const defaultMessages: _StepDefaults<DatabaseUrlStep> = {
  format: {
    en: "Invalid database URL: must be a valid URL.",
    pt: "URL de banco de dados inválida: deve ser uma URL válida.",
  },
  protocol: {
    en: "Invalid database URL: protocol must be one of postgres, postgresql, mysql, mongodb, mongodb+srv, redis, or rediss.",
    pt: "URL de banco de dados inválida: o protocolo deve ser postgres, postgresql, mysql, mongodb, mongodb+srv, redis ou rediss.",
  },
};
