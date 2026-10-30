import type { _StepDefaults } from "@/types";

export type CnpjStep = "format" | "repeated" | "checkDigit";

export const defaultMessages: _StepDefaults<CnpjStep> = {
  format: {
    en: "Invalid CNPJ: must be 14 alphanumeric characters in the format AA.AAA.AAA/AAAA-00 or AAAAAAAAAAAA00.",
    pt: "CNPJ inválido: deve conter 14 caracteres alfanuméricos no formato AA.AAA.AAA/AAAA-00 ou AAAAAAAAAAAA00.",
  },
  repeated: {
    en: "Invalid CNPJ: repeated digits are not allowed.",
    pt: "CNPJ inválido: dígitos repetidos não são permitidos.",
  },
  checkDigit: {
    en: "Invalid CNPJ: incorrect check digit.",
    pt: "CNPJ inválido: dígito verificador incorreto.",
  },
};
