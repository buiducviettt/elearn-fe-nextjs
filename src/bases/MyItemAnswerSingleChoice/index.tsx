import { LiaTimesSolid } from "react-icons/lia";
import MyFormItem from "../MyFormItem";
import MyInput, { TMyInputProps } from "../MyInput";
import MyRadioCustom, { TMyRadioCustomProps } from "../MyRadioCustom";
import MyRawButton, { TMyRawButtonProps } from "../MyRawButton";
type TMyItemAnswerSingleChoiceProps = {
    input?: TMyInputProps;
    viewMode?: boolean;
    checked: TMyRadioCustomProps["checked"];
    onClick: TMyRadioCustomProps["onClick"];
    btnDelete?: TMyRawButtonProps;
};
const MyItemAnswerSingleChoice: React.FC<TMyItemAnswerSingleChoiceProps> = (
    props,
) => {
    const {
        input = {},
        btnDelete = {},
        checked,
        onClick,
        viewMode = false,
    } = props;

    return (
        <div
            className={`flex    rounded-base  py-1.5 px-2.5  gap-3 items-center ${
                checked ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
        >
            <MyRadioCustom
                className="!px-1 !py-1"
                checked={checked}
                onClick={onClick}
            />
            <MyFormItem className="flex-1" style={{ marginBottom: 0 }}>
                <MyInput
                    placeholder="Nhập đáp án"
                    disabled={viewMode}
                    {...input}
                />
            </MyFormItem>
            {!viewMode && (
                <MyRawButton
                    className="p-1 hover:bg-gray-50 rounded-md"
                    {...btnDelete}
                >
                    <LiaTimesSolid className="text-gray-600 " size={24} />
                </MyRawButton>
            )}
        </div>
    );
};

export default MyItemAnswerSingleChoice;
