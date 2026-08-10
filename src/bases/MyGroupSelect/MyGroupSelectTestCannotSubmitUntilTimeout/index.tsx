import { OBJECT_TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT } from "@/types/common";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectTestCannotSubmitUntilTimeoutProps = {} & Omit<
  TMyGroupSelectProps,
  "children"
>;
const MyGroupSelectTestCannotSubmitUntilTimeout: React.FC<
  TMyGroupSelectTestCannotSubmitUntilTimeoutProps
> = (props) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT);

  return (
    <MyGroupSelect isEmpty={data.length === 0} {...rest}>
      {data.map((item) => {
        const { value, label } = item;
        return (
          <MyGroupSelect.Item key={value} value={value}>
            {label}
          </MyGroupSelect.Item>
        );
      })}
    </MyGroupSelect>
  );
};

export default MyGroupSelectTestCannotSubmitUntilTimeout;
