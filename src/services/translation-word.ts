import { GET, POST, PUT, DELETE } from "./http";
import { TBaseResponse } from "@/types/response";
import { WordItem } from "@/types/service-get";

const URL = "/v1/translation-word";

export const translationWordService = {
    create(data: Partial<WordItem>) {
        return POST<TBaseResponse<WordItem>>(`${URL}`, data);
    },
    get(id: number | string) {
        return GET<TBaseResponse<WordItem>>(`${URL}/${id}`);
    },
    update(id: number | string, data: Partial<WordItem>) {
        return PUT<TBaseResponse<WordItem>>(`${URL}/${id}`, data);
    },
    delete(id: number | string) {
        return DELETE<TBaseResponse<null>>(`${URL}/${id}`);
    },
};
