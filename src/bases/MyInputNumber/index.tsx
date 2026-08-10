import { InputNumber } from "antd";
import { InputNumberProps } from "antd/lib";
import React from "react";
type TMyInputNumberProps = {} & InputNumberProps;
const MyInputNumber: React.FC<TMyInputNumberProps> = (props) => {
  const { ...rest } = props;
  return <InputNumber {...rest} />;
};

export default MyInputNumber;
