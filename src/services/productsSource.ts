import { TBaseResponse } from "@/types/response";
import {
    TproductsSourceGet,
    TproductsSourceGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_source";
const URL_WP = "/wp-json/wp";
export const productsSourceService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsSourceGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsSourceGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
