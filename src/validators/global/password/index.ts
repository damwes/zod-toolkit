import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import { defaultMessages, type PasswordStep } from "./locale";

export const password = (params: _StepParams<PasswordStep> = {}) =>
  withSteps(
    z.string(),
    [
      { name: "length", check: (value: string) => value.length >= 8 },
      { name: "lowercase", check: (value: string) => /\p{Ll}/u.test(value) },
      { name: "uppercase", check: (value: string) => /\p{Lu}/u.test(value) },
      { name: "number", check: (value: string) => /\d/.test(value) },
      {
        name: "symbol",
        check: (value: string) => /[^\p{L}\p{N}\s]/u.test(value),
      },
    ],
    defaultMessages,
    params
  );
