import MyFormQuestionSkill from "@/bases/MyForm/MyFormQuestionSkill";
import MyModal from "@/bases/MyModal";
import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import { TTaxonomyResponseGet } from "@/types/response";
import { TTaxonomyPut } from "@/types/service-put";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type TProps = {
  item: TTaxonomyResponseGet["data"]["list"][0];
  children: (params: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
};
const ModalEdit: React.FC<TProps> = ({ children, item }) => {
  const [form] = useForm();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const update = useMutation({
    mutationFn: (data: TTaxonomyPut) =>
      taxonomyService.put(Number(item.id), data),
    onSuccess: (response: any) => {
      setOpen(false);
      toastHandler.success(response?.payload?.message);
      queryClient.invalidateQueries({
        queryKey: [taxonomyService.keyGet, QUESTION_CATEGORIES.question_level],
      });
      form.resetFields();
    },
    onError: (error: any) => {
      toastHandler.error(error?.payload?.message);
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        taxonomy: item.taxonomy,
        taxonomy_name: item.name,
        taxonomy_description: item.description,
      });
    }
  }, [open, form, item.id, item.name, item.description, item.taxonomy]);

  return (
    <>
      {children({ setOpen })}
      <MyModal
        onCancel={() => {
          setOpen(false);
        }}
        confirmLoading={update.isPending}
        open={open}
        onOk={form.submit}
        title={`Chỉnh sửa độ khó ${item.name}`}
      >
        <MyFormQuestionSkill
          initialValues={{
            taxonomy: QUESTION_CATEGORIES.question_level,
          }}
          form={form}
          onFinish={(values) => update.mutate(values)}
        />
      </MyModal>
    </>
  );
};

export default ModalEdit;
