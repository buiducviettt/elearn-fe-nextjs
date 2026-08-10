import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import { questionnaireService } from "@/services/questionnaire";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ModalDeleteQuestionItem = ({ children, id, title }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const _delete = useMutation({
    mutationFn: (id: number) => questionnaireService.delete(id),
    onSuccess: (response) => {
      setOpen(false);
      toastHandler.success(response?.payload?.message);
      queryClient.invalidateQueries({
        queryKey: [questionnaireService.keyGet],
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
        open={open}
        setOpen={setOpen}
        message={`Bạn có muốn xoá đề thi ${title} ?`}
        onOk={() => _delete.mutate(id)}
        confirmLoading={_delete.isPending}
      />
    </>
  );
};

export default ModalDeleteQuestionItem;
