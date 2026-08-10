import { TUserLoginResponsePost } from "@/types/response";
import { TUserLoginPost } from "@/types/service-post";
import { POST } from "./http";

const URL = "/v1/login";

export const userLoginService = {
  post(body: TUserLoginPost) {
    return POST<TUserLoginResponsePost>(URL, body);
  },
};
