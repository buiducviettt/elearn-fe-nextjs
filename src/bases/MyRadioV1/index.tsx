"use client";

import { Skeleton } from "antd";
import { createContext, HTMLAttributes, useContext, useState } from "react";
import MyEmpty from "../MyEmpty";
import MyRadioCustom from "../MyRadioCustom";

type TValue = string | number;
type TItemProps = {
  value: TValue;
  offActive?: boolean;
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

type TContext = {
  value: TValue;
  onChange: (value: TValue) => void;
};
export type TMyRadioV1Props = {
  value?: TValue;
  isEmpty?: boolean;
  loading?: boolean;
  onChange?: (value: TValue) => void;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  children: React.ReactNode;
};
type TFCMyRadioV1Props = React.FC<TMyRadioV1Props> & {
  Item: React.FC<TItemProps>;
};

const WrapperContext = createContext<TContext>({
  value: "",
  onChange: () => {},
});

const MyRadioV1: TFCMyRadioV1Props = (props) => {
  const {
    value,
    onChange,
    children,
    loading = false,
    isEmpty = false,
    className = "",
  } = props;
  const [insideValue, setInsideValue] = useState("");

  const finalValue = value || insideValue;
  const finalChange = (onChange || setInsideValue) as TContext["onChange"];
  return (
    <WrapperContext.Provider
      value={{
        value: finalValue,
        onChange: finalChange,
      }}
    >
      <div className={` flex  gap-1   ${className}`}>
        {!loading && children}
        {loading && (
          <>
            <div className="flex gap-2">
              <Skeleton.Button active size="small" shape="circle" />
              <Skeleton.Button block active size="small" shape="square" />
            </div>
            <div className="flex gap-2">
              <Skeleton.Button active size="small" shape="circle" />
              <Skeleton.Button active size="small" block shape="square" />
            </div>
            <div className="flex gap-2">
              <Skeleton.Button active size="small" shape="circle" />
              <Skeleton.Button active size="small" block shape="square" />
            </div>
          </>
        )}
        {!loading && isEmpty && <MyEmpty />}
      </div>
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
  const { onChange, value } = useContext(WrapperContext);

  const checked = itemValue === value;
  const isActiveStyle = checked && !offActive;
  return (
    <MyRadioCustom
      isActiveStyle={isActiveStyle}
      onClick={() => {
        onChange(itemValue);
      }}
      checked={checked}
      className={className}
    >
      {children}
    </MyRadioCustom>
  );
};
MyRadioV1.Item = Item;

export default MyRadioV1;
