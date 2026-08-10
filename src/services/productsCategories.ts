import { TBaseResponse } from "@/types/response";
import {
    TproductsCategories,
    TproductsCategoriesGetResponse,
} from "@/types/service-get";
import { DELETE, GET, POST } from "./http";
import { BACKEND_API, URL_WP_BASE_PATH } from "@/constants/common";

const URL = "/v3/products/categories";
const URL_WP = "/wp-json/wc";
export const productsCategoriesService = {
    keyGet: `GET ${URL}`,
    get(params: TproductsCategories) {
        const baseUrl = `${BACKEND_API}${URL_WP}`;
        return GET<TBaseResponse<TproductsCategoriesGetResponse>>(URL, params, {
            baseUrl,
        });
    },
};
