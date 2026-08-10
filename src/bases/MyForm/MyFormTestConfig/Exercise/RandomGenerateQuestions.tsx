import MyButton from "@/bases/MyButton";
import MyFormItem from "@/bases/MyFormItem";
import MyInputNumber from "@/bases/MyInputNumber";
import MySelectExamCategory from "@/bases/MySelect/MySelectExamCategory";
import MySelectExamLevel from "@/bases/MySelect/MySelectExamLevel";
import MySelectExamPart from "@/bases/MySelect/MySelectExamPart";
import MySelectExamSkill from "@/bases/MySelect/MySelectExamSkill";
import { questionService } from "@/services/question";
import { TQuestionGet } from "@/types/service-get";
import toastHandler from "@/utils/toastHandler";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import MyForm from "../..";
import styles from "../style.module.scss";
import { useState } from "react";
import { Button, Modal } from "antd";

const RandomGenerateQuestions = ({ onGenerate }) => {
    const [form] = useForm();
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const getRandomQuestion = useMutation({
        mutationFn: (data: TQuestionGet) => questionService.get(data),
        onSuccess: (response) => {
            const randomQuestions = response?.payload?.data?.list || [];
            if (randomQuestions?.length > 0) {
                form.resetFields();
            } else {
                toastHandler.warning("Không tìm thấy câu hỏi nào");
            }
        },
        onError: (error: any) => {
            toastHandler.success(error?.payload?.message);
        },
    });

    const showPreviewModal = (questions) => {
        setIsPreviewModalOpen(true);
    };

    const handlePreviewOk = () => {
        setIsPreviewModalOpen(false);
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalOpen(false);
    };

    return (
        <>
            <MyForm
                form={form}
                onFinish={(value) => {
                    const { per_page, level, category, part, skill, ...rest } =
                        value;
                    getRandomQuestion.mutate(
                        {
                            ...rest,
                            type: "single",
                            random: 1,
                            per_page,
                        },
                        {
                            onSuccess: (response) => {
                                const randomQuestions =
                                    response?.payload?.data?.list || [];
                                if (randomQuestions?.length > 0) {
                                    onGenerate(randomQuestions, value);
                                    form.resetFields();
                                } else {
                                    toastHandler.warning(
                                        "Không tìm thấy câu hỏi nào"
                                    );
                                }
                            },
                        }
                    );
                }}
            >
                <div
                    className={`grid grid-cols-6 gap-4 w-full ${styles["random-quest"]}`}
                >
                    <div
                        className={`col-span-1 ${styles["item-random-quest"]}`}
                    >
                        <MyFormItem
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn số câu",
                                },
                            ]}
                            style={{ marginBottom: 0 }}
                            className="flex-1 "
                            name="per_page"
                            label="Số câu"
                        >
                            <MyInputNumber
                                placeholder="Nhập số câu"
                                step={1}
                                min={1}
                                className="!w-full"
                            />
                        </MyFormItem>
                    </div>
                    <div
                        className={`col-span-1 ${styles["item-random-quest"]}`}
                    >
                        <MyFormItem
                            style={{ marginBottom: 0 }}
                            className="flex-1 "
                            name="level"
                            label="Độ khó"
                        >
                            <MySelectExamLevel className="!w-full" />
                        </MyFormItem>
                    </div>
                    <div
                        className={`col-span-1 ${styles["item-random-quest"]}`}
                    >
                        <MyFormItem
                            name="category"
                            style={{ marginBottom: 0 }}
                            className="flex-1"
                            label="Danh mục"
                        >
                            <MySelectExamCategory className="!w-full" />
                        </MyFormItem>
                    </div>
                    <div
                        className={`col-span-1 ${styles["item-random-quest"]}`}
                    >
                        <MyFormItem
                            style={{ marginBottom: 0 }}
                            name="part"
                            className="flex-1 "
                            label="Phần"
                        >
                            <MySelectExamPart className="!w-full" />
                        </MyFormItem>
                    </div>
                    <div
                        className={`col-span-1 ${styles["item-random-quest"]}`}
                    >
                        <MyFormItem
                            style={{ marginBottom: 0 }}
                            className="flex-1"
                            label="Kỹ năng"
                            name="skill"
                        >
                            <MySelectExamSkill className="!w-full" />
                        </MyFormItem>
                    </div>
                    <div
                        className={`col-span-1 flex flex-col items-end ${styles["item-random-quest"]}`}
                    >
                        <MyButton
                            className="w-full mt-auto"
                            loading={getRandomQuestion.isPending}
                            onClick={() => {
                                form.submit();
                            }}
                            type="primary"
                        >
                            Thêm bộ câu hỏi
                        </MyButton>
                    </div>
                </div>
            </MyForm>
        </>
    );
};

export default RandomGenerateQuestions;
