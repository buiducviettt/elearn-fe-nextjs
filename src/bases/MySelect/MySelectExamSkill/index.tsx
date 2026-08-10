import useExamSkill from "@/hooks/useExamSkill";
import MySelect, { TMySelectProps } from "..";
type TMySelectExamSkillProps = {} & TMySelectProps;
const MySelectExamSkill: React.FC<TMySelectExamSkillProps> = (props) => {
  const { ...rest } = props;
  const { data = [], isLoading } = useExamSkill();

  const options = data.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <MySelect
      placeholder="Chọn kỹ năng câu hỏi"
      options={options}
      loading={isLoading}
      {...rest}
    />
  );
};

export default MySelectExamSkill;
