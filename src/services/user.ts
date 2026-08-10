import { GET } from "./http";
import { BACKEND_API } from "@/constants/common";
import { TWPUserListResponse } from "../types/response";

const USER_URL = "/wp-json/wp/v2/users";

export const userService = {
    get(params?: {
        id?: number | string;
        name?: string;
        per_page?: number;
        search?: string;
    }) {
        if (params?.id) {
            return GET<TWPUserListResponse>(
                `${USER_URL}/${params.id}`,
                undefined,
                { baseUrl: BACKEND_API }
            );
        }
        // Lấy danh sách user
        return GET<TWPUserListResponse>(USER_URL, params, {
            baseUrl: BACKEND_API,
        });
    },
};
