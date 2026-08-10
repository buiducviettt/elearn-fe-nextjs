import { TBaseResponse } from "@/types/response";
import {
    TproductsQuestionTypeGet,
    TproductsQuestionTypeGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_question_type";
const URL_WP = "/wp-json/wp";
export const productsQuestionTypeService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsQuestionTypeGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsQuestionTypeGetResponse>>(
            URL,
            params,
            {
                baseUrl,
            },
        );
    },
};
