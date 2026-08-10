import { FiPlus } from "react-icons/fi";
import MyRawButton, { TMyRawButtonProps } from "../MyRawButton";
type TMyQuestionItemAddProps = {} & TMyRawButtonProps;
const MyQuestionItemAdd: React.FC<TMyQuestionItemAddProps> = (props) => {
  const { className = "", ...rest } = props;
  return (
    <MyRawButton
      className={`flex py-1.5 px-2.5 cursor-pointer hover:bg-gray-50 rounded-base gap-3 items-center ${className}`}
      {...rest}
    >
      <div className="flex gap-3 items-center">
        <div className="bg-blue-600 text-white p-1 rounded-full">
          <FiPlus />
        </div>
        <span className="text-blue-600 text-md font-medium">Thêm đáp án</span>
      </div>
    </MyRawButton>
  );
};

export default MyQuestionItemAdd;
