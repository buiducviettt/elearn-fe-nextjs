import { Select } from "antd";
import { SelectProps } from "antd/lib";
import React from "react";
export type TMySelectProps = {} & SelectProps;
const MySelect: React.FC<TMySelectProps> = (props) => {
  return <Select showSearch allowClear optionFilterProp="label" {...props} />;
};

export default MySelect;
