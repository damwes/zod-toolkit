import { describe, it, expect, afterEach } from "vitest";

import type { ZodType } from "zod";

import { z } from "@/index";

describe("PORT", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid port numbers", () => {
    expect(z.coerce.port().parse(0)).toBe(0);
    expect(z.coerce.port().parse(80)).toBe(80);
    expect(z.coerce.port().parse(443)).toBe(443);
    expect(z.port().parse("3000")).toBe("3000");
    expect(z.port().parse("65535")).toBe("65535");
  });

  it("rejects invalid port numbers", () => {
    expect(() => z.coerce.port().parse(-1)).toThrow();
    expect(() => z.coerce.port().parse(65536)).toThrow();
    expect(() => z.port().parse("-1")).toThrow();
    expect(() => z.port().parse("65536")).toThrow();
    expect(() => z.port().parse("abc")).toThrow();
    expect(() => z.port().parse("")).toThrow();
    expect(() => z.port().parse(null as any)).toThrow();
    expect(() => z.port().parse(undefined as any)).toThrow();
    expect(() => z.coerce.port().parse(NaN)).toThrow();
    expect(() => z.coerce.port().parse(Infinity)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.port().safeParse("99999");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid port: must be an integer between 0 and 65535.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.port().safeParse("99999");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Porta inválida: deve ser um inteiro entre 0 e 65535.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.port({ error: "Custom port error" }).safeParse("99999");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom port error"]);
  });

  describe("steps", () => {
    const reportStep = { error: (issue: any) => issue.params?.step as string };
    const failedSteps = (schema: ZodType, value: unknown) =>
      schema.safeParse(value).error!.issues.map((issue: any) => issue.params?.step);

    it("fails on `format` for non-integers", () => {
      expect(failedSteps(z.port(reportStep), "abc")).toEqual(["format"]);
      expect(failedSteps(z.coerce.port(reportStep), 1.5)).toEqual(["format"]);
    });

    it("fails on `range` for out-of-range integers", () => {
      expect(failedSteps(z.port(reportStep), "99999")).toEqual(["range"]);
      expect(failedSteps(z.coerce.port(reportStep), 70000)).toEqual(["range"]);
    });

    it("returns a specific default message per step", () => {
      expect(z.treeifyError(z.port().safeParse("abc").error!).errors).toEqual([
        "Invalid port: must be an integer.",
      ]);
    });

    it("lets `errors` override a single step", () => {
      const schema = z.port({ errors: { range: "Out of range" } });
      expect(z.treeifyError(schema.safeParse("99999").error!).errors).toEqual(["Out of range"]);
    });
  });
});
