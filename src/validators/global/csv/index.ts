import { z } from "zod";

export const csv = <T extends z.ZodType = z.ZodString>(item?: T) => {
  const items = z.array(item ?? z.string()) as unknown as z.ZodType<
    z.output<T>[],
    string[]
  >;

  return z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    )
    .pipe(items);
};
