import { BACKEND_API } from "@/constants/common";
import { GET } from "./http";
import { TWalletGetParams, TWalletGetResponse } from "@/types/service-get";
import { TBaseResponse } from "@/types/response";

const URL = "/wp-json/elearn/v1/wallet";

export const walletService = {
    keyGet: "GET /v1/wallet",
    keyTransactions: "GET /v1/wallet/transactions",

    get(params?: TWalletGetParams) {
        const { id, ...rest } = (params as any) || {};
        if (id !== undefined && id !== null && `${id}` !== "") {
            return GET<TBaseResponse<TWalletGetResponse>>(
                `${URL}/${id}`,
                rest,
                { baseUrl: BACKEND_API }
            );
        }
        return GET<TBaseResponse<TWalletGetResponse>>(`${URL}/`, rest, {
            baseUrl: BACKEND_API,
        });
    },

    transactions(
        walletId: string | number,
        params?: { per_page?: number; page?: number }
    ) {
        return GET<TBaseResponse<TWalletGetResponse>>(
            `${URL}/${walletId}/transactions`,
            params,
            { baseUrl: BACKEND_API }
        );
    },
};
