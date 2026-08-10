import { Radio } from "antd";
import MyFormItem from "../MyFormItem";
import MyTextArea from "../MyTextArea";
import MyUploadImageHasApi from "../MyUploadImage/MyUploadImageHasApi";

const InputType = ({ onChange, viewMode, value }) => {
  const { type, content } = value;

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Radio.Group
        disabled={viewMode}
        value={type}
        onChange={(e) => {
          onChange({
            content: "",
            type: e.target.value,
          });
        }}
        className="flex-shrink-0 w-full"
      >
        <Radio.Button value="text">Chữ</Radio.Button>
        <Radio.Button value="image">Ảnh</Radio.Button>
      </Radio.Group>
      {type === "image" && (
        <MyUploadImageHasApi
          disabled={viewMode}
          height={120}
          hideText
          value={content}
          onChange={(value) => {
            onChange({
              content: value,
              type: type,
            });
          }}
        />
      )}
      {type === "text" && (
        <MyFormItem style={{ marginBottom: 0 }}>
          <MyTextArea
            disabled={viewMode}
            value={content}
            onChange={(e) => {
              onChange({
                content: e.target.value,
                type: type,
              });
            }}
            rows={1}
            className="flex-1"
          />
        </MyFormItem>
      )}
    </div>
  );
};

export default InputType;
