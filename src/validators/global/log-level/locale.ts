import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid log level: must be one of trace, debug, info, warn, error, or fatal.",
  pt: "Nível de log inválido: deve ser trace, debug, info, warn, error ou fatal.",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
