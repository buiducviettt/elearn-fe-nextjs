"use client";

import MyFormTestConfig from "@/bases/MyForm/MyFormTestConfig";
import MyModal from "@/bases/MyModal";
import { questionnaireService } from "@/services/questionnaire";
import { TQuestionnaireGetResponse } from "@/types/service-get";
import { TQuestionnairePost } from "@/types/service-post";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { EXAM_SKILL } from "@/types/enum";
import { Modal } from "antd";

type TProps = {
    children: (params: {
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => React.ReactNode;
    data?: TQuestionnaireGetResponse["list"][0];
};

const ModalEditTestItem: React.FC<TProps> = (props) => {
    const { children, data } = props;
    const queryClient = useQueryClient();
    const [form] = useForm();
    const [open, setOpen] = useState(false);

    const prevSkillRef = useRef<any>(undefined);

    const update = useMutation({
        mutationFn: (value: TQuestionnairePost) =>
            questionnaireService.update(Number(data?.questionnaire_id), value),
        onSuccess: (response) => {
            setOpen(false);
            toastHandler.success(response?.payload?.message);
            queryClient.invalidateQueries({
                queryKey: [questionnaireService.keyGet],
            });
        },
        onError: (error: any) => {
            toastHandler.error(
                error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !"
            );
        },
    });

    useEffect(() => {
        if (open) {
            const {
                questionnaire_submit_count,
                questionnaire_private,
                questionnaire_private_code,
            } = data || {};
            form.setFieldsValue({
                ...data,
                questionnaire_category: data?.questionnaire_category?.id,
                questionnaire_skill:
                    (data as any)?.questionnaire_skill || EXAM_SKILL.reading,
                questionnaire_private: {
                    value: questionnaire_private,
                    password: questionnaire_private_code,
                },
                questionnaire_submit_count: Boolean(
                    parseInt(questionnaire_submit_count as string)
                )
                    ? Number(questionnaire_submit_count)
                    : null,
                questionnaire_file: data?.questionnaire_file || "",
            });
            // Gán giá trị skill ban đầu
            prevSkillRef.current =
                (data as any)?.questionnaire_skill || EXAM_SKILL.reading;
        }
    }, [form, data, open]);

    // Sử dụng onValuesChange thay cho subscribe
    const handleValuesChange = (changedValues, allValues) => {
        if (!open) return;
        if ("questionnaire_skill" in changedValues) {
            const currentSkill = changedValues.questionnaire_skill;
            const prevSkill = prevSkillRef.current;
            if (prevSkill !== undefined && currentSkill !== prevSkill) {
                const structures =
                    form.getFieldValue("questionnaire_structure") || [];
                // if (structures.length > 0) {
                //   Modal.confirm({
                //     title: "Đổi kỹ năng sẽ xóa toàn bộ nhóm bài tập hiện tại. Bạn có chắc muốn đổi?",
                //     okText: "Đồng ý",
                //     cancelText: "Hủy",
                //     centered: true,
                //     onOk: () => {
                //       form.setFieldValue("questionnaire_structure", []);
                //       prevSkillRef.current = currentSkill;
                //     },
                //     onCancel: () => {
                //       form.setFieldValue("questionnaire_skill", prevSkill);
                //     },
                //   });
                // } else {
                //   prevSkillRef.current = currentSkill;
                // }
                prevSkillRef.current = currentSkill;
            }
        }
    };

    const onFinish = (values) => {
        const dataSubmit: TQuestionnairePost = {
            ...values,
            questionnaire_private: values?.questionnaire_private?.value,
            questionnaire_private_code: values?.questionnaire_private?.password,
        };
        update.mutate(dataSubmit);
    };

    return (
        <>
            {children({ setOpen })}
            <MyModal
                confirmLoading={update.isPending}
                onOk={() => {
                    form.submit();
                }}
                width={"100%"}
                title={`Chỉnh sửa đề thi ${data?.questionnaire_title}`}
                open={open}
                setOpen={setOpen}
            >
                <MyFormTestConfig
                    onError={() => {
                        console.log("error");
                    }}
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={(errorInfo) => {
                        const fieldNames = errorInfo.errorFields.map(
                            (item) => item.name
                        );
                        const fielderrors = errorInfo.errorFields.map(
                            (item) => item.errors
                        );
                        toastHandler.error(`Form error`, {
                            description: (
                                <>
                                    {fieldNames.map((item, index) => {
                                        return (
                                            <p key={`${item}-${index}`}>
                                                {item}: {fielderrors[index]}
                                            </p>
                                        );
                                    })}
                                </>
                            ),
                        });
                    }}
                    onValuesChange={handleValuesChange}
                />
            </MyModal>
        </>
    );
};

export default ModalEditTestItem;
