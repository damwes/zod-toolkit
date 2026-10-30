import type { _StepDefaults } from "@/types";

export type PasswordStep =
  | "length"
  | "lowercase"
  | "uppercase"
  | "number"
  | "symbol";

export const defaultMessages: _StepDefaults<PasswordStep> = {
  length: {
    en: "Invalid password: must be at least 8 characters long.",
    pt: "Senha inválida: deve ter pelo menos 8 caracteres.",
  },
  lowercase: {
    en: "Invalid password: must contain at least one lowercase letter.",
    pt: "Senha inválida: deve conter pelo menos uma letra minúscula.",
  },
  uppercase: {
    en: "Invalid password: must contain at least one uppercase letter.",
    pt: "Senha inválida: deve conter pelo menos uma letra maiúscula.",
  },
  number: {
    en: "Invalid password: must contain at least one number.",
    pt: "Senha inválida: deve conter pelo menos um número.",
  },
  symbol: {
    en: "Invalid password: must contain at least one symbol.",
    pt: "Senha inválida: deve conter pelo menos um símbolo.",
  },
};
