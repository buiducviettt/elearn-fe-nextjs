import { ButtonHTMLAttributes, forwardRef } from "react";

export type TMyRawButtonProps = {} & ButtonHTMLAttributes<HTMLButtonElement>;

const MyRawButton = forwardRef<HTMLButtonElement, TMyRawButtonProps>(
  (props, ref) => {
    const { children, className = "", type, ...rest } = props;

    return (
      <button
        {...rest}
        ref={ref}
        className={`cursor-pointer ${className}`}
        type={type || "button"}
      >
        {children}
      </button>
    );
  },
);

MyRawButton.displayName = "MyRawButton"; // Helps with debugging in React DevTools

export default MyRawButton;
