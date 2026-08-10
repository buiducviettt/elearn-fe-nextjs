import MyModal from "@/bases/MyModal";
import MyTableSelectQuestion from "@/bases/MyTableSelectQuestion";
import { useState } from "react";

const ModalAddQuestionToPart = ({ addQuestionToStructure, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children({ setOpen })}
      <MyModal
        footer={false}
        title={`Thêm mới câu hỏi`}
        width={1080}
        open={open}
        setOpen={setOpen}
      >
        <MyTableSelectQuestion
          onConfirm={(data) => {
            addQuestionToStructure(data.map((item: any) => item.question_id));
            setOpen(false);
          }}
        />
      </MyModal>
    </>
  );
};

export default ModalAddQuestionToPart;
