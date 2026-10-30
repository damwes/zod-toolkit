import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Duration", () => {
  afterEach(() => z.locale.set("en"));

  it("parses valid durations into milliseconds", () => {
    expect(z.duration().parse("500ms")).toBe(500);
    expect(z.duration().parse("10s")).toBe(10_000);
    expect(z.duration().parse("5m")).toBe(300_000);
    expect(z.duration().parse("1h")).toBe(3_600_000);
    expect(z.duration().parse("2d")).toBe(172_800_000);
    expect(z.duration().parse("1w")).toBe(604_800_000);
    expect(z.duration().parse("1.5h")).toBe(5_400_000);
    expect(z.duration().parse("0s")).toBe(0);
  });

  it("rejects invalid durations", () => {
    expect(() => z.duration().parse("10")).toThrow();
    expect(() => z.duration().parse("s")).toThrow();
    expect(() => z.duration().parse("10x")).toThrow();
    expect(() => z.duration().parse(" 10s")).toThrow();
    expect(() => z.duration().parse("10 s")).toThrow();
    expect(() => z.duration().parse("-5s")).toThrow();
    expect(() => z.duration().parse("")).toThrow();
    expect(() => z.duration().parse(10 as any)).toThrow();
    expect(() => z.duration().parse(null as any)).toThrow();
    expect(() => z.duration().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.duration().safeParse("10");
    expect(z.treeifyError(result.error!).errors).toEqual([
      'Invalid duration: must be a number followed by a unit (ms, s, m, h, d, w), e.g. "10s".',
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.duration().safeParse("10");
    expect(z.treeifyError(result.error!).errors).toEqual([
      'Duração inválida: deve ser um número seguido de uma unidade (ms, s, m, h, d, w), ex.: "10s".',
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.duration({ error: "Custom error" }).safeParse("10");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
