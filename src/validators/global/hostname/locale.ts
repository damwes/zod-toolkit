import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid hostname: must be a valid hostname or IP address.",
  pt: "Hostname inválido: deve ser um hostname ou endereço IP válido.",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
