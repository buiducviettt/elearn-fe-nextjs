// import { FormListFieldData, Select } from "antd";
// import MyFormItem from "@/bases/MyFormItem";
// import MyAnswerGroupCheckbox from "@/bases/MyAnserGroup/MyAnswerGroupCheckbox";
// import MyAnswerGroupRadio from "@/bases/MyAnserGroup/MyAnswerGroupRadio";
// import MyAnswerGroupText from "@/bases/MyAnserGroup/MyAnswerGroupText";
// import { QUESTIONPRAC_TYPES } from "@/types/enum";

// type TProps = {
//   key: number;
//   field: FormListFieldData;
//   questionType: any;
//   onChangeQuestionType?: (type: any) => void; // ✅ Thêm dấu `?` để thành tùy chọn
// };

// const Answer: React.FC<TProps> = ({ field, questionType, onChangeQuestionType }) => {
//   return (
//     <div className="flex flex-col gap-4">
//       <MyFormItem name={[field.name, "type"]} label="Chọn loại đáp án" style={{ marginBottom: 0 }}>
//         <Select
//           value={questionType}
//           onChange={onChangeQuestionType}
//           options={[
//             { value: QUESTIONPRAC_TYPES.multiple_choice, label: "Chọn nhiều đáp án" },
//             { value: QUESTIONPRAC_TYPES.single_choice, label: "Chọn một đáp án" },
//             { value: QUESTIONPRAC_TYPES.fill_in_the_blank, label: "Điền vào chỗ trống" },
//           ]}
//         />
//       </MyFormItem>
//       <MyFormItem name={[field.name]} style={{ marginBottom: 0 }}>
//         {questionType === QUESTIONPRAC_TYPES.multiple_choice && <MyAnswerGroupCheckbox />}
//         {questionType === QUESTIONPRAC_TYPES.single_choice && <MyAnswerGroupRadio />}
//         {questionType === QUESTIONPRAC_TYPES.fill_in_the_blank && <MyAnswerGroupText />}
//       </MyFormItem>
//     </div>
//   );
// };

// export default Answer;


import MyFormItem from "@/bases/MyFormItem";
import MyAnswerGroupCheckbox from "@/bases/MyAnserGroup/MyAnswerGroupCheckbox";
import MyAnswerGroupText from "@/bases/MyAnserGroup/MyAnswerGroupText";
import { QUESTIONPRAC_TYPES } from "@/types/enum";
import MyAnswerGroupRadioV2 from "@/bases/MyAnserGroup/MyAnswerGroupRadioV2";

type TProps = {
  field: any;
  questionType: QUESTIONPRAC_TYPES;
};

const Answer: React.FC<TProps> = ({ field, questionType }) => {
  return (
    <MyFormItem name={[field.name]} style={{ marginBottom: 0 }}>
      {questionType === QUESTIONPRAC_TYPES.multiple_choice && <MyAnswerGroupCheckbox />}
      {questionType === QUESTIONPRAC_TYPES.single_choice && <MyAnswerGroupRadioV2 />}
      {questionType === QUESTIONPRAC_TYPES.fill_in_the_blank && <MyAnswerGroupText />}
    </MyFormItem>
  );
};

export default Answer;
