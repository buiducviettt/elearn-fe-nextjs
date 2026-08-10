import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import { useState } from "react";

const ModalDeleteQuestionItem = ({ children, title, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children({ setOpen })}
      <MyModalDelete
        onOk={onDelete}
        open={open}
        setOpen={setOpen}
        message={`Bạn có chắc chắn xóa phần câu hỏi ${title} ?`}
      ></MyModalDelete>
    </>
  );
};

export default ModalDeleteQuestionItem;
