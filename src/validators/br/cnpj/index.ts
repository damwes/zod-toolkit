import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

function isValidCNPJ(value: string): boolean {
  const regex =
    /^([0-9A-Z]{12}\d{2}|[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-\d{2})$/;
  if (!regex.test(value)) return false;

  const cnpj = value.replace(/[./-]/g, "");

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, factors: number[]): number => {
    let total = 0;
    for (let i = 0; i < base.length; i++) {
      total += (base.charCodeAt(i) - 48) * factors[i]!;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

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
}

export const cnpj = (params: _Params = defaultParams) =>
  z.string().refine(isValidCNPJ, params);
