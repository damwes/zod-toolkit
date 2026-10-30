import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Hex color", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid hex colors", () => {
    for (const color of ["#fff", "#FFF", "#ffff", "#ffffff", "#a1B2c3", "#ffffff80"]) {
      expect(z.hexColor().parse(color)).toBe(color);
    }
  });

  it("rejects invalid hex colors", () => {
    expect(() => z.hexColor().parse("fff")).toThrow();
    expect(() => z.hexColor().parse("#ff")).toThrow();
    expect(() => z.hexColor().parse("#fffff")).toThrow();
    expect(() => z.hexColor().parse("#fffffff")).toThrow();
    expect(() => z.hexColor().parse("#ggg")).toThrow();
    expect(() => z.hexColor().parse(" #fff")).toThrow();
    expect(() => z.hexColor().parse("")).toThrow();
    expect(() => z.hexColor().parse(null as any)).toThrow();
    expect(() => z.hexColor().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.hexColor().safeParse("fff");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid hex color: must be in the format #RGB, #RGBA, #RRGGBB, or #RRGGBBAA.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.hexColor().safeParse("fff");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Cor hexadecimal inválida: deve estar no formato #RGB, #RGBA, #RRGGBB ou #RRGGBBAA.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.hexColor({ error: "Custom error" }).safeParse("fff");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
