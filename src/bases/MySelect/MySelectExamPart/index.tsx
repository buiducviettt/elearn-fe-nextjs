import useExamPart from "@/hooks/useExamPart";
import MySelect, { TMySelectProps } from "..";
type TMySelectExamPartProps = {} & TMySelectProps;
const MySelectExamPart: React.FC<TMySelectExamPartProps> = (props) => {
  const { ...rest } = props;
  const { data = [], isLoading } = useExamPart();

  const options = data.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <MySelect
      placeholder="Chọn phần câu hỏi"
      options={options}
      loading={isLoading}
      {...rest}
    />
  );
};

export default MySelectExamPart;
