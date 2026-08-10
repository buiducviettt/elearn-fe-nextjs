import { RadioIcon, UnCheckedRadioIcon } from "@/assets";
import MyRawButton, { TMyRawButtonProps } from "../MyRawButton";

export type TMyRadioCustomProps = {
  checked: boolean;
  onClick: TMyRawButtonProps["onClick"];
  children?: React.ReactNode;
  isActiveStyle?: boolean;
  className?: string;
};

const MyRadioCustom: React.FC<TMyRadioCustomProps> = (props) => {
  const {
    checked,
    onClick,
    children,
    className,
    isActiveStyle = false,
  } = props;
  return (
    <MyRawButton
      onClick={onClick}
      className={`flex gap-2 px-2.5  py-2 rounded-md  items-center ${
        isActiveStyle ? "bg-sky-50" : "hover:bg-gray-50"
      } ${className}`}
    >
      {checked && <RadioIcon />}
      {!checked && <UnCheckedRadioIcon />}
      {children}
    </MyRawButton>
  );
};

export default MyRadioCustom;
