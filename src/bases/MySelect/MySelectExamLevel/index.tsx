import useExamLevel from "@/hooks/useExamLevel";
import MySelect, { TMySelectProps } from "..";
type TMySelectExamLevelProps = {} & TMySelectProps;
const MySelectExamLevel: React.FC<TMySelectExamLevelProps> = (props) => {
  const { ...rest } = props;
  const { data = [], isLoading } = useExamLevel();

  const options = data.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <MySelect
      placeholder="Chọn độ khó câu hỏi"
      options={options}
      loading={isLoading}
      {...rest}
    />
  );
};

export default MySelectExamLevel;
