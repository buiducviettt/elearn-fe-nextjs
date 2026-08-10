import { TAuthResponsePost } from "@/types/response";
import { POST } from "./http";

const URL = "/v1/auth";

export const authService = {
  post() {
    return POST<TAuthResponsePost>(URL, {});
  },
};
