import type { TypeParams } from "zod/v4/core";
import type { _LocaleKey } from "./config/locale";

export type _LocaleErrorRecord = Record<_LocaleKey, string>;
export type _Params<T = {}> = TypeParams & T;

type _StepError = string | ((issue: any) => string | undefined);

export type _StepParams<S extends string> = TypeParams & {
  errors?: Partial<Record<S, _StepError>>;
};
export type _StepDefaults<S extends string> = Record<
  S,
  Partial<_LocaleErrorRecord>
>;
