import {
  TBaseResponse,
  // TQuestionGetDetailResponse,
  // TQuestionGetResponse,
  THistoryGetResponse,
} from "@/types/response";
// import { TQuestionnaireHistory } from "@/types/service-get";
import { TQuestionPost } from "@/types/service-post";
import { DELETE, GET, POST } from "./http";

const URL = "/v1/history";

export const historyService = {
  create(body: TQuestionPost) {
    return POST<TBaseResponse<{ id: string }>>(URL, body);
  },
  update(id: number, body: TQuestionPost) {
    return POST<TBaseResponse>(`${URL}/${id}`, body);
  },
  keyGet: "GET /v1/history",
  get(params: any) {
    return GET<TBaseResponse<THistoryGetResponse>>(URL, params);
  },
  delete(historyId: string | number) {
    return DELETE<TBaseResponse>(`${URL}/${historyId}`);
  },
};
