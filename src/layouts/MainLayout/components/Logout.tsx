"use client";
import MyButton from "@/bases/MyButton";
import { URL_LOGIN } from "@/constants/common";
import useUser from "@/global-state/useUser";
import environmentHandler from "@/utils/environmentHandler";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const urlLogout = useUser((data) => data.user?.urlLogout);
  const resetUser = useUser((data) => data.resetUser);
  const handleLogout = async () => {
    if (environmentHandler.isDevelopment) {
      resetUser();
      router.push(URL_LOGIN);
      return;
    }
    window.location.href = `${urlLogout}`;
  };

  return <MyButton onClick={handleLogout}>Đăng xuất</MyButton>;
};

export default Logout;
