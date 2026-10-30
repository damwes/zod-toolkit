import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("NODE_ENV", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid NODE_ENV values", () => {
    expect(z.nodeEnv().parse("production")).toBe("production");
    expect(z.nodeEnv().parse("development")).toBe("development");
    expect(z.nodeEnv().parse("test")).toBe("test");
    expect(z.nodeEnv().parse("staging")).toBe("staging");
  });

  it("rejects invalid NODE_ENV values", () => {
    expect(() => z.nodeEnv().parse("prod")).toThrow();
    expect(() => z.nodeEnv().parse("dev")).toThrow();
    expect(() => z.nodeEnv().parse("testing")).toThrow();
    expect(() => z.nodeEnv().parse("stage")).toThrow();
    expect(() => z.nodeEnv().parse("")).toThrow();
    expect(() => z.otp().parse(123456 as any)).toThrow();
    expect(() => z.otp().parse(null as any)).toThrow();
    expect(() => z.otp().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.nodeEnv().safeParse("invalid");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid NODE_ENV: must be one of production, development, test, or staging.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.nodeEnv().safeParse("invalid");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "NODE_ENV inválido: deve ser production, development, test ou staging.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.nodeEnv({ error: "Custom NODE_ENV error" }).safeParse("invalid");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom NODE_ENV error"]);
  });
});
