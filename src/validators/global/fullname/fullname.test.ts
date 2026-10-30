import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Fullname", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid full names", () => {
    expect(z.fullname().parse("John Doe")).toBe("John Doe");
    expect(z.fullname().parse("Mr. Belson")).toBe("Mr. Belson");
    expect(z.fullname().parse("Ana Maria Silva")).toBe("Ana Maria Silva");
    expect(z.fullname().parse("José António")).toBe("José António");
    expect(z.fullname().parse("Dr. Smith")).toBe("Dr. Smith");
  });

  it("rejects names without last name", () => {
    expect(() => z.fullname().parse("John")).toThrow();
    expect(() => z.fullname().parse("Ana")).toThrow();
  });

  it("rejects names with numbers", () => {
    expect(() => z.fullname().parse("John Doe2")).toThrow();
    expect(() => z.fullname().parse("123 456")).toThrow();
    expect(() => z.fullname().parse("John 3rd")).toThrow();
  });

  it("rejects empty or whitespace-only input", () => {
    expect(() => z.fullname().parse("")).toThrow();
    expect(() => z.fullname().parse("   ")).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.fullname().safeParse("John");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid full name: must include first and last name.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.fullname().safeParse("John");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Nome completo inválido: deve incluir nome e sobrenome.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.fullname({ error: "Enter full name" }).safeParse("John");
    expect(z.treeifyError(result.error!).errors).toEqual(["Enter full name"]);
  });
});
