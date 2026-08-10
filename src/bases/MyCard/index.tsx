import { Card } from "antd";
import { CardProps } from "antd/lib";
import { forwardRef } from "react";

export type TMyCardProps = CardProps;

const MyCard = forwardRef<HTMLDivElement, TMyCardProps>((props, ref) => {
  return <Card ref={ref} {...props} />;
});

MyCard.displayName = "MyCard";

export default MyCard;
