import MyFormItem from "@/bases/MyFormItem";
import MyPassword from "@/bases/MyPassword";
import { TEST_PRIVATE } from "@/types/enum";
import { useState } from "react";
import MyGroupSelectTestPrivate, { TMyGroupSelectTestPrivateProps } from "..";

export type TValue = {
  value?: TEST_PRIVATE;
  password?: string;
};

export type TMyGroupSelectTestPrivateHasInputProps = {
  value?: TValue;
  onChange?: (value: TValue) => void;
} & TMyGroupSelectTestPrivateProps;

const MyGroupSelectTestPrivateHasInput: React.FC<
  TMyGroupSelectTestPrivateHasInputProps
> = (props) => {
  const { value: outsideValue, onChange, ...rest } = props;

  const [insideValue, setInsideValue] = useState<TValue>({
    value: undefined,
    password: "",
  });
  const finalValue = outsideValue || insideValue;
  const finalChange = (onChange || setInsideValue) as (value: TValue) => void;

  const { value, password } = finalValue || {};

  const handleChangeValue = (value) => {
    finalChange({ ...finalValue, value });
  };
  const handleChangePassword = (password: string) => {
    finalChange({ ...finalValue, password });
  };

  return (
    <div className="flex flex-col gap-2">
      <MyGroupSelectTestPrivate
        value={value}
        onChange={(value) => {
          handleChangeValue(value);
        }}
        {...rest}
      />
      {value === TEST_PRIVATE.yes && (
        <div className="flex gap-2 items-center">
          <p className="flex-shrink-0">Mật khẩu:</p>
          <MyFormItem style={{ marginBottom: 0 }}>
            <MyPassword
              value={password}
              onChange={(event) => {
                handleChangePassword(event.target.value);
              }}
              size="small"
            />
          </MyFormItem>
        </div>
      )}
    </div>
  );
};

export default MyGroupSelectTestPrivateHasInput;
