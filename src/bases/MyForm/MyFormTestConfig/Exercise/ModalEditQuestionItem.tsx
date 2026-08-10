"use client";

import MyFormExamConfig from "@/bases/MyForm/MyFormExamConfig";
import MyModal from "@/bases/MyModal";
import { QUESTION_TYPES, QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import { questionService } from "@/services/question";
import { TQuestionGetResponse } from "@/types/response";
import { TQuestionPost } from "@/types/service-post";
import {
  getExamConfigConverterToClient,
  getExamConfigConverterToServer,
} from "@/utils/common";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

type TProps = {
  children: (params: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
  question?: TQuestionGetResponse["list"][0];
};

const ModalEditQuestionItem: React.FC<TProps> = (props) => {
  const { children, question } = props;
  const queryClient = useQueryClient();
  const [form] = useForm();
  const [open, setOpen] = useState(false);

  const update = useMutation({
    mutationFn: (data: TQuestionPost) =>
      questionService.update(Number(question?.question_id), data),
    onSuccess: (response) => {
      setOpen(false);
      toastHandler.success(response?.payload?.message);
      queryClient.invalidateQueries({
        queryKey: [questionService.keyGet],
      });
    },
    onError: (error: any) => {
      toastHandler.error(
        error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !",
      );
    },
  });

  useEffect(() => {
    const {
      question_items = [],
      question_skill,
      question_level,
      question_part,
      question_category,
    } = question || {};
    const newQuestionItems = question_items.map((ques) => {
      const { type, id } = ques;
      const converter = getExamConfigConverterToClient(type);
      if (converter) {
        return {
          type,
          id,
          ...converter(ques),
        };
      }
      return ques;
    });

    if (open) {
      form.setFieldsValue({
        ...question,
        question_skill: question_skill?.id,
        question_level: question_level?.id,
        question_part: question_part?.id,
        question_category: question_category?.id,
        question_items: newQuestionItems,
      });
    }
  }, [form, open, question]);

  const onFinish = useMemo(
    () => (value) => {
      const { question_items = [] } = value;

      const newQuestionItems = question_items.map((question) => {
        const { type, id } = question;
        const converter = getExamConfigConverterToServer(type);
        if (converter) {
          const convertedData = converter(question);
          return {
            id: id,
            ...convertedData,
            multiple: question.multiple || QUESTION_MULTIPLE_TYPE.disable
          };
        }
        return question;
      });

      update.mutate({
        ...value,
        question_items: newQuestionItems,
      });
    },
    [update],
  );

  return (
    <>
      {children({ setOpen })}
      <MyModal
        confirmLoading={update.isPending}
        onOk={form.submit}
        width={"100%"}
        title={`Chỉnh sửa câu hỏi ${question?.question_title}`}
        open={open}
        setOpen={setOpen}
      >
        <MyFormExamConfig onFinish={onFinish} form={form} />
      </MyModal>
    </>
  );
};

export default ModalEditQuestionItem;
