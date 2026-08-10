export const formRequired = {
    required: true,
    message: "Thông tin này là bắt buộc",
};

export const URL_LOGIN = "/login/";
export const URL_HOME = "/";
export const URL_WP_LOGIN = "/realieltsexams-login";
export const URL_WP_HOME_PAGE = "/wp-admin";
export const URL_WP_BASE_PATH = "/wp-elearn";

export const URLS_PUBLIC = [URL_LOGIN];

export const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
export const BACKEND_PREFIX = process.env.NEXT_PUBLIC_BACKEND_PREFIX;
export const WP_DOMAIN = process.env.NEXT_PUBLIC_WP_DOMAIN;

export const FULL_BACKEND_API = `${BACKEND_API}/${BACKEND_PREFIX}`;

export const KEY_STORAGE_USER = "user-storage";

export const PAGE_SIZE = 10;
export const PER_PAGE = 100;
