import { OBJECT_TEST_EXPLANATION } from "@/types/common";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectTestExplanationProps = {} & Omit<
  TMyGroupSelectProps,
  "children"
>;
const MyGroupSelectTestExplanation: React.FC<
  TMyGroupSelectTestExplanationProps
> = (props) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_TEST_EXPLANATION);

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

export default MyGroupSelectTestExplanation;
