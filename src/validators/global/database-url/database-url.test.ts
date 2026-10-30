import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Database URL", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid database URLs", () => {
    for (const url of [
      "postgres://user:pass@localhost:5432/db",
      "postgresql://user:pass@localhost:5432/db",
      "mysql://localhost/db",
      "mongodb://localhost:27017/db",
      "mongodb+srv://cluster.mongodb.net/db",
      "redis://localhost:6379",
      "rediss://cache.example.com:6380",
    ]) {
      expect(z.databaseUrl().parse(url)).toBe(url);
    }
  });

  it("rejects invalid database URLs", () => {
    expect(() => z.databaseUrl().parse("not a url")).toThrow();
    expect(() => z.databaseUrl().parse("http://localhost")).toThrow();
    expect(() => z.databaseUrl().parse("ftp://localhost/db")).toThrow();
    expect(() => z.databaseUrl().parse("localhost:5432/db")).toThrow();
    expect(() => z.databaseUrl().parse("")).toThrow();
    expect(() => z.databaseUrl().parse(null as any)).toThrow();
    expect(() => z.databaseUrl().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.databaseUrl().safeParse("not a url");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid database URL: must be a valid URL.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.databaseUrl().safeParse("not a url");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "URL de banco de dados inválida: deve ser uma URL válida.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z
      .databaseUrl({ error: "Custom error" })
      .safeParse("not a url");
    expect(z.treeifyError(result.error!).errors).toEqual(["Custom error"]);
  });

  describe("steps", () => {
    it("fails on `format` for values that are not URLs", () => {
      const schema = z.databaseUrl({ errors: { format: "F", protocol: "P" } });
      expect(z.treeifyError(schema.safeParse("not a url").error!).errors).toEqual(["F"]);
    });

    it("fails on `protocol` for unsupported protocols", () => {
      expect(
        z.treeifyError(z.databaseUrl().safeParse("http://localhost").error!).errors
      ).toEqual([
        "Invalid database URL: protocol must be one of postgres, postgresql, mysql, mongodb, mongodb+srv, redis, or rediss.",
      ]);
    });
  });
});
