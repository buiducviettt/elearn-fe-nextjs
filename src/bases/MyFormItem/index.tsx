"use client";
import { Form } from "antd";
import { FormItemProps } from "antd/lib";
type TMyFormItemProps = {} & FormItemProps;
const MyFormItem: React.FC<TMyFormItemProps> = (props) => {
  const { children, ...rest } = props;
  return <Form.Item {...rest}>{children}</Form.Item>;
};

export default MyFormItem;
