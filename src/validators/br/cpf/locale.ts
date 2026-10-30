import type { _StepDefaults } from "@/types";

export type CpfStep = "format" | "repeated" | "checkDigit";

export const defaultMessages: _StepDefaults<CpfStep> = {
  format: {
    en: "Invalid CPF: must be 11 digits in the format 000.000.000-00 or 00000000000.",
    pt: "CPF inválido: deve conter 11 dígitos no formato 000.000.000-00 ou 00000000000.",
  },
  repeated: {
    en: "Invalid CPF: repeated digits are not allowed.",
    pt: "CPF inválido: dígitos repetidos não são permitidos.",
  },
  checkDigit: {
    en: "Invalid CPF: incorrect check digit.",
    pt: "CPF inválido: dígito verificador incorreto.",
  },
};
