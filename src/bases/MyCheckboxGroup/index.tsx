"use client";

import { createContext, HTMLAttributes, useContext, useState } from "react";
import MyCheckboxLarge from "../MyCheckbox/MyCheckboxLarge";
import MyRadioCustom from "../MyRadioCustom";
import MyRawButton from "../MyRawButton";

type TValue = (string | number)[];
type TItemProps = {
  value: TValue[0];
  offActive?: boolean;
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

type TContext = {
  value: TValue;
  handleChangeChecked: (value: TItemProps["value"]) => void;
  // displayDynamic: boolean; // Tạm thời comment lại
};

export type TMyCheckboxGroupProps = {
  value?: TValue;
  onChange?: (value: TValue) => void;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  // displayDynamic?: boolean; // Tạm thời comment lại
  children: React.ReactNode;
};
type TFCMyCheckboxGroupProps = React.FC<TMyCheckboxGroupProps> & {
  Item: React.FC<TItemProps>;
};

const WrapperContext = createContext<TContext>({
  value: [],
  handleChangeChecked: () => {},
  // displayDynamic: false, // Tạm thời comment lại
});

const MyCheckboxGroup: TFCMyCheckboxGroupProps = (props) => {
  const {
    value,
    onChange,
    children,
    // displayDynamic = false, // Tạm thời comment lại
    className = "",
  } = props;
  const [insideValue, setInsideValue] = useState([]);

  const finalValue = value || insideValue;
  const finalChange = (onChange || setInsideValue) as (value: TValue) => void;
  const handleChangeChecked = (value: TItemProps["value"]) => {
    const index = finalValue.indexOf(value);
    if (index === -1) {
      finalChange([...finalValue, value]);
    } else {
      finalChange([
        ...finalValue.slice(0, index),
        ...finalValue.slice(index + 1),
      ]);
    }
  };

  return (
    <WrapperContext.Provider
      value={{
        value: finalValue,
        handleChangeChecked: handleChangeChecked,
        // displayDynamic: displayDynamic, // Tạm thời comment lại
      }}
    >
      <div className={` flex  gap-1   ${className}`}>{children}</div>
    </WrapperContext.Provider>
  );
};

const Item: React.FC<TItemProps> = (props) => {
  const {
    value: itemValue,
    children,
    className = "",
    offActive = false,
  } = props;
  const { handleChangeChecked, value } = useContext(WrapperContext);

  const checked = value.includes(itemValue);
  const isActiveStyle = checked && !offActive;

  // if (value.length <= 1 && displayDynamic) { // Tạm thời comment lại
  //   return (
  //     <MyRadioCustom
  //       onClick={() => {
  //         handleChangeChecked(itemValue);
  //       }}
  //       checked={checked}
  //     >
  //       {children}
  //     </MyRadioCustom>
  //   );
  // }

  return (
    <MyRawButton
      onClick={() => {
        handleChangeChecked(itemValue);
      }}
      className={`flex gap-2 px-2.5  py-2 rounded-md  items-center ${
        isActiveStyle ? "bg-sky-50" : "hover:bg-gray-50"
      } ${className}`}
    >
      <MyCheckboxLarge checked={checked} />
      {children}
    </MyRawButton>
  );
};
MyCheckboxGroup.Item = Item;

export default MyCheckboxGroup;