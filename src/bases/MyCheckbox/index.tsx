import { Checkbox } from "antd";
import { CheckboxProps } from "antd/lib";
import React from "react";
export type TMyCheckboxProps = {} & CheckboxProps;
const MyCheckbox: React.FC<TMyCheckboxProps> = (props) => {
  const { ...rest } = props;

  return <Checkbox {...rest} />;
};

export default MyCheckbox;
