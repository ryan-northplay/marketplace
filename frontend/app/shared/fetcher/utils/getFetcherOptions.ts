import type { FieldValues } from "react-hook-form";
import type { FetcherWithComponents } from "@remix-run/react";

import { EFetcherStates, EFetcherTypes } from "../enums";

type TGetFetcherOptionsReturn<T> = {
  fetcher: FetcherWithComponents<T>;
  isIdle: boolean;
  isLoading: boolean;
  isInitType: boolean;
  isDoneType: boolean;
};

export const getFetcherOptions = <T = FieldValues>(
  fetcher: FetcherWithComponents<T>,
): TGetFetcherOptionsReturn<T> => {
  const { state, type } = fetcher;

  return {
    fetcher,
    isIdle: state === EFetcherStates.Idle,
    isLoading: state === EFetcherStates.Loading || state === EFetcherStates.Submitting,
    isInitType: type === EFetcherTypes.Init,
    isDoneType: type === EFetcherTypes.Done,
  };
};
