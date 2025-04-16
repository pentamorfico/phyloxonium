import * as constants from "@lib/constants";
import PhyloxoniumGL from "@core/PhyloxoniumGL";

Object.assign(
  PhyloxoniumGL,
  constants,
);

export { default as PhyloxoniumGL } from "@core/PhyloxoniumGL";
export * from "@lib/constants";
export default PhyloxoniumGL;