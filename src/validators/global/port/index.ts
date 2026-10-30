import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import { defaultMessages, type PortStep } from "./locale";

const inRange = (num: number) => num >= 0 && num <= 65535;

export const port = (params: _StepParams<PortStep> = {}) =>
  withSteps(
    z.string(),
    [
      { name: "format", check: (value: string) => /^\d+$/.test(value) },
      { name: "range", check: (value: string) => inRange(Number(value)) },
    ],
    defaultMessages,
    params
  );

export const portNumber = (params: _StepParams<PortStep> = {}) =>
  withSteps(
    z.coerce.number(),
    [
      { name: "format", check: (value: number) => Number.isInteger(value) },
      { name: "range", check: inRange },
    ],
    defaultMessages,
    params
  );
