import type { _StepDefaults } from "@/types";

export type CepStep = "format" | "repeated" | "range";

export const defaultMessages: _StepDefaults<CepStep> = {
  format: {
    en: "Invalid CEP: must be 8 digits in the format 00000-000 or 00000000.",
    pt: "CEP inválido: deve conter 8 dígitos no formato 00000-000 ou 00000000.",
  },
  repeated: {
    en: "Invalid CEP: repeated digits are not allowed.",
    pt: "CEP inválido: dígitos repetidos não são permitidos.",
  },
  range: {
    en: "Invalid CEP: out of the valid range (01000-000 to 98999-999).",
    pt: "CEP inválido: fora da faixa válida (01000-000 a 98999-999).",
  },
};
