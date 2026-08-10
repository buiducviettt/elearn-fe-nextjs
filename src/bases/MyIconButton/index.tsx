import { forwardRef } from "react";
import { BiEdit } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import { RiDeleteBin5Line, RiFileHistoryFill } from "react-icons/ri";

import MyRawButton, { TMyRawButtonProps } from "../MyRawButton";

const ICONS = {
  DELETE: RiDeleteBin5Line,
  EDIT: BiEdit,
  ADD: IoAddCircleOutline,
  HISTORY: RiFileHistoryFill,
};

const COLORS = {
  RED: "bg-red-500",
  BLUE: "bg-blue-500",
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-500",
  PURPLE: "bg-purple-500",
  ORANGE: "bg-orange-500",
  PINK: "bg-pink-500",
  BROWN: "bg-brown-500",
  TEAL: "bg-teal-500",
  INDIGO: "bg-indigo-500",
  CYAN: "bg-cyan-500",
  GRAY: "bg-gray-500",
  WHITE: "bg-white",
};

type TMyIconButtonProps = {
  icon: keyof typeof ICONS;
  color: keyof typeof COLORS;
} & TMyRawButtonProps;

const MyIconButton = forwardRef<HTMLButtonElement, TMyIconButtonProps>(
  ({ icon, color, className = "", ...rest }, ref) => {
    const ICON = ICONS[icon];
    const COLOR = COLORS[color];

    return (
      <MyRawButton
        ref={ref}
        className={`p-1.5 ${COLOR} hover:opacity-80 rounded-md ${className}`}
        {...rest}
      >
        <ICON size={17} className="text-white" />
      </MyRawButton>
    );
  }
);

MyIconButton.displayName = "MyIconButton";

export default MyIconButton;
