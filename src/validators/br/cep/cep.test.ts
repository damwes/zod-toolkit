import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("ZIP Code (CEP)", () => {
  afterEach(() => z.locale.set("en"));

  it("validates valid ZIP codes", () => {
    expect(z.br.cep().parse("12345-678")).toBe("12345-678");
    expect(z.br.cep().parse("12345678")).toBe("12345678");
  });

  it("rejects invalid ZIP codes", () => {
    expect(() => z.br.cep().parse("1234-567")).toThrow();
    expect(() => z.br.cep().parse("1234567")).toThrow();
    expect(() => z.br.cep().parse("123456789")).toThrow();
    expect(() => z.br.cep().parse("12a45-678")).toThrow();
    expect(() => z.br.cep().parse("11111-111")).toThrow();
    expect(() => z.br.cep().parse("12345_678")).toThrow();
    expect(() => z.br.cep().parse("12-345678")).toThrow();
    expect(() => z.br.cep().parse("-123456")).toThrow();
    expect(() => z.br.cep().parse("12345-")).toThrow();
    expect(() => z.br.cep().parse("12345 -678")).toThrow();
    expect(() => z.br.cep().parse(" 12345678 ")).toThrow();
    expect(() => z.br.cep().parse("")).toThrow();
    expect(() => z.br.cep().parse(null as any)).toThrow();
    expect(() => z.br.cep().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.br.cep().safeParse("111");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid CEP: must be 8 digits in the format 00000-000 or 00000000.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.br.cep().safeParse("111");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "CEP inválido: deve conter 8 dígitos no formato 00000-000 ou 00000000.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.br.cep({ error: "Custom CEP error" }).safeParse("111");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom CEP error"]);
  });

  describe("steps", () => {
    const reportStep = { error: (issue: any) => issue.params?.step as string };
    const failedSteps = (value: string) =>
      z.br.cep(reportStep).safeParse(value).error!.issues.map((issue: any) => issue.params?.step);

    it("fails on `format` for malformed values", () => {
      expect(failedSteps("111")).toEqual(["format"]);
    });

    it("fails on `repeated` for repeated digits", () => {
      expect(failedSteps("11111-111")).toEqual(["repeated"]);
    });

    it("fails on `range` for out-of-range values", () => {
      expect(failedSteps("00100-000")).toEqual(["range"]);
    });

    it("returns a specific default message per step", () => {
      expect(
        z.treeifyError(z.br.cep().safeParse("00100-000").error!).errors
      ).toEqual(["Invalid CEP: out of the valid range (01000-000 to 98999-999)."]);
      z.locale.set("pt");
      expect(
        z.treeifyError(z.br.cep().safeParse("11111-111").error!).errors
      ).toEqual(["CEP inválido: dígitos repetidos não são permitidos."]);
    });

    it("lets `errors` override a single step", () => {
      const schema = z.br.cep({ errors: { range: "Out of range" } });
      expect(z.treeifyError(schema.safeParse("00100-000").error!).errors).toEqual(["Out of range"]);
    });
  });
});
