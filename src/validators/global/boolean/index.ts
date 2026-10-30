import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

const TRUTHY_VALUES = ["true", "1", "yes", "on"];
const FALSY_VALUES = ["false", "0", "no", "off"];

const toBoolean = (value: unknown) => {
  const isNumber = typeof value === "number";
  const isString = typeof value === "string";

  if (!isNumber && !isString) return value;

  const normalized = String(value).trim().toLowerCase();
  const isTruthy = TRUTHY_VALUES.includes(normalized);
  const isFalsy = FALSY_VALUES.includes(normalized);

  if (isTruthy) return true;
  if (isFalsy) return false;

  return value;
};

export const booleanCoerce = (params: _Params = defaultParams) =>
  z.preprocess(toBoolean, z.boolean(params));
