import type { TTableSortingProps } from "~/uikit/Table/types";

export function getInitialSortingColumnState(params?: TTableSortingProps) {
  if (params?.defaultSorting)
    return params.multiple && !Array.isArray(params.defaultSorting)
      ? [params.defaultSorting]
      : params.defaultSorting;

  return params?.multiple ? [] : null;
}
