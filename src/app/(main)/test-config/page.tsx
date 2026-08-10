"use client";

import MyButton from "@/bases/MyButton";
import MyFormTestConfig from "@/bases/MyForm/MyFormTestConfig";
import { questionnaireService } from "@/services/questionnaire";
import { TQuestionnairePost } from "@/types/service-post";
import toastHandler from "@/utils/toastHandler";
import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";

const TestConfigPage = () => {
  const [form] = Form.useForm();

  const create = useMutation({
    mutationFn: (data: TQuestionnairePost) => questionnaireService.post(data),
    onSuccess: (response) => {
      toastHandler.success(response?.payload?.message);
      form.resetFields();
    },
    onError: (error: any) => {
      toastHandler.error(error?.payload?.message);
    },
  });
  const onFinish = (values) => {
    const dataSubmit: TQuestionnairePost = {
      ...values,
      questionnaire_private: values?.questionnaire_private?.value,
      questionnaire_private_code: values?.questionnaire_private?.password,
    };
    create.mutate(dataSubmit);
  };

  return (
    <div className="flex flex-col gap-3">
      <MyFormTestConfig form={form} onFinish={onFinish} />
      <MyButton
        loading={create.isPending}
        className="self-end"
        onClick={form.submit}
        type="primary"
      >
        Tạo đề thi
      </MyButton>
    </div>
  );
};

export default TestConfigPage;
