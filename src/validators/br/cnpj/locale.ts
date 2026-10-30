import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid CNPJ: must be 14 alphanumeric characters in the format AA.AAA.AAA/AAAA-00 or AAAAAAAAAAAA00.",
  pt: "CNPJ inválido: deve conter 14 caracteres alfanuméricos no formato AA.AAA.AAA/AAAA-00 ou AAAAAAAAAAAA00.",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
