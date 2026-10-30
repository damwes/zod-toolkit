import type { _StepDefaults } from "@/types";

export type UsernameStep = "length" | "charset";

export const defaultMessages: _StepDefaults<UsernameStep> = {
  length: {
    en: "Invalid username: must be 3–20 characters long.",
    pt: "Usuário inválido: deve ter entre 3 e 20 caracteres.",
  },
  charset: {
    en: "Invalid username: must start with a letter, end with a letter or number, and contain only letters, numbers, dots, or underscores (no consecutive dots or underscores).",
    pt: "Usuário inválido: deve iniciar com letra, terminar com letra ou número e conter apenas letras, números, pontos ou underscores (sem pontos ou underscores consecutivos).",
  },
};
