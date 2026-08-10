import { Input } from "antd";
import { TextAreaProps } from "antd/es/input";

type TMyTextArea = {} & TextAreaProps;

const MyTextArea: React.FC<TMyTextArea> = (props) => {
  return <Input.TextArea rows={4} {...props} />;
};

export default MyTextArea;
