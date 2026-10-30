import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid hex color: must be in the format #RGB, #RGBA, #RRGGBB, or #RRGGBBAA.",
  pt: "Cor hexadecimal inválida: deve estar no formato #RGB, #RGBA, #RRGGBB ou #RRGGBBAA.",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
