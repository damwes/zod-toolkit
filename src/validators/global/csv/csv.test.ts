import { describe, it, expect } from "vitest";

import { z } from "@/index";

describe("CSV", () => {
  it("splits a comma separated string into an array", () => {
    expect(z.csv().parse("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("trims items and ignores empty ones", () => {
    expect(z.csv().parse(" a , b,,c, ")).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(z.csv().parse("")).toEqual([]);
  });

  it("validates each item with the given schema", () => {
    expect(z.csv(z.coerce.number()).parse("1, 2,3")).toEqual([1, 2, 3]);
    expect(z.csv(z.email()).safeParse("a@b.com,nope").success).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(() => z.csv().parse(null as any)).toThrow();
    expect(() => z.csv().parse(undefined as any)).toThrow();
    expect(() => z.csv().parse(["a"] as any)).toThrow();
  });
});
