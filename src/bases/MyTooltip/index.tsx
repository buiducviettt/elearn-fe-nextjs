import { Tooltip, TooltipProps } from "antd";
import React from "react";

export type TMyTooltipProps = {} & TooltipProps;

const MyTooltip: React.FC<TMyTooltipProps> = (props) => {
  return <Tooltip {...props} />;
};

export default MyTooltip;
