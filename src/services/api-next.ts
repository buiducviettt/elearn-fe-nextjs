import { TPostAuth } from "@/types/service-post";
import { POST } from "./http";

const apiNextService = {
  auth(body: TPostAuth) {
    return POST("/api-next/auth", body, {
      baseUrl: "",
    });
  },

  logout() {
    return POST(
      "/api-next/logout",
      {},
      {
        baseUrl: "",
      },
    );
  },
};

export default apiNextService;
