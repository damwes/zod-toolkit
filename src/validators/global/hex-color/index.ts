import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

const HEX_COLOR_REGEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const hexColor = (params: _Params = defaultParams) =>
  z.string().refine((value) => HEX_COLOR_REGEX.test(value), params);
