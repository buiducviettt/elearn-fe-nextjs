import arrayHandler from "@/utils/arrayHandler";
import { useWatch } from "antd/es/form/Form";
import { TMyFormProps } from "../..";
import { startPad } from "../utils";
import { useMemo } from "react";
type TProps = { form: TMyFormProps["form"] };
const OverallTest: React.FC<TProps> = ({ form }) => {
  const groupQuestion: any[] = useWatch(["questionnaire_structure"], form) || [];

// Lấy toàn bộ câu hỏi từ tất cả nhóm
const allQuestions = groupQuestion.flatMap((group) => group?.questions || []);
const totalPoint = useMemo(() => arrayHandler.sum(allQuestions.map((q) => q.point || 0)), [allQuestions]);
const totalQuestion = useMemo(() => allQuestions.length, [allQuestions]);


  return (
    <div className="flex gap-2">
      <div className="border flex-1 text-center py-2  bg-white rounded-md p-1">
        Tổng câu hỏi đề: [
        <span className="text-blue-600 font-medium">
          {startPad(totalQuestion)}
        </span>
        ]
      </div>
      <div className="border flex-1 text-center py-2 bg-white rounded-md p-1">
        Tổng điểm: [
        <span className="text-pink-600 font-medium">
          {startPad(totalPoint)}
        </span>
        ]
      </div>
    </div>
  );
};

export default OverallTest;
