import { describe, it, expect, afterEach } from "vitest";

import { z } from "@/index";
import type { _StepParams } from "@/types";
import { withSteps } from "./steps";

const defaults = {
  a: { en: "A failed", pt: "A falhou" },
  b: { en: "B failed", pt: "B falhou" },
};

const make = (params: _StepParams<"a" | "b"> = {}, calls: string[] = []) =>
  withSteps(
    z.string(),
    [
      {
        name: "a",
        check: (value: string) => (calls.push("a"), value.startsWith("x")),
      },
      {
        name: "b",
        check: (value: string) => (calls.push("b"), value.endsWith("y")),
      },
    ],
    defaults,
    params
  );

describe("withSteps", () => {
  afterEach(() => z.locale.set("en"));

  it("accepts values passing every step", () => {
    expect(make().parse("xy")).toBe("xy");
  });

  it("reports the first failing step only (fail-fast)", () => {
    const calls: string[] = [];
    const result = make({}, calls).safeParse("zz");
    expect(z.treeifyError(result.error!).errors).toEqual(["A failed"]);
    expect(calls).toEqual(["a"]);
  });

  it("reaches later steps when earlier ones pass", () => {
    expect(z.treeifyError(make().safeParse("xz").error!).errors).toEqual([
      "B failed",
    ]);
  });

  it("uses the current locale lazily", () => {
    const schema = make();
    z.locale.set("pt");
    expect(z.treeifyError(schema.safeParse("xz").error!).errors).toEqual([
      "B falhou",
    ]);
  });

  it("`error` overrides every step", () => {
    const schema = make({ error: "custom" });
    expect(z.treeifyError(schema.safeParse("zz").error!).errors).toEqual([
      "custom",
    ]);
    expect(z.treeifyError(schema.safeParse("xz").error!).errors).toEqual([
      "custom",
    ]);
  });

  it("`errors` overrides per step and wins over `error`", () => {
    const schema = make({ error: "generic", errors: { b: "only b" } });
    expect(z.treeifyError(schema.safeParse("zz").error!).errors).toEqual([
      "generic",
    ]);
    expect(z.treeifyError(schema.safeParse("xz").error!).errors).toEqual([
      "only b",
    ]);
  });

  it("`error` function receives the step name in issue params", () => {
    const schema = make({
      error: (issue: any) => `step:${issue.params?.step}`,
    });
    expect(z.treeifyError(schema.safeParse("xz").error!).errors).toEqual([
      "step:b",
    ]);
  });

  it("rejects unknown step names at compile time", () => {
    // @ts-expect-error "c" is not a step
    make({ errors: { c: "nope" } });
  });
});
