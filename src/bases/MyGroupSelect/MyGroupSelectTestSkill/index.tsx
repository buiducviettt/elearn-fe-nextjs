import { OBJECT_SKILL } from "@/types/common";
import { EXAM_SKILL } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectTestSkillProps = {} & Omit<
  TMyGroupSelectProps<EXAM_SKILL>,
  "children"
>;
const MyGroupSelectTestSkill: React.FC<TMyGroupSelectTestSkillProps> = (
  props,
) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_SKILL);

  return (
    <MyGroupSelect 
      isEmpty={data.length === 0} 
      {...rest}
    >
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

export default MyGroupSelectTestSkill;