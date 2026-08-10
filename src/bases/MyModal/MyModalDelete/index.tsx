import MyButton from "@/bases/MyButton";
import { Dispatch, SetStateAction } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import MyModal, { TMyModalProps } from "..";

type TMyModalDeleteProps = {
  message?: React.ReactNode;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & Omit<TMyModalProps, "okButtonProps" | "okType" | "footer">;

const MyModalDelete: React.FC<TMyModalDeleteProps> = (props) => {
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
          <div className="bg-red-50 p-3 rounded-full">
            <BsFillTrash3Fill className="text-red-600" size="18" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-800 text-lg">
              Vui lòng xác nhận xoá
            </p>
            <p className="text-gray-500 text-text-sm">
              {message ||
                "	*Lưu ý mọi thao tác xoá bỏ đều không thể hoàn tác hay tìm kiếm trên toàn bộ dữ liêu trên hệ thống"}
            </p>
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

export default MyModalDelete;
