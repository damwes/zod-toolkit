import { z } from "zod";

import type { _StepParams } from "@/types";
import { withSteps } from "@/utils/steps";
import {
  DATABASE_PROTOCOLS,
  defaultMessages,
  type DatabaseUrlStep,
} from "./locale";

const parseUrl = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const isUrl = (value: string) => parseUrl(value) !== null;

const hasSupportedProtocol = (value: string) => {
  const protocolWithColon = parseUrl(value)?.protocol ?? "";
  const protocol = protocolWithColon.replace(/:$/, "");

  return (DATABASE_PROTOCOLS as readonly string[]).includes(protocol);
};

export const databaseUrl = (params: _StepParams<DatabaseUrlStep> = {}) =>
  withSteps(
    z.string(),
    [
      { name: "format", check: isUrl },
      { name: "protocol", check: hasSupportedProtocol },
    ],
    defaultMessages,
    params
  );
