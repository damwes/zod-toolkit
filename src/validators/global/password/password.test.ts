import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Password", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid passwords", () => {
    expect(z.password().parse("Abcdef1!")).toBe("Abcdef1!");
    expect(z.password().parse("P@ssw0rd123")).toBe("P@ssw0rd123");
    expect(z.password().parse("Sênha#2024")).toBe("Sênha#2024");
  });

  it("rejects invalid passwords", () => {
    expect(() => z.password().parse("Ab1!")).toThrow();
    expect(() => z.password().parse("ABCDEFG1!")).toThrow();
    expect(() => z.password().parse("abcdefg1!")).toThrow();
    expect(() => z.password().parse("Abcdefgh!")).toThrow();
    expect(() => z.password().parse("Abcdefg1")).toThrow();
    expect(() => z.password().parse("")).toThrow();
    expect(() => z.password().parse(null as any)).toThrow();
    expect(() => z.password().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.password().safeParse("Ab1!");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid password: must be at least 8 characters long.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.password().safeParse("Ab1!");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Senha inválida: deve ter pelo menos 8 caracteres.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.password({ error: "Custom error" }).safeParse("Ab1!");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });

  describe("steps", () => {
    const reportStep = { error: (issue: any) => issue.params?.step as string };
    const failedSteps = (value: string) =>
      z
        .password(reportStep)
        .safeParse(value)
        .error!.issues.map((issue: any) => issue.params?.step);

    it("reports only the first failing step, in order", () => {
      expect(failedSteps("Ab1!")).toEqual(["length"]);
      expect(failedSteps("ABCDEFG1!")).toEqual(["lowercase"]);
      expect(failedSteps("abcdefg1!")).toEqual(["uppercase"]);
      expect(failedSteps("Abcdefgh!")).toEqual(["number"]);
      expect(failedSteps("Abcdefg1")).toEqual(["symbol"]);
    });

    it("lets `errors` override a single step", () => {
      const schema = z.password({ errors: { symbol: "Add a symbol" } });
      expect(z.treeifyError(schema.safeParse("Abcdefg1").error!).errors).toEqual([
        "Add a symbol",
      ]);
    });
  });
});
