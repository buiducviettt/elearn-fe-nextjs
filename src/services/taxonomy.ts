import { TTaxonomyResponseGet, TUserLoginResponsePost } from "@/types/response";
import { TTaxonomyGet } from "@/types/service-get";
import { TTaxonomyPost } from "@/types/service-post";
import { TTaxonomyPut } from "@/types/service-put";
import { DELETE, GET, POST, PUT } from "./http";

const URL = "/v1/taxonomy";

export const taxonomyService = {
  post(body: TTaxonomyPost) {
    return POST<TUserLoginResponsePost>(URL, body);
  },
  // server
  keyGet: "GET /v1/taxonomy",
  get(params: TTaxonomyGet, token?: string) {
    return GET<TTaxonomyResponseGet>(URL, params, {
      token,
    });
  },
  put(id: number, body: TTaxonomyPut) {
    return PUT(`${URL}/${id}`, body);
  },
  delete(id: number) {
    return DELETE(`${URL}/${id}`);
  },
};
