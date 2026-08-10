import MyButton from "@/bases/MyButton";
import { questionService } from "@/services/question";
import { TQuestionPost } from "@/types/service-post";
import { getExamConfigConverterToServer } from "@/utils/common";
import toastHandler from "@/utils/toastHandler";
import { QUESTION_TYPES, QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import { useEffect, useMemo } from "react";
import MyFormExamConfig, { initDataExamConfig } from "../../MyFormExamConfig";

const CreateNew = ({ onGenerate }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const setInitDataForm = () => {
    form.setFieldsValue({
      ...initDataExamConfig,
    });
  };

  const create = useMutation({
    mutationFn: (data: TQuestionPost) => questionService.create(data),
    onSuccess: (response) => {
      console.log(response); // Kiểm tra phản hồi từ API
      const questionId = response?.payload?.data?.question_id;
      if (questionId) {
        onGenerate(questionId);
        form.resetFields();
        setInitDataForm();
        queryClient.invalidateQueries({
          queryKey: [questionService.keyGet],
        });
      } else {
        toastHandler.error("Không thể tạo câu hỏi, question_id bị undefined");
      }
    },
    onError: (error: any) => {
      toastHandler.error(
        error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !",
      );
    },
  });

  const onFinish = useMemo(
    () => (value) => {
      const { question_items = [] } = value;
      const newQuestionItems = question_items.map((question) => {
        const { type } = question;
        const converter = getExamConfigConverterToServer(type);
        if (converter) {
          const convertedData = converter(question);
          return {
            ...convertedData,
            multiple: question.multiple || QUESTION_MULTIPLE_TYPE.disable
          };
        }
        return question;
      });

      create.mutate({
        ...value,
        question_items: newQuestionItems,
      });
    },
    [create],
  );

  useEffect(() => {
    setInitDataForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div className="flex flex-col gap-4">
      <MyFormExamConfig onFinish={onFinish} form={form} />
      <MyButton
        loading={create.isPending}
        onClick={form.submit}
        type="primary"
        className="self-end"
      >
        Tạo câu hỏi
      </MyButton>
    </div>
  );
};

export default CreateNew;