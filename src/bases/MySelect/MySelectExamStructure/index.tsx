import { OBJECT_EXAM_STRUCTURE } from "@/types/common";
import MySelect, { TMySelectProps } from "..";
type TMySelectExamStructureProps = {} & TMySelectProps;
const MySelectExamStructure: React.FC<TMySelectExamStructureProps> = (
  props,
) => {
  const { ...rest } = props;

  const options = Object.values(OBJECT_EXAM_STRUCTURE).map((item) => {
    return {
      label: item.label,
      value: String(item.value),
    };
  });

  return (
    <MySelect placeholder="Chọn loại câu hỏi" options={options} {...rest} />
  );
};

export default MySelectExamStructure;
