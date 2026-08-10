import { TBaseResponse } from "@/types/response";
import {
  TQuestionnaireGet,
  TQuestionnaireGetResponse,
} from "@/types/service-get";
import { TQuestionnairePost } from "@/types/service-post";
import { DELETE, GET, POST } from "./http";

const URL = "/v1/questionnaire";

export const questionnaireService = {
  post(body: TQuestionnairePost) {
    return POST<TBaseResponse>(URL, body);
  },
  update(id: number, body: TQuestionnairePost) {
    return POST<TBaseResponse>(`${URL}/${id}`, body);
  },
  keyGet: `GET ${URL}`,
  get(params: TQuestionnaireGet) {
    return GET<TBaseResponse<TQuestionnaireGetResponse>>(URL, params);
  },
  delete(id: number) {
    return DELETE<TBaseResponse>(`${URL}/${id}`);
  },
};
