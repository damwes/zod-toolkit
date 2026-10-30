import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import { defaultMessages, type CpfStep } from "./locale";

const FORMAT_REGEX = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;

const digits = (value: string) => value.replace(/\D/g, "");

const isFormatValid = (value: string) => FORMAT_REGEX.test(value);

const isNotRepeated = (value: string) => !/^(\d)\1{10}$/.test(digits(value)); // (ex: 11111111111)

const calcCheckDigit = (base: string, factor: number) => {
  let total = 0;
  for (const digit of base) {
    total += parseInt(digit, 10) * factor--;
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

const isCheckDigitValid = (value: string) => {
  const cpf = digits(value);

  const firstCheck = calcCheckDigit(cpf.slice(0, 9), 10);
  const secondCheck = calcCheckDigit(cpf.slice(0, 10), 11);

  return (
    firstCheck === parseInt(cpf[9]!, 10) &&
    secondCheck === parseInt(cpf[10]!, 10)
  );
};

export const cpf = (params: _StepParams<CpfStep> = {}) =>
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
