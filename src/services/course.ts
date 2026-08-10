import { TBaseResponse } from "@/types/response";
import { TCourse, TCourseGetResponse } from "@/types/service-get";
import { TCoursePost } from "@/types/service-post";
import { DELETE, GET, POST } from "./http";

const URL = "/v1/course";

export const courseService = {
    post(body: TCoursePost) {
        return POST<TBaseResponse>(URL, body);
    },
    update(id: number, body: TCoursePost) {
        return POST<TBaseResponse>(`${URL}/${id}`, body);
    },
    keyGet: `GET ${URL}`,
    get(params: TCourse) {
        return GET<TBaseResponse<TCourseGetResponse>>(URL, params);
    },
    delete(id: number) {
        return DELETE<TBaseResponse>(`${URL}/${id}`);
    },
};
