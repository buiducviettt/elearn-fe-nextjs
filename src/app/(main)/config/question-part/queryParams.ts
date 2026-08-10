import { createLoader, parseAsInteger } from "nuqs/server";

export const queryParams = {
  page: parseAsInteger.withDefault(1),
};

export const loadQueryParams = createLoader(queryParams);
