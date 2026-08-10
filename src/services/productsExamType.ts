import { TBaseResponse } from "@/types/response";
import {
    TproductsExamTypeGet,
    TproductsExamTypeGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_exam_type";
const URL_WP = "/wp-json/wp";
export const productsExamTypeService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsExamTypeGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsExamTypeGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
