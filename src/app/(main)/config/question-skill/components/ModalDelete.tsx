import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
type TProps = {
  children: (params: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
  name: string;
  id: number;
};
const ModalDelete: React.FC<TProps> = ({ children, id, name }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const _delete = useMutation({
    mutationFn: (id: number) => taxonomyService.delete(id),
    onSuccess: (response: any) => {
      setOpen(false);
      toastHandler.success(response?.payload?.message);
      queryClient.invalidateQueries({
        queryKey: [taxonomyService.keyGet, QUESTION_CATEGORIES.question_skill],
      });
    },
    onError: (error: any) => {
      toastHandler.error(error?.payload?.message);
    },
  });

  return (
    <>
      {children({ setOpen })}
      <MyModalDelete
        setOpen={setOpen}
        confirmLoading={_delete.isPending}
        message={`Bạn có muốn xoá ${name}`}
        onOk={() => _delete.mutate(id)}
        open={open}
      />
    </>
  );
};

export default ModalDelete;
