import { OBJECT_TEST_PRIVATE } from "@/types/common";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
import { TEST_PRIVATE } from "@/types/enum";
export type TMyGroupSelectTestPrivateProps = {} & Omit<
  TMyGroupSelectProps<TEST_PRIVATE>,
  "children"
>;
const MyGroupSelectTestPrivate: React.FC<TMyGroupSelectTestPrivateProps> = (
  props,
) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_TEST_PRIVATE);

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

export default MyGroupSelectTestPrivate;
