import { LiaTimesSolid } from "react-icons/lia";
import { TMyCheckboxProps } from "../MyCheckbox";
import MyCheckboxLarge from "../MyCheckbox/MyCheckboxLarge";
import MyFormItem from "../MyFormItem";
import MyInput, { TMyInputProps } from "../MyInput";
import MyRawButton, { TMyRawButtonProps } from "../MyRawButton";
type TMyItemAnswerMultipleChoiceProps = {
  input?: TMyInputProps;
  viewMode?: boolean;
  checked: TMyCheckboxProps["checked"];
  onChangeCheckbox: TMyCheckboxProps["onChange"];
  btnDelete?: TMyRawButtonProps;
};
const MyItemAnswerMultipleChoice: React.FC<TMyItemAnswerMultipleChoiceProps> = (
  props,
) => {
  const {
    input = {},
    btnDelete = {},
    checked,
    onChangeCheckbox,
    viewMode = false,
  } = props;

  return (
    <div
      className={`flex    rounded-base  py-1.5 px-2.5  gap-3 items-center ${
        checked ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <MyCheckboxLarge onChange={onChangeCheckbox} checked={checked} />
      <MyFormItem className="flex-1" style={{ marginBottom: 0 }}>
        <MyInput placeholder="Nhập đáp án" disabled={viewMode} {...input} />
      </MyFormItem>
      {!viewMode && (
        <MyRawButton className="p-1 hover:bg-gray-50 rounded-md" {...btnDelete}>
          <LiaTimesSolid className="text-gray-600 " size={24} />
        </MyRawButton>
      )}
    </div>
  );
};

export default MyItemAnswerMultipleChoice;
