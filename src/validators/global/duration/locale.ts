import { z } from "@/index";
import type { _LocaleErrorRecord, _Params } from "@/types";

const localeError: Partial<_LocaleErrorRecord> = {
  en: 'Invalid duration: must be a number followed by a unit (ms, s, m, h, d, w), e.g. "10s".',
  pt: 'Duração inválida: deve ser um número seguido de uma unidade (ms, s, m, h, d, w), ex.: "10s".',
};

export const defaultParams: _Params = {
  error: () => localeError[z.locale.current],
};
