import { InputRef, PasswordProps } from "antd/es/input";
import Password from "antd/es/input/Password";
import { forwardRef } from "react";

type TMyPassword = PasswordProps;

const MyPassword = forwardRef<InputRef, TMyPassword>((props, ref) => {
  return <Password ref={ref} {...props} />;
});
MyPassword.displayName = "MyPassword";

export default MyPassword;
