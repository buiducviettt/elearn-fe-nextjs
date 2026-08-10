import useExamCategory from "@/hooks/useExamCategory";
import MySelect, { TMySelectProps } from "..";
type TMySelectExamCategoryProps = {} & TMySelectProps;
const MySelectExamCategory: React.FC<TMySelectExamCategoryProps> = (props) => {
  const { ...rest } = props;
  const { data = [], isLoading } = useExamCategory();

  const options = data.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <MySelect
      placeholder="Chọn danh mục câu hỏi"
      options={options}
      loading={isLoading}
      {...rest}
    />
  );
};

export default MySelectExamCategory;
