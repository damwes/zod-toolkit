import { z } from "zod";

import { booleanCoerce } from "../validators/global/boolean";
import { portNumber } from "../validators/global/port";

export const coerce = {
  ...z.coerce,
  port: portNumber,
  boolean: booleanCoerce,
};
