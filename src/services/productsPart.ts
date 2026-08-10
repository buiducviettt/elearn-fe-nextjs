import { TBaseResponse } from "@/types/response";
import {
    TproductsPartGet,
    TproductsPartGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_part";
const URL_WP = "/wp-json/wp";
export const productsPartService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsPartGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsPartGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
