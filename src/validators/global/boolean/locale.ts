import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid boolean: must be one of true, false, 1, 0, yes, no, on, or off.",
  pt: "Booleano inválido: deve ser true, false, 1, 0, yes, no, on ou off.",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
