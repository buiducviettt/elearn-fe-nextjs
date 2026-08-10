import { BACKEND_API } from "@/constants/common";
import { GET, POST, PUT, DELETE } from "./http";
import { TBaseResponse } from "@/types/response";
import { TTranslation } from "@/types/service-get";

const URL = "/v1/translation";

export const translationService = {
    create(data: Partial<TTranslation>) {
        return POST<TBaseResponse<TTranslation>>(`${URL}`, data);
    },

    get(id: number | string) {
        return GET<TBaseResponse<TTranslation>>(`${URL}/${id}`);
    },

    update(id: number | string, data: Partial<TTranslation>) {
        return PUT<TBaseResponse<TTranslation>>(`${URL}/${id}`, data);
    },

    delete(id: number | string) {
        return DELETE<TBaseResponse<null>>(`${URL}/${id}`);
    },
};
