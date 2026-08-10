import MyFormQuestionSkill from "@/bases/MyForm/MyFormQuestionSkill";
import MyModal from "@/bases/MyModal";
import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import { TTaxonomyPost } from "@/types/service-post";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useState } from "react";

type TProps = {
  children: (params: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
};
const ModalCreate: React.FC<TProps> = ({ children }) => {
  const [form] = useForm();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const create = useMutation({
    mutationFn: (data: TTaxonomyPost) => taxonomyService.post(data),
    onSuccess: (response) => {
      setOpen(false);
      toastHandler.success(response?.payload?.message);
      queryClient.invalidateQueries({
        queryKey: [
          taxonomyService.keyGet,
          QUESTION_CATEGORIES.question_category,
        ],
      });
      form.resetFields();
    },
    onError: (error: any) => {
      toastHandler.error(error?.payload?.message);
    },
  });

  return (
    <>
      {children({ setOpen })}
      <MyModal
        onCancel={() => {
          setOpen(false);
        }}
        confirmLoading={create.isPending}
        open={open}
        onOk={form.submit}
        title="Tạo mới danh mục câu hỏi"
      >
        <MyFormQuestionSkill
          form={form}
          initialValues={{
            taxonomy: QUESTION_CATEGORIES.question_category,
          }}
          onFinish={(values) => create.mutate(values)}
        />
      </MyModal>
    </>
  );
};

export default ModalCreate;
