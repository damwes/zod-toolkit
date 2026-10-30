import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import { defaultMessages, type CnpjStep } from "./locale";

const FORMAT_REGEX =
  /^([0-9A-Z]{12}\d{2}|[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-\d{2})$/;

const strip = (value: string) => value.replace(/[./-]/g, "");

const isFormatValid = (value: string) => FORMAT_REGEX.test(value);

const isNotRepeated = (value: string) => !/^(\d)\1{13}$/.test(strip(value));

const calcCheckDigit = (base: string, factors: number[]): number => {
  let total = 0;
  for (let index = 0; index < base.length; index++) {
    total += (base.charCodeAt(index) - 48) * factors[index]!;
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

const isCheckDigitValid = (value: string) => {
  const cnpj = strip(value);

  const firstFactors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondFactors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstCheck = calcCheckDigit(cnpj.slice(0, 12), firstFactors);
  const secondCheck = calcCheckDigit(
    cnpj.slice(0, 12) + firstCheck,
    secondFactors
  );

  return (
    firstCheck === parseInt(cnpj[12]!, 10) &&
    secondCheck === parseInt(cnpj[13]!, 10)
  );
};

export const cnpj = (params: _StepParams<CnpjStep> = {}) =>
  withSteps(
    z.string(),
    [
      { name: "format", check: isFormatValid },
      { name: "repeated", check: isNotRepeated },
      { name: "checkDigit", check: isCheckDigitValid },
    ],
    defaultMessages,
    params
  );
