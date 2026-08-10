import { Spin } from "antd";
import { SpinProps } from "antd/lib";
import React from "react";

export type TMySpinProps = {} & SpinProps;
const MySpin: React.FC<TMySpinProps> = (props) => {
  return <Spin {...props} />;
};

export default MySpin;
