import { createLoader, parseAsFloat } from "nuqs/server";

export const queryParams = {
  page: parseAsFloat.withDefault(1),
};

export const loadQueryParams = createLoader(queryParams);
