import type { TParams } from "~/types";
import { getNumericValues, getSelectableValues } from "~/shared/api/products/utils";

export const mapProductAddToDto = (params: TParams) => {
  return {
    ...params,
    count: Number(params.count),
    enabled: Boolean(params.enabled),
    numericValues:
      params.numericValues && typeof params.numericValues === "string"
        ? getNumericValues(params.numericValues)
        : params.numericValues,
    price: Number(params.price),
    selectableValues:
      params.selectableValues && typeof params.selectableValues === "string"
        ? getSelectableValues(params.selectableValues)
        : params.selectableValues,
  };
};
