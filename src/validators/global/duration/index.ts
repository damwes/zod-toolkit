import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

const DURATION_REGEX = /^(\d+(?:\.\d+)?)(ms|s|m|h|d|w)$/;

const UNITS_IN_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

const toMilliseconds = (value: string) => {
  const [, amount, unit] = DURATION_REGEX.exec(value)!;
  return Math.round(Number(amount) * UNITS_IN_MS[unit!]!);
};

export const duration = (params: _Params = defaultParams) =>
  z
    .string()
    .refine((value) => DURATION_REGEX.test(value), params)
    .transform(toMilliseconds);
