import { TBaseResponse } from "@/types/response";
import {
    TproductsTopicGet,
    TproductsTopicGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_topic";
const URL_WP = "/wp-json/wp";
export const productsTopicService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsTopicGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsTopicGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
