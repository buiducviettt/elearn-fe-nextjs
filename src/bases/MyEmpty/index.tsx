import { Empty } from "antd";
import { EmptyProps } from "antd/lib";
import React from "react";

export type TMyEmptyProps = {} & EmptyProps;

const MyEmpty: React.FC<TMyEmptyProps> = (props) => {
  return <Empty {...props} />;
};

export default MyEmpty;
