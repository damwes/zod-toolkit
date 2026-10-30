import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Slug", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid slugs", () => {
    for (const slug of ["hello", "hello-world", "post-123", "2024-recap", "a"]) {
      expect(z.slug().parse(slug)).toBe(slug);
    }
  });

  it("rejects invalid slugs", () => {
    expect(() => z.slug().parse("Hello")).toThrow();
    expect(() => z.slug().parse("hello_world")).toThrow();
    expect(() => z.slug().parse("-hello")).toThrow();
    expect(() => z.slug().parse("hello-")).toThrow();
    expect(() => z.slug().parse("hello--world")).toThrow();
    expect(() => z.slug().parse("hello world")).toThrow();
    expect(() => z.slug().parse("olá")).toThrow();
    expect(() => z.slug().parse("")).toThrow();
    expect(() => z.slug().parse(null as any)).toThrow();
    expect(() => z.slug().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.slug().safeParse("Hello World");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid slug: must be lowercase letters and numbers separated by single hyphens.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.slug().safeParse("Hello World");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Slug inválido: deve conter letras minúsculas e números separados por hífen único.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.slug({ error: "Custom error" }).safeParse("Hello World");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
