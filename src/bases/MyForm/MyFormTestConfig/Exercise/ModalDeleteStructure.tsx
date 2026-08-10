import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import { useState } from "react";

const ModalDeleteStructure = ({ children, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children({ setOpen })}
      <MyModalDelete
        onOk={onDelete}
        open={open}
        setOpen={setOpen}
        message={` Bạn có chắc chắn xóa phần ?`}
      ></MyModalDelete>
    </>
  );
};

export default ModalDeleteStructure;
