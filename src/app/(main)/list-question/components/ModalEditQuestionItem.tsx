"use client";

import MyFormExamConfig from "@/bases/MyForm/MyFormExamConfig";
import { Drawer } from "antd";
import { questionService } from "@/services/question";
import { TQuestionGetResponse } from "@/types/response";
import { TQuestionPost } from "@/types/service-post";
import {
    getExamConfigConverterToClient,
    getExamConfigConverterToServer,
} from "@/utils/common";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useCallback,
    useState,
} from "react";
import MyButton from "@/bases/MyButton";

type TProps = {
    children: (params: {
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => React.ReactNode;
    question?: TQuestionGetResponse["list"][0];
};

const ModalEditQuestionItem: React.FC<TProps> = (props) => {
    const { children, question } = props;
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [isFormReady, setIsFormReady] = useState(false);
    const [editorKey, setEditorKey] = useState(Date.now());

    const update = useMutation({
        mutationFn: async (data: TQuestionPost) => {
            try {
                if (!question?.question_id) {
                    throw new Error("Question ID is required");
                }
                return await questionService.update(
                    Number(question.question_id),
                    data,
                );
            } catch (error: any) {
                console.error("Update question error:", error);
                throw error;
            }
        },
        onSuccess: (response) => {
            setOpen(false);
            toastHandler.success(
                response?.payload?.message || "Cập nhật thành công",
            );
            queryClient.invalidateQueries({
                queryKey: [questionService.keyGet],
            });
        },
        onError: (error: any) => {
            const errorMessage =
                error?.payload?.message ||
                error?.message ||
                "Có lỗi xảy ra, vui lòng thử lại !";
            toastHandler.error(errorMessage);
        },
    });

    // Reset form when drawer closes
    useEffect(() => {
        if (!open) {
            console.log("[Drawer] Closed - Reset form & isFormReady");
            form.resetFields();
            setIsFormReady(false);
        }
    }, [open, form]);
    useEffect(() => {
        if (open) {
            console.log("[Drawer] Opened - Set new editorKey", Date.now());
            setEditorKey(Date.now());
        }
    }, [open]);
    // Initialize form data when drawer opens
    useEffect(() => {
        // console.log("[Drawer] useEffect open/question", { open, question });
        if (!open || !question) return;

        setIsFormReady(false);

        try {
            const {
                question_items = [],
                question_skill,
                question_level,
                question_part,
                question_category,
            } = question;

            const newQuestionItems = question_items
                .map((ques) => {
                    if (!ques?.type) return ques;

                    const { type, id } = ques;
                    const converter = getExamConfigConverterToClient(type);

                    if (!converter) return ques;

                    try {
                        return {
                            type,
                            id,
                            ...converter(ques),
                        };
                    } catch (error) {
                        console.error(
                            `Error converting question item ${id}:`,
                            error,
                        );
                        return ques;
                    }
                })
                .filter(Boolean);

            form.setFieldsValue({
                ...question,
                question_skill: question_skill?.id,
                question_level: question_level?.id,
                question_part: question_part?.id,
                question_category: question_category?.id,
                question_items: newQuestionItems,
            });

            setIsFormReady(true);
        } catch (error) {
            console.error("Error setting form values:", error);
            toastHandler.error("Có lỗi khi tải dữ liệu câu hỏi");
            setIsFormReady(true);
        }
    }, [open, question, form]);

    const onFinish = useCallback(
        (values) => {
            try {
                const { question_items = [] } = values;

                const newQuestionItems = question_items
                    .map((question) => {
                        if (!question?.type) return question;

                        const { type, id } = question;
                        const converter = getExamConfigConverterToServer(type);

                        if (!converter) return question;

                        try {
                            return {
                                id: id,
                                ...converter(question),
                            };
                        } catch (error) {
                            console.error(
                                `Error converting question item ${id}:`,
                                error,
                            );
                            throw new Error(`Lỗi xử lý dữ liệu câu hỏi ${id}`);
                        }
                    })
                    .filter(Boolean);

                update.mutate({
                    ...values,
                    question_items: newQuestionItems,
                });
            } catch (error: any) {
                toastHandler.error(
                    error.message || "Có lỗi xảy ra khi xử lý dữ liệu",
                );
            }
        },
        [update],
    );

    return (
        <>
            {children({ setOpen })}
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                width="100vw"
                forceRender
                title={`Chỉnh sửa câu hỏi ${question?.question_title}`}
                footer={
                    <div className="flex gap-4 justify-end">
                        <MyButton
                            type="default"
                            onClick={() => setOpen(false)}
                            disabled={update.isPending}
                        >
                            Hủy
                        </MyButton>

                        <MyButton
                            type="primary"
                            onClick={() => form.submit()}
                            loading={update.isPending}
                        >
                            Đồng ý
                        </MyButton>
                    </div>
                }
            >
                {isFormReady ? (
                    <MyFormExamConfig
                        key={editorKey}
                        editorKey={editorKey}
                        onFinish={onFinish}
                        form={form}
                        isIelts={true}
                    />
                ) : (
                    <div className="flex justify-center items-center h-[200px]">
                        <span>Đang tải...</span>
                    </div>
                )}
            </Drawer>
        </>
    );
};

export default ModalEditQuestionItem;
