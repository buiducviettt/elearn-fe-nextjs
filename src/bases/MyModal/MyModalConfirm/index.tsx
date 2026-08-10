import MyButton from "@/bases/MyButton";
import { Dispatch, SetStateAction } from "react";
import { LuMessageSquareWarning } from "react-icons/lu";
import MyModal, { TMyModalProps } from "..";

type TMyModalConfirmProps = {
  message: React.ReactNode;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & Omit<TMyModalProps, "okButtonProps" | "okType" | "footer" | "title">;

const MyModalConfirm: React.FC<TMyModalConfirmProps> = (props) => {
  const { message, setOpen, okText, onOk, confirmLoading, ...rest } = props;
  return (
    <MyModal
      width={470}
      footer={null}
      onCancel={() => setOpen(false)}
      {...rest}
    >
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-start">
          <div className="bg-orange-50 p-3 rounded-full">
            <LuMessageSquareWarning size={22} className="text-orange-600" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-800 text-lg">
              Vui lòng xác nhận
            </p>
            <p className="text-gray-500 text-text-sm">{message}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <MyButton onClick={onOk} loading={confirmLoading} type="primary">
            {okText || "Xác nhận"}
          </MyButton>
        </div>
      </div>
    </MyModal>
  );
};

export default MyModalConfirm;
