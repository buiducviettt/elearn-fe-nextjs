import { BACKEND_API } from "@/constants/common";
import { TMediaServiceUpload, TMediaServiceUploadGet } from "@/types/response";
import { DELETE, GET, POST } from "./http";

export const mediaService = {
  // Upload ảnh
  post(file: string | Blob | File) {
    const formData = new FormData();
    formData.append("file", file);

    return POST<TMediaServiceUpload>("/wp-json/wp/v2/media", formData, {
      baseUrl: BACKEND_API,
    });
  },

  // Lấy danh sách media
  get(params?: { per_page?: number; page?: number; media_type?: string }) {
    return GET<TMediaServiceUploadGet>("/wp-json/wp/v2/media", params, {
      baseUrl: BACKEND_API,
    });
  },

  // Xóa ảnh theo ID
  delete(id: number) {
    return DELETE<TMediaServiceUpload>("/wp-json/wp/v2/media/" + id, {
      baseUrl: BACKEND_API,
      params: {
        force: true
      }
    });
  },
};
