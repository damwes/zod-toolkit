import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Semver", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid semantic versions", () => {
    for (const version of [
      "0.0.0",
      "1.2.3",
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-0.3.7",
      "1.0.0+build.1",
      "1.0.0-rc.1+build.5",
    ]) {
      expect(z.semver().parse(version)).toBe(version);
    }
  });

  it("rejects invalid semantic versions", () => {
    expect(() => z.semver().parse("1.2")).toThrow();
    expect(() => z.semver().parse("01.2.3")).toThrow();
    expect(() => z.semver().parse("1.2.3.4")).toThrow();
    expect(() => z.semver().parse("v1.2.3")).toThrow();
    expect(() => z.semver().parse("1.2.3-")).toThrow();
    expect(() => z.semver().parse("1.2.3-01")).toThrow();
    expect(() => z.semver().parse("1.2.x")).toThrow();
    expect(() => z.semver().parse("")).toThrow();
    expect(() => z.semver().parse(null as any)).toThrow();
    expect(() => z.semver().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.semver().safeParse("1.2");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid semantic version: must follow SemVer 2.0.0 (e.g. 1.2.3 or 1.0.0-beta.1).",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.semver().safeParse("1.2");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Versão semântica inválida: deve seguir o SemVer 2.0.0 (ex.: 1.2.3 ou 1.0.0-beta.1).",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.semver({ error: "Custom error" }).safeParse("1.2");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
