import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import { defaultMessages, type UsernameStep } from "./locale";

const USERNAME_REGEX = /^(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]{1,18}[a-zA-Z0-9]$/;

const hasValidLength = (value: string) => value.length >= 3 && value.length <= 20;

const hasValidCharset = (value: string) => USERNAME_REGEX.test(value);

export const username = (params: _StepParams<UsernameStep> = {}) =>
  withSteps(
    z.string(),
    [
      { name: "length", check: hasValidLength },
      { name: "charset", check: hasValidCharset },
    ],
    defaultMessages,
    params
  );
