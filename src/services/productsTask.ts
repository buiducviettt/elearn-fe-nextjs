import { TBaseResponse } from "@/types/response";
import {
    TproductsTaskGet,
    TproductsTaskGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_task";
const URL_WP = "/wp-json/wp";
export const productsTaskService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsTaskGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsTaskGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
