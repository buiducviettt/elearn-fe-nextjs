import { OBJECT_TEST_TYPES } from "@/types/common";
import { TEST_TYPES } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectTestTypeProps = {} & Omit<
  TMyGroupSelectProps<TEST_TYPES>,
  "children"
>;
const MyGroupSelectTestType: React.FC<TMyGroupSelectTestTypeProps> = (
  props,
) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_TEST_TYPES);

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

export default MyGroupSelectTestType;
