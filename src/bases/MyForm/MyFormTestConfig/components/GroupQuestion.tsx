import MyAnswerGroupCheckbox from "@/bases/MyAnserGroup/MyAnswerGroupCheckbox";
import MyAnswerGroupRadio from "@/bases/MyAnserGroup/MyAnswerGroupRadio";
import MyAnswerGroupText from "@/bases/MyAnserGroup/MyAnswerGroupText";
import MyButton from "@/bases/MyButton";
import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import MyFormItem from "@/bases/MyFormItem";
import arrayHandler from "@/utils/arrayHandler";
import { DeleteOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { FormListFieldData } from "antd/lib";
import { TMyFormProps } from "../..";
import { startPad } from "../utils";
import ModalDeleteGroupQuestion from "./ModalDeleteGroupQuestion";
import { QUESTIONPRAC_TYPES } from "@/types/enum";
import Answer from "./Answer";
import MyInput from "@/bases/MyInput";
import { formRequired } from "@/constants/common";
import { useMemo } from "react";

type TProps = {
  field: FormListFieldData;
  questionType: string;
};

// const Answer: React.FC<TProps> = ({ field, questionType }) => {
//   return (
//     <MyFormItem key={field.key} name={[field.name]}>
//       {questionType === QUESTIONPRAC_TYPES.multiple_choice && <MyAnswerGroupCheckbox />}
//       {questionType === QUESTIONPRAC_TYPES.single_choice && <MyAnswerGroupRadio />}
//       {questionType === QUESTIONPRAC_TYPES.fill_in_the_blank && <MyAnswerGroupText />}
//     </MyFormItem>
//   );
// };

type TGroupQuestionProps = {
  form: TMyFormProps["form"];
  field: FormListFieldData;
  remove: () => void;
};

// Hàm làm tròn điểm đến 0.5 gần nhất
const roundToHalf = (num: number): number => {
  return Math.round(num * 2) / 2;
};

const GroupQuestion: React.FC<TGroupQuestionProps> = ({ form, field, remove }) => {
  const { name: nameGroupQuestion, key, ...restFieldGroupQuestion } = field;
  
  // Gọi Form.useWatch trực tiếp trong component
  const groupItems = Form.useWatch(["questionnaire_structure", nameGroupQuestion], form) || {};

  const arrPoint = groupItems?.questions?.map((q) => q?.point || 0) || [];
  const totalPoint = roundToHalf(arrayHandler.sum(arrPoint));

  return (
    <MyCard>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <div className="border p-2 rounded-md">
              Tổng câu hỏi: [
              <span className="text-blue-600 font-medium">{startPad(arrPoint.length)}</span>
              ]
            </div>
            <div className="border p-2 rounded-md">
              Tổng điểm: [
              <span className="text-pink-600 font-medium">{startPad(totalPoint)}</span>
              ]
            </div>
          </div>
          <ModalDeleteGroupQuestion remove={remove}>
            {({ setOpen }) => (
              <MyButton icon={<DeleteOutlined />} danger onClick={() => setOpen(true)} title="Xoá">
              </MyButton>
            )}
          </ModalDeleteGroupQuestion>
        </div>
        <MyFormItem
          rules={[formRequired]}
          name={[nameGroupQuestion, "title"]} 
          label="Tên nhóm câu hỏi"
          style={{ marginBottom: 10 }}
        >
          <MyInput placeholder="Nhập tên nhóm câu hỏi" />
        </MyFormItem>
        <Form.List key={key} {...restFieldGroupQuestion} name={[nameGroupQuestion, "questions"]}>
          {(fields) => (
            <div className="flex flex-col gap-3">
              {fields.length === 0 && <MyEmpty />}
              {fields.map((field) => {
                const questionType = groupItems?.questions?.[field.name]?.type;
                return <Answer key={field.key} field={field} questionType={questionType} />;
              })}
            </div>
          )}
        </Form.List>
      </div>
    </MyCard>
  );
};

export default GroupQuestion;

