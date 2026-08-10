import MyEmpty from "@/bases/MyEmpty";
import MyItemQuestionGroup from "@/bases/MyItemQuestionGroup";
import MyModal from "@/bases/MyModal";
import MyRawButton from "@/bases/MyRawButton";
import { EXAM_STRUCTURE } from "@/types/enum";
import { TQuestionGetResponse } from "@/types/response";
import { Dispatch, SetStateAction, useState } from "react";

export type TModalSelectedQuestionProps = {
  children: (params: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
  onConfirm?: (data: TQuestionGetResponse["list"]) => void;
  confirmLoading?: boolean;
  selectedQuestion: TQuestionGetResponse["list"][0][];
  setSelectedQuestion: Dispatch<
    SetStateAction<TQuestionGetResponse["list"][0][]>
  >;
  removeSelectedQuestion: (question: TQuestionGetResponse["list"][0]) => void;
  addSelectedQuestion: (question: TQuestionGetResponse["list"][0]) => void;
};

const ModalSelectedQuestion: React.FC<TModalSelectedQuestionProps> = (
  props,
) => {
  const {
    children,
    setSelectedQuestion,
    selectedQuestion = [],
    onConfirm,
    confirmLoading = false,
    removeSelectedQuestion,
    addSelectedQuestion,
  } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {children({ setOpen })}
      <MyModal
        width={880}
        okText="Tạo"
        okButtonProps={{
          className: "!px-8",
        }}
        onOk={() => {
          onConfirm?.(selectedQuestion);
          setSelectedQuestion([]);
          setOpen(false);
        }}
        confirmLoading={confirmLoading}
        cancelText="Đóng"
        title="Câu hỏi đã chọn"
        open={open}
        setOpen={setOpen}
      >
        <div className="flex my-4 flex-col gap-3">
          {selectedQuestion.map((item) => {
            const {
              question_id,
              question_title,
              question_items = [],
            } = item || {};
            const checked = selectedQuestion
              .map((item) => item.question_id)
              .includes(question_id);

            return (
              <MyRawButton
                onClick={() => {
                  if (checked) {
                    removeSelectedQuestion(item);
                  } else {
                    addSelectedQuestion(item);
                  }
                }}
                key={question_id}
              >
                <MyItemQuestionGroup
                  checked={checked}
                  tagQuestion={{
                    amount: question_items.length,
                    type: EXAM_STRUCTURE.group,
                  }}
                  label={question_title}
                />
              </MyRawButton>
            );
          })}
          {selectedQuestion.length === 0 && <MyEmpty />}
        </div>
      </MyModal>
    </>
  );
};

export default ModalSelectedQuestion;
