import {
  TBaseResponse,
  TQuestionGetDetailResponse,
  TQuestionGetResponse,
} from "@/types/response";
import { TQuestionGet } from "@/types/service-get";
import { TQuestionPost } from "@/types/service-post";
import { DELETE, GET, POST } from "./http";

const URL = "/v1/question";

export const questionService = {
  create(body: TQuestionPost) {
    return POST<TBaseResponse<{
      question_id: any;
}>>(URL, body);
  },
  update(id: number, body: TQuestionPost) {
    return POST<TBaseResponse>(`${URL}/${id}`, body);
  },
  keyGet: "GET /v1/question",
  get(params: TQuestionGet) {
    return GET<TBaseResponse<TQuestionGetResponse>>(URL, params);
  },
  keyGetDetail: "GET /v1/question",
  getDetail(questionId: string | number) {
    return GET<TBaseResponse<TQuestionGetDetailResponse>>(
      `${URL}/${questionId}`,
    );
  },
  delete(questionId: string | number) {
    return DELETE<TBaseResponse>(`${URL}/${questionId}`);
  },
};
