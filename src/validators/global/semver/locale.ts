import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: "Invalid semantic version: must follow SemVer 2.0.0 (e.g. 1.2.3 or 1.0.0-beta.1).",
  pt: "Versão semântica inválida: deve seguir o SemVer 2.0.0 (ex.: 1.2.3 ou 1.0.0-beta.1).",
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
