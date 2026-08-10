import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectRdomStructure from "@/bases/MyGroupSelect/MyGroupSelectRdomStructure";
import { useWatch } from "antd/es/form/Form";

const QuestionRandomFormItemJoin = ({ form }) => {
  // Watch the 'question_items' field in the form
  const questions = useWatch(["question_items"], form);
  // Check if there are already configured questions
  const alreadyConfigQuestion = Boolean(questions?.length > 0);

  return (
    <>
      <MyFormItem name="question_random" label="Loại câu hỏi ngẫu nhiên">
        <MyGroupSelectRdomStructure />
      </MyFormItem>
    </>
  );
};

export default QuestionRandomFormItemJoin;