import { TBaseResponse } from "@/types/response";
import {
    TproductsSectionGet,
    TproductsSectionGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v2/product_section";
const URL_WP = "/wp-json/wp";
export const productsSectionService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsSectionGet) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsSectionGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
