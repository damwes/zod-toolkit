import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

export const logLevel = (params: _Params = defaultParams) => {
  return z.enum(["trace", "debug", "info", "warn", "error", "fatal"], params);
};
