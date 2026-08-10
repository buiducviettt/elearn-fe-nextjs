import { Button, ButtonProps } from "antd";
import React from "react";

export type TMyButtonProps = {} & ButtonProps;

const MyButton: React.FC<TMyButtonProps> = (props) => {
  return <Button htmlType="button" {...props} />;
};

export default MyButton;
