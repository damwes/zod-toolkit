import { describe, it, expect, afterEach } from "vitest";

import * as zod from "zod";

import { z } from "@/index";

describe("Hostname", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid hostnames", () => {
    expect(z.hostname().parse("localhost")).toBe("localhost");
    expect(z.hostname().parse("my-host")).toBe("my-host");
    expect(z.hostname().parse("example.com")).toBe("example.com");
    expect(z.hostname().parse("api.example.co.uk")).toBe("api.example.co.uk");
    expect(z.hostname().parse("127.0.0.1")).toBe("127.0.0.1");
    expect(z.hostname().parse("::1")).toBe("::1");
    expect(z.hostname().parse("2001:db8::1")).toBe("2001:db8::1");
    expect(z.hostname().parse("example.com.")).toBe("example.com.");
    expect(z.hostname().parse("localhost.")).toBe("localhost.");
    expect(z.hostname().parse("xn--bcher-kva.example")).toBe(
      "xn--bcher-kva.example"
    );
    expect(z.hostname().parse("EXAMPLE.COM")).toBe("EXAMPLE.COM");
    expect(z.hostname().parse("a".repeat(63) + ".com")).toBe(
      "a".repeat(63) + ".com"
    );
  });

  it("accepts everything Zod's hostname accepts", () => {
    for (const value of [
      "localhost",
      "example.com",
      "API.Example.COM",
      "xn--bcher-kva.example",
      "example.com.",
      "127.0.0.1",
      "123.example",
    ]) {
      expect(zod.hostname().safeParse(value).success).toBe(true);
      expect(z.hostname().parse(value)).toBe(value);
    }
  });

  it("accepts IPv6 in bracketed URL form", () => {
    expect(z.hostname().parse("[::1]")).toBe("[::1]");
    expect(z.hostname().parse("[2001:db8::1]")).toBe("[2001:db8::1]");
  });

  it("rejects invalid hostnames", () => {
    expect(() => z.hostname().parse("256.1.1.1")).toThrow();
    expect(() => z.hostname().parse("1.2.3")).toThrow();
    expect(() => z.hostname().parse("123")).toThrow();
    expect(() => z.hostname().parse("example.123")).toThrow();
    expect(() => z.hostname().parse("1.2.3.")).toThrow();
    expect(() => z.hostname().parse("")).toThrow();
    expect(() => z.hostname().parse("-bad.com")).toThrow();
    expect(() => z.hostname().parse("bad-.com")).toThrow();
    expect(() => z.hostname().parse("exa mple.com")).toThrow();
    expect(() => z.hostname().parse("example..com")).toThrow();
    expect(() => z.hostname().parse("http://example.com")).toThrow();
    expect(() => z.hostname().parse("example.com:3000")).toThrow();
    expect(() => z.hostname().parse(`${"a".repeat(64)}.com`)).toThrow();
    expect(() => z.hostname().parse("a_b.com")).toThrow();
    expect(() => z.hostname().parse("example.com..")).toThrow();
    expect(() => z.hostname().parse(".")).toThrow();
    expect(() => z.hostname().parse("2001:db8::zz")).toThrow();
    expect(() => z.hostname().parse("[::1")).toThrow();
    expect(() => z.hostname().parse("[example.com]")).toThrow();
    expect(() => z.hostname().parse(null as any)).toThrow();
    expect(() => z.hostname().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.hostname().safeParse("exa mple.com");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid hostname: must be a valid hostname or IP address.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.hostname().safeParse("exa mple.com");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Hostname inválido: deve ser um hostname ou endereço IP válido.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z
      .hostname({ error: "Custom error" })
      .safeParse("exa mple.com");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });
});
