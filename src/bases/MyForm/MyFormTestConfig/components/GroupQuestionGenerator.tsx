import MyButton from "@/bases/MyButton";
import MyFormItem from "@/bases/MyFormItem";
import MyInput from "@/bases/MyInput";
import numberHandler from "@/utils/numberHandler";
import { useState } from "react";
import { QUESTIONPRAC_TYPES } from "@/types/enum";
import { TMyFormProps } from "../..";

type TProps = {
  form: TMyFormProps["form"];
};

const GroupQuestionGenerator: React.FC<TProps> = ({ form }) => {
  const [numberQuestion, setNumberQuestion] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);

  const resetState = () => {
    setNumberQuestion(0);
    setTotalPoint(0);
  };

  const addGroupQuestion = () => {
    const pointPerQuestion = numberHandler.limitDigit(totalPoint / numberQuestion);
    const groupQuestion = form?.getFieldValue("questionnaire_structure") || [];

    // ✅ Xác định `type` dựa trên component con
    const questionType = form?.getFieldValue("question_type") || QUESTIONPRAC_TYPES.fill_in_the_blank;

    const generatedQuestions = Array.from({ length: numberQuestion }, (_, index) => ({
      order: index + 1,
      type: questionType, // ✅ Đảm bảo type được truyền đúng
      point: pointPerQuestion,
      answer: [],
    }));

    form?.setFieldValue("questionnaire_structure", [
      ...groupQuestion,
      {
        questions: generatedQuestions,
      },
    ]);

    resetState();
  };

  return (
    <div className="flex gap-3 items-end">
      <MyFormItem style={{ marginBottom: 0 }} label="Số câu hỏi">
        <MyInput
          step={1}
          value={numberQuestion}
          onChange={(event) => {
            setNumberQuestion(Number(event.target.value));
          }}
          type="number"
          min={0}
          placeholder="Nhập số câu"
        />
      </MyFormItem>
      <MyFormItem style={{ marginBottom: 0 }} label="Tổng điểm">
        <MyInput
          step={1}
          value={totalPoint}
          onChange={(event) => {
            setTotalPoint(Number(event.target.value));
          }}
          type="number"
          min={0}
          placeholder="Nhập tổng điểm"
        />
      </MyFormItem>
      <MyButton
        disabled={!Boolean(numberQuestion && totalPoint)}
        onClick={addGroupQuestion}
        type="primary"
      >
        Thêm câu hỏi
      </MyButton>
    </div>
  );
};

export default GroupQuestionGenerator;
