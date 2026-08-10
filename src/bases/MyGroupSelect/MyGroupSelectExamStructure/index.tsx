import { OBJECT_EXAM_STRUCTURE } from "@/types/common";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
import { EXAM_STRUCTURE } from "@/types/enum"; 

type TMyGroupSelectExamStructureProps = {
  disabledGroup?: boolean;
} & Omit<TMyGroupSelectProps, "children">;

const MyGroupSelectExamStructure: React.FC<TMyGroupSelectExamStructureProps> = (
  props,
) => {
  const { disabledGroup, ...rest } = props;
  const data = Object.values(OBJECT_EXAM_STRUCTURE);

  return (
    <MyGroupSelect isEmpty={data.length === 0} {...rest}>
      {data.map((item) => {
        const { value, label } = item;
        const isDisabled = disabledGroup && value === EXAM_STRUCTURE.group;
        return (
          <MyGroupSelect.Item
            className={`min-w-24 ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
            key={String(value)}
            value={value}
            disabled={isDisabled}
          >
            {label}
          </MyGroupSelect.Item>
        );
      })}
    </MyGroupSelect>
  );
};

export default MyGroupSelectExamStructure;