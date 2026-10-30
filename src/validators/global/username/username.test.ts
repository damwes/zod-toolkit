import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";

describe("Username", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts valid usernames", () => {
    expect(z.username().parse("user123")).toBe("user123");
    expect(z.username().parse("john_doe")).toBe("john_doe");
    expect(z.username().parse("alice.smith")).toBe("alice.smith");
    expect(z.username().parse("a1b2c3")).toBe("a1b2c3");
  });

  it("rejects invalid usernames", () => {
    expect(() => z.username().parse("ab")).toThrow();
    expect(() => z.username().parse("a".repeat(21))).toThrow();
    expect(() => z.username().parse("1user")).toThrow();
    expect(() => z.username().parse("_user")).toThrow();
    expect(() => z.username().parse(".user")).toThrow();
    expect(() => z.username().parse("user_")).toThrow();
    expect(() => z.username().parse("user.")).toThrow();
    expect(() => z.username().parse("user__name")).toThrow();
    expect(() => z.username().parse("user..name")).toThrow();
    expect(() => z.username().parse("user name")).toThrow();
    expect(() => z.username().parse("user-name")).toThrow();
    expect(() => z.username().parse("user@name")).toThrow();
    expect(() => z.username().parse("")).toThrow();
    expect(() => z.username().parse(null as any)).toThrow();
    expect(() => z.username().parse(undefined as any)).toThrow();
  });

  it("returns default error message in English", () => {
    const result = z.username().safeParse("a!");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Invalid username: must be 3–20 characters long.",
    ]);
  });

  it("returns localized error message in Portuguese", () => {
    z.locale.set("pt");
    const result = z.username().safeParse("a!");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Usuário inválido: deve ter entre 3 e 20 caracteres.",
    ]);
  });

  it("returns custom error message when provided", () => {
    const result = z
      .username({ error: "Custom username error" })
      .safeParse("a!");
    expect(z.treeifyError(result.error!).errors).toEqual([
      "Custom username error",
    ]);
  });

  describe("steps", () => {
    const reportStep = { error: (issue: any) => issue.params?.step as string };
    const failedSteps = (value: string) =>
      z
        .username(reportStep)
        .safeParse(value)
        .error!.issues.map((issue: any) => issue.params?.step);

    it("fails on `length` for too short or too long values", () => {
      expect(failedSteps("a!")).toEqual(["length"]);
      expect(failedSteps("a".repeat(21))).toEqual(["length"]);
    });

    it("fails on `charset` for invalid characters", () => {
      expect(failedSteps("abcd!")).toEqual(["charset"]);
    });

    it("returns a specific default message per step", () => {
      expect(
        z.treeifyError(z.username().safeParse("abcd!").error!).errors
      ).toEqual([
        "Invalid username: must start with a letter, end with a letter or number, and contain only letters, numbers, dots, or underscores (no consecutive dots or underscores).",
      ]);
    });

    it("lets `errors` override a single step", () => {
      const schema = z.username({ errors: { charset: "Bad characters" } });
      expect(z.treeifyError(schema.safeParse("abcd!").error!).errors).toEqual([
        "Bad characters",
      ]);
    });
  });
});
