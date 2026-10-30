import type { _StepDefaults } from "@/types";

export type PortStep = "format" | "range";

export const defaultMessages: _StepDefaults<PortStep> = {
  format: {
    en: "Invalid port: must be an integer.",
    pt: "Porta inválida: deve ser um inteiro.",
  },
  range: {
    en: "Invalid port: must be an integer between 0 and 65535.",
    pt: "Porta inválida: deve ser um inteiro entre 0 e 65535.",
  },
};
