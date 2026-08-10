import MyAnswerGroup, { TMyAnserGroupProps } from "..";
import MyInput from "@/bases/MyInput";

type TMyAnswerGroupText = Omit<TMyAnserGroupProps<string>, "children">;

const MyAnswerGroupText: React.FC<TMyAnswerGroupText> = (props) => {
  return (
    <MyAnswerGroup<string> {...props}>
      {({ onChange, value }) => (
        <MyInput
          placeholder="Nhập câu trả lời"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </MyAnswerGroup>
  );
};

export default MyAnswerGroupText;
