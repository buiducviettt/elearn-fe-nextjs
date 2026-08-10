import { TEST_PRIVATE } from "@/types/enum";

export const validTestPrivateHasInput = async (_, valueData) => {
  const { value, password } = valueData || {};
  if (value === TEST_PRIVATE.yes && !password) {
    return Promise.reject("Vui lòng nhập mật khẩu");
  }
};
