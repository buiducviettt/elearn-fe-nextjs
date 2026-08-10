import { GET, POST, PUT, DELETE } from "./http";
import { TBaseResponse } from "@/types/response";
import { sentencesItem } from "@/types/service-get";

const URL = "/v1/translation-sentence";

export const translationSentenceService = {
    create(data: Partial<sentencesItem>) {
        return POST<TBaseResponse<sentencesItem>>(`${URL}`, data);
    },
    get(id: number | string) {
        return GET<TBaseResponse<sentencesItem>>(`${URL}/${id}`);
    },
    update(id: number | string, data: Partial<sentencesItem>) {
        return PUT<TBaseResponse<sentencesItem>>(`${URL}/${id}`, data);
    },
    delete(id: number | string) {
        return DELETE<TBaseResponse<null>>(`${URL}/${id}`);
    },
};
