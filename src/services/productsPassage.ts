import { TBaseResponse } from "@/types/response";
import {
    TproductsPassageGet,
    TproductsPassageGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_passage";
const URL_WP = "/wp-json/wp";
export const productsPassageService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsPassageGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsPassageGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
