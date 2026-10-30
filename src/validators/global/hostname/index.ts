import { z } from "zod";

import type { _Params } from "@/types";
import { defaultParams } from "./locale";

const BRACKETED_IPV6_REGEX = /^\[(.+)\]$/;
const ONLY_DIGITS_REGEX = /^\d+$/;

const isValidHostname = (value: string) => {
  const lastLabel = value.replace(/\.$/, "").split(".").pop() ?? "";
  const hasNumericLastLabel = ONLY_DIGITS_REGEX.test(lastLabel);

  const isDomainName =
    z.hostname().safeParse(value).success && !hasNumericLastLabel;
  const isIpv4 = z.ipv4().safeParse(value).success;
  const isIpv6 = z.ipv6().safeParse(value).success;

  const bracketedAddress = BRACKETED_IPV6_REGEX.exec(value)?.[1];
  const isBracketedIpv6 =
    bracketedAddress !== undefined &&
    z.ipv6().safeParse(bracketedAddress).success;

  return isDomainName || isIpv4 || isIpv6 || isBracketedIpv6;
};

export const hostname = (params: _Params = defaultParams) =>
  z.string().refine(isValidHostname, params);
