import performanceHandler from "@/utils/performanceHandler";
import { Input, InputProps } from "antd";
import React, { useMemo } from "react";

export type TMyInputProps = {
  onChangeDebounced?: InputProps["onChange"];
} & InputProps;

const MyInput: React.FC<TMyInputProps> = (props) => {
  const { onChangeDebounced, onChange, ...rest } = props;
  const debounced = useMemo(() => performanceHandler.debounce(), []);
  return (
    <Input
      onChange={(event) => {
        debounced(() => {
          onChangeDebounced?.(event);
        });
        onChange?.(event);
      }}
      {...rest}
    />
  );
};

export default MyInput;
