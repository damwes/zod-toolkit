import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("OTP", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid OTP codes", () => {
    expect(z.otp().parse("123456")).toBe("123456");
    expect(z.otp().parse("987654")).toBe("987654");
    expect(z.otp(10).parse("1234567890")).toBe("1234567890");
    expect(z.otp(6).parse("654321")).toBe("654321");
  });

  it("rejects invalid OTP codes", () => {
    expect(() => z.otp().parse("123")).toThrow();
    expect(() => z.otp().parse("123456789")).toThrow();
    expect(() => z.otp().parse("12a4")).toThrow();
    expect(() => z.otp().parse("12-34")).toThrow();
    expect(() => z.otp().parse(" 1234 ")).toThrow();
    expect(() => z.otp().parse(123456 as any)).toThrow();
    expect(() => z.otp().parse(null as any)).toThrow();
    expect(() => z.otp().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.otp().safeParse("abc");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid OTP: must contain only digits.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.otp().safeParse("abc");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "OTP inválido: deve conter apenas dígitos.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z.otp(6, { error: "Custom OTP error" }).safeParse("abc");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom OTP error"]);
  });
});
