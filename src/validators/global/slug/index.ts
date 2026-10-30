import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slug = (params: _Params = defaultParams) =>
  z.string().refine((value) => SLUG_REGEX.test(value), params);
