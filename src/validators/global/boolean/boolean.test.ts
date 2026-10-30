import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Coerce boolean", () => {
  afterEach(() => z.locale.set("en"));

  it("coerces truthy values to true", () => {
    for (const value of ["true", "TRUE", "1", "yes", "Yes", "on", " true ", 1, true]) {
      expect(z.coerce.boolean().parse(value)).toBe(true);
    }
  });

  it("coerces falsy values to false", () => {
    for (const value of ["false", "FALSE", "0", "no", "off", " false ", 0, false]) {
      expect(z.coerce.boolean().parse(value)).toBe(false);
    }
  });

  it("rejects values that are not boolean-like", () => {
    expect(() => z.coerce.boolean().parse("maybe")).toThrow();
    expect(() => z.coerce.boolean().parse("")).toThrow();
    expect(() => z.coerce.boolean().parse("2")).toThrow();
    expect(() => z.coerce.boolean().parse(2)).toThrow();
    expect(() => z.coerce.boolean().parse(null)).toThrow();
    expect(() => z.coerce.boolean().parse(undefined)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.coerce.boolean().safeParse("maybe");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid boolean: must be one of true, false, 1, 0, yes, no, on, or off.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.coerce.boolean().safeParse("maybe");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Booleano inválido: deve ser true, false, 1, 0, yes, no, on ou off.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.coerce.boolean({ error: "Custom error" }).safeParse("maybe");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
