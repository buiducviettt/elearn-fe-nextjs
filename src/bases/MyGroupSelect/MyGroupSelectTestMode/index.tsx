import { OBJECT_TEST_MODE } from "@/types/common";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectTestModeProps = {
  isablePartMode?: boolean;
} & Omit<
  TMyGroupSelectProps,
  "children"
>;
const MyGroupSelectTestMode: React.FC<
  TMyGroupSelectTestModeProps
> = (props) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_TEST_MODE);

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

export default MyGroupSelectTestMode;
