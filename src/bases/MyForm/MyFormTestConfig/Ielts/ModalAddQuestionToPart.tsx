import MyModal from "@/bases/MyModal";
import MyTableSelectQuestion from "@/bases/MyTableSelectQuestion";
import { useState } from "react";

interface ModalAddQuestionToPartProps {
  addQuestionToStructure: (questionIds: string[]) => void;
  existingQuestionIds?: string[];
  children: ({ setOpen }: { setOpen: (open: boolean) => void }) => React.ReactNode;
}

const ModalAddQuestionToPart: React.FC<ModalAddQuestionToPartProps> = ({ 
  addQuestionToStructure, 
    existingQuestionIds = [],
    children 
  }) => {
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
          existingQuestionIds={existingQuestionIds} 
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
