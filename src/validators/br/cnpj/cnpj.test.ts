import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("CNPJ", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid CNPJs", () => {
    expect(z.br.cnpj().parse("12.345.678/0001-95")).toBe("12.345.678/0001-95");
    expect(z.br.cnpj().parse("12345678000195")).toBe("12345678000195");
    expect(z.br.cnpj().parse("12.345.678/0001-95")).toBe("12.345.678/0001-95");
    expect(z.br.cnpj().parse("12345678000195")).toBe("12345678000195");
  });

  it("accepts valid alphanumeric CNPJs", () => {
    expect(z.br.cnpj().parse("12.ABC.345/01DE-35")).toBe("12.ABC.345/01DE-35");
    expect(z.br.cnpj().parse("12ABC34501DE35")).toBe("12ABC34501DE35");
  });

  it("rejects invalid alphanumeric CNPJs", () => {
    expect(() => z.br.cnpj().parse("12.ABC.345/01DE-36")).toThrow();
    expect(() => z.br.cnpj().parse("12ABC34501DE36")).toThrow();
    expect(() => z.br.cnpj().parse("12abc34501de35")).toThrow();
    expect(() => z.br.cnpj().parse("12ABC34501DEA5")).toThrow();
    expect(() => z.br.cnpj().parse("12ABC34501DE3A")).toThrow();
    expect(() => z.br.cnpj().parse("12.ABC.345/01DE35")).toThrow();
  });

  it("rejects invalid CNPJs", () => {
    expect(() => z.br.cnpj().parse("11.111.111/1111-11")).toThrow();
    expect(() => z.br.cnpj().parse("00000000000000")).toThrow();
    expect(() => z.br.cnpj().parse("12.345.678/0001-96")).toThrow();
    expect(() => z.br.cnpj().parse("12345678000196")).toThrow();
    expect(() => z.br.cnpj().parse("12.345.678/0001_95")).toThrow();
    expect(() => z.br.cnpj().parse("12-345-678/0001-95")).toThrow();
    expect(() => z.br.cnpj().parse(" 12.345.678/0001-95 ")).toThrow();
    expect(() => z.br.cnpj().parse("12345678 000195")).toThrow();
    expect(() => z.br.cnpj().parse("")).toThrow();
    expect(() => z.br.cnpj().parse(null as any)).toThrow();
    expect(() => z.br.cnpj().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.br.cnpj().safeParse("111");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid CNPJ: must be 14 alphanumeric characters in the format AA.AAA.AAA/AAAA-00 or AAAAAAAAAAAA00.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.br.cnpj().safeParse("111");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "CNPJ inválido: deve conter 14 caracteres alfanuméricos no formato AA.AAA.AAA/AAAA-00 ou AAAAAAAAAAAA00.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.br.cnpj({ error: "Custom CNPJ error" }).safeParse("111");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom CNPJ error"]);
  });

  describe("steps", () => {
    const reportStep = { error: (issue: any) => issue.params?.step as string };
    const failedSteps = (value: string) =>
      z.br.cnpj(reportStep).safeParse(value).error!.issues.map((issue: any) => issue.params?.step);

    it("fails on `format` for malformed values", () => {
      expect(failedSteps("111")).toEqual(["format"]);
    });

    it("fails on `repeated` for repeated digits", () => {
      expect(failedSteps("11.111.111/1111-11")).toEqual(["repeated"]);
    });

    it("fails on `checkDigit` for a wrong check digit", () => {
      expect(failedSteps("12.345.678/0001-96")).toEqual(["checkDigit"]);
    });

    it("returns a specific default message per step", () => {
      expect(
        z.treeifyError(z.br.cnpj().safeParse("12.345.678/0001-96").error!).errors
      ).toEqual(["Invalid CNPJ: incorrect check digit."]);
      z.locale.set("pt");
      expect(
        z.treeifyError(z.br.cnpj().safeParse("11.111.111/1111-11").error!).errors
      ).toEqual(["CNPJ inválido: dígitos repetidos não são permitidos."]);
    });

    it("lets `errors` override a single step", () => {
      const result = z.br.cnpj({ errors: { checkDigit: "Bad digit" } });
      expect(z.treeifyError(result.safeParse("12.345.678/0001-96").error!).errors).toEqual(["Bad digit"]);
      expect(z.treeifyError(result.safeParse("111").error!).errors).toEqual([
        "Invalid CNPJ: must be 14 alphanumeric characters in the format AA.AAA.AAA/AAAA-00 or AAAAAAAAAAAA00.",
      ]);
    });
  });
});
