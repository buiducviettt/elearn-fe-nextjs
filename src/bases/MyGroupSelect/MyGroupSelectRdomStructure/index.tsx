import { OBJECT_RDOM_STRUCTURE } from "@/types/common";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectExamStructureProps = {} & Omit<
  TMyGroupSelectProps,
  "children"
>;
const MyGroupSelectRdomStructure: React.FC<TMyGroupSelectExamStructureProps> = (
  props,
) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_RDOM_STRUCTURE);

  return (
    <MyGroupSelect isEmpty={data.length === 0} {...rest}>
      {data.map((item) => {
        const { value, label } = item;
        return (
          <MyGroupSelect.Item
            className="min-w-24"
            key={String(value)}
            value={value}
          >
            {label}
          </MyGroupSelect.Item>
        );
      })}
    </MyGroupSelect>
  );
};

export default MyGroupSelectRdomStructure;
