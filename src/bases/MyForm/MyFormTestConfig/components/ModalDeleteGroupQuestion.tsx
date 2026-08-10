import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import React, { Dispatch, SetStateAction, useState } from "react";

type TProps = {
  remove: () => void;
  children: ({
    setOpen,
  }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
};

const ModalDeleteGroupQuestion: React.FC<TProps> = ({ remove, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MyModalDelete
        onOk={remove}
        setOpen={setOpen}
        open={open}
        message="Bạn có muốn xoá danh sách câu hỏi này ?"
      />
      {children({ setOpen })}
    </>
  );
};

export default ModalDeleteGroupQuestion;
