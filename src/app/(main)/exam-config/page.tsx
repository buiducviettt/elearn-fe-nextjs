"use client";

import MyButton from "@/bases/MyButton";
import MyFormExamConfig, {
    initDataExamConfig,
    initDataExamConfigVisual,
} from "@/bases/MyForm/MyFormExamConfig";
import { questionService } from "@/services/question";
import { TQuestionPost } from "@/types/service-post";
import { getExamConfigConverterToServer } from "@/utils/common";
import toastHandler from "@/utils/toastHandler";
import { QUESTION_TYPES } from "@/types/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import QuestionList from "./QuestionList";
import styles from "./styles.module.scss";

const ExamConfigPage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [editorKey, setEditorKey] = useState(Date.now());

    const setInitDataForm = () => {
        form.setFieldsValue({
            ...initDataExamConfig,
            ...initDataExamConfigVisual,
        });
    };

    const create = useMutation({
        mutationFn: (data: TQuestionPost) => questionService.create(data),
        onSuccess: (response) => {
            if (response?.payload?.data?.question_id) {
                form.resetFields();
                setInitDataForm();
                queryClient.invalidateQueries({
                    queryKey: [questionService.keyGet],
                });
                toastHandler.success("Tạo câu hỏi thành công");
            } else {
                toastHandler.error(
                    "Không thể tạo câu hỏi, thiếu thông tin phản hồi"
                );
            }
        },
        onError: (error: any) => {
            console.error("Create question error:", error);
            toastHandler.error(
                error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !"
            );
        },
    });

    const onFinish = useMemo(
        () => (value) => {
            const { question_items = [], ...rest } = value;

            const newQuestionItems = question_items.map((question) => {
                const { type } = question;
                const converter = getExamConfigConverterToServer(type);
                if (converter) {
                    const convertedData = converter(question);
                    if (type === QUESTION_TYPES.drag) {
                        return convertedData;
                    }
                    return convertedData;
                }
                return question;
            });
            create.mutate({
                ...rest,
                question_items: newQuestionItems,
            });
        },
        [create]
    );

    useEffect(() => {
        setInitDataForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    return (
        <div className="flex flex-col gap-4">
            <MyFormExamConfig
                // key={editorKey}
                // editorKey={editorKey}
                onFinish={onFinish}
                form={form}
            />
            <MyButton
                loading={create.isPending}
                onClick={form.submit}
                type="primary"
                className="self-end"
            >
                Tạo câu hỏi
            </MyButton>
            {/* <div
                className={`flex flex-col gap-4 ${styles["list-question-related"]}`}
            >
                <p className="font-semibold text-lg">Danh sách câu hỏi</p>
                <QuestionList />
            </div> */}
        </div>
    );
};

export default ExamConfigPage;
