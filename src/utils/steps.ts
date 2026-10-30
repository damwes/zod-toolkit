import { z } from "zod";

import { zodLocale } from "@/config/locale";
import type { _StepDefaults, _StepParams } from "@/types";

export type Step<S extends string, V> = {
  name: S;
  check: (value: V) => boolean;
};

export function withSteps<S extends string, V, T extends z.ZodType>(
  base: T,
  steps: Step<S, V>[],
  defaults: _StepDefaults<S>,
  params: _StepParams<S> = {}
): T {
  const { errors, error, ...rest } = params;

  let schema: z.ZodType = base;
  for (const { name, check } of steps) {
    schema = schema.refine(check as (value: unknown) => boolean, {
      ...rest,
      abort: true,
      params: { step: name },
      error: (issue) => {
        const custom = errors?.[name] ?? error;

        if (custom === undefined) {
          return defaults[name][zodLocale.current];
        }

        return typeof custom === "string" ? custom : custom(issue);
      },
    });
  }

  return schema as T;
}
