import useExamSkill from "@/hooks/useExamSkill";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectExamSkillProps = {} & Omit<TMyGroupSelectProps, "children">;
const MyGroupSelectExamSkill: React.FC<TMyGroupSelectExamSkillProps> = (
  props,
) => {
  const { ...rest } = props;

  const { data = [], isLoading } = useExamSkill();

  return (
    <MyGroupSelect isEmpty={data.length === 0} loading={isLoading} {...rest}>
      {data.map((item) => {
        const { id, name } = item;
        return (
          <MyGroupSelect.Item key={id} value={id}>
            {name}
          </MyGroupSelect.Item>
        );
      })}
    </MyGroupSelect>
  );
};

export default MyGroupSelectExamSkill;
