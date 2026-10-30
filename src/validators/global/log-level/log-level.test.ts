import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Log level", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid log levels", () => {
    for (const level of ["trace", "debug", "info", "warn", "error", "fatal"]) {
      expect(z.logLevel().parse(level)).toBe(level);
    }
  });

  it("rejects invalid log levels", () => {
    expect(() => z.logLevel().parse("verbose")).toThrow();
    expect(() => z.logLevel().parse("INFO")).toThrow();
    expect(() => z.logLevel().parse("")).toThrow();
    expect(() => z.logLevel().parse(null as any)).toThrow();
    expect(() => z.logLevel().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.logLevel().safeParse("verbose");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid log level: must be one of trace, debug, info, warn, error, or fatal.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.logLevel().safeParse("verbose");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Nível de log inválido: deve ser trace, debug, info, warn, error ou fatal.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.logLevel({ error: "Custom error" }).safeParse("verbose");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
