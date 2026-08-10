"use client";

import Loading from "@/app/loading";
import { URL_LOGIN, URL_WP_LOGIN, WP_DOMAIN, URL_WP_BASE_PATH } from "@/constants/common";
import useUser from "@/global-state/useUser";
import { authService } from "@/services/auth";
import { setToken } from "@/services/http";
import environmentHandler from "@/utils/environmentHandler";
import toastHandler from "@/utils/toastHandler";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthenticationLayout = ({ children }) => {
  const {
    user,
    loading: authenticating,
    setUser,
    resetUser,
    setLoading,
  } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If development mode, no need to authenticate
    // => this feature just only apply for production
    // => where this code is hosted with wordpress
    if (!environmentHandler.isDevelopment) {
      const authenticate = async () => {
        setLoading(true);
        try {
          const userResponse = await authService.post();

          setUser({
            id: Number(userResponse.payload.data.user.ID),
            token: userResponse.payload.data.token,
            user_email: userResponse.payload.data.user.data.user_email,
            user_nicename: userResponse.payload.data.user.data.user_nicename,
            urlLogout: userResponse.payload.data.logout_url,
          });
          setToken(userResponse.payload.data.token);
        } catch {
          toastHandler.error("Hết hạn đăng nhập");
          resetUser();
          const currentPath = window.location.pathname.replace(URL_WP_BASE_PATH, '');
          window.location.href = `${WP_DOMAIN}${URL_WP_LOGIN}?redirect_to=${encodeURIComponent(
            `${WP_DOMAIN}${URL_WP_BASE_PATH}${currentPath}`
          )}`;
        }
        setLoading(false);
      };
      authenticate();
    }
  }, [resetUser, setLoading, setUser]);

  useEffect(() => {
    // handle for development environment
    if (environmentHandler.isDevelopment && !Boolean(user?.id)) {
      setToken(user?.token || "");
      router.push(URL_LOGIN);
    }
  }, [router, user?.id, user?.token]);

  if (authenticating || !Boolean(user?.id)) {
    // show to auth or navigate to login
    return <Loading />;
  }
  return children;
};

export default AuthenticationLayout;
