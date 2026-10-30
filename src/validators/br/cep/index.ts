import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import { defaultMessages, type CepStep } from "./locale";

const digits = (value: string) => value.replace(/\D/g, "");

const isFormatValid = (value: string) => /^\d{5}-?\d{3}$/.test(value);

const isNotRepeated = (value: string) => !/^(\d)\1{7}$/.test(digits(value)); // ex: 11111111, 00000000, 99999999

const isInRange = (value: string) => {
  const cepNumber = parseInt(digits(value), 10);
  return cepNumber >= 1000000 && cepNumber <= 98999999;
};

export const cep = (params: _StepParams<CepStep> = {}) =>
  withSteps(
    z.string(),
    [
      { name: "format", check: isFormatValid },
      { name: "repeated", check: isNotRepeated },
      { name: "range", check: isInRange },
    ],
    defaultMessages,
    params
  );
