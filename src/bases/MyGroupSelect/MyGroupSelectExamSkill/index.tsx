import useExamSkill from "@/hooks/useExamSkill";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectExamSkillProps = {
  disabledSkills?: string[];
} & Omit<TMyGroupSelectProps, "children">;

const MyGroupSelectExamSkill: React.FC<TMyGroupSelectExamSkillProps> = (
  props,
) => {
  const { disabledSkills = [], ...rest } = props;

  const { data = [], isLoading } = useExamSkill();

return (
  <MyGroupSelect isEmpty={data.length === 0} loading={isLoading} {...rest}>
    {data.map((item) => {
      const { id, name } = item;
      const isDisabled = disabledSkills.includes(String(id));
      return (
        <div
          className={`flex-1 flex justify-center ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
          key={id}
        >
          <MyGroupSelect.Item key={id} value={id} disabled={isDisabled}>
            {name}
          </MyGroupSelect.Item>
        </div>
      );
    })}
  </MyGroupSelect>
);
};

export default MyGroupSelectExamSkill;