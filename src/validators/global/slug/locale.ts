import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid slug: must be lowercase letters and numbers separated by single hyphens.",
  pt: "Slug inválido: deve conter letras minúsculas e números separados por hífen único.",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
