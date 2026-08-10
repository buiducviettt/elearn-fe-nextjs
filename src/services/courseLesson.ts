import { TBaseResponse } from "@/types/response";
import {
    TCourseItemLesson,
    TCourseLessonGetResponse,
} from "@/types/service-get";
import { TCourseItemLessonPost } from "@/types/service-post";
import { DELETE, GET, POST } from "./http";

const URL = "/v1/lesson";

export const courseLessonService = {
    post(body: TCourseItemLessonPost) {
        return POST<TBaseResponse<TCourseLessonGetResponse>>(URL, body);
    },
    update(id: number, body: TCourseItemLessonPost) {
        return POST<TBaseResponse<TCourseLessonGetResponse>>(
            `${URL}/${id}`,
            body,
        );
    },
    keyGet: `GET ${URL}`,
    get(params: TCourseItemLesson) {
        return GET<TBaseResponse<TCourseLessonGetResponse>>(URL, params);
    },
    delete(id: number) {
        return DELETE<TBaseResponse>(`${URL}/${id}`);
    },
};
