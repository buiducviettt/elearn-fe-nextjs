import { Radio } from "antd";
import MyFormItem from "../MyFormItem";
import MyTextArea from "../MyTextArea";
import MyUploadImageHasApi from "../MyUploadImage/MyUploadImageHasApi";
import { useState } from "react";

const InputType = ({ onChange, viewMode, value }) => {
  const { type, content } = value;
  const [editingType, setEditingType] = useState(type);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Radio.Group
        disabled={viewMode}
        value={editingType}
        onChange={(e) => {
          setEditingType((prev) => {
            if (prev === "image") {
            }
            return e.target.value;
          });
        }}
        className="flex-shrink-0 w-full"
      >
        <Radio.Button value="text">Chữ</Radio.Button>
        <Radio.Button value="image">Ảnh</Radio.Button>
      </Radio.Group>
      {editingType === "image" && (
        <MyUploadImageHasApi
          disabled={viewMode}
          height={120}
          hideText
          value={type === "image" ? content : ""}
          onChange={(value) => {
            setEditingType("image");
            onChange({
              content: value,
              type: "image",
            });
          }}
        />
      )}
      {editingType === "text" && (
        <MyFormItem style={{ marginBottom: 0 }}>
          <MyTextArea
            disabled={viewMode}
            value={type === "image" ? "" : content}
            onChange={(e) => {
              setEditingType("text");
              onChange({
                content: e.target.value,
                type: "text",
              });
            }}
            rows={5}
            className="flex-1 h-[200px]"
          />
        </MyFormItem>
      )}
    </div>
  );
};

export default InputType;
