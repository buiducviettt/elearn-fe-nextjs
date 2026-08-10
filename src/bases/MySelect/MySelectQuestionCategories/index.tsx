import { OBJECT_QUESTION_CATEGORIES } from "@/types/common";
import MySelect, { TMySelectProps } from "..";
type TMySelectQuestionCategoriesProps = {} & TMySelectProps;
const MySelectQuestionCategories: React.FC<TMySelectQuestionCategoriesProps> = (
  props,
) => {
  const { ...rest } = props;

  const options = Object.values(OBJECT_QUESTION_CATEGORIES).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return (
    <MySelect placeholder="Chọn dạng câu hỏi" options={options} {...rest} />
  );
};

export default MySelectQuestionCategories;
