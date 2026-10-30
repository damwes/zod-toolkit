import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

// Official regex from https://semver.org
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const semver = (params: _Params = defaultParams) =>
  z.string().refine((value) => SEMVER_REGEX.test(value), params);
