"use client";

import MyFormLesson from "@/bases/MyForm/MyFormLesson";
import MyModal from "@/bases/MyModal";
import { courseLessonService } from "@/services/courseLesson";
import { TCourseItemLesson } from "@/types/service-get";
import { TCourseItemLessonPost } from "@/types/service-post";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type TProps = {
    children: (params: {
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => React.ReactNode;
    data?: TCourseItemLesson;
};

const ModalCreateNewLessonItem: React.FC<TProps> = ({ children, data }) => {
    const queryClient = useQueryClient();
    const [form] = useForm();
    const [open, setOpen] = useState(false);

    const update = useMutation({
        mutationFn: (value: TCourseItemLessonPost) =>
            courseLessonService.update(Number(data?.id), value),
        onSuccess: (response) => {
            setOpen(false);
            toastHandler.success(response?.payload?.message);
            queryClient.invalidateQueries({
                queryKey: [courseLessonService.keyGet],
            });
        },
        onError: (error: any) => {
            toastHandler.error(
                error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !",
            );
        },
    });

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                course_id: data?.course_id || "",
                title: data?.title || "",
                description: data?.description || "",
                duration: data?.duration || "",
                level: data?.level ?? undefined,
                video: data?.video || "",
                video_type: data?.video_type || "",
                product_filters: data?.product_filters || [],
            });
        } else {
            form.resetFields();
        }
    }, [form, data, open]);

    const onFinish = (values: any) => {
        const dataSubmit: TCourseItemLessonPost = {
            id: data?.id ?? "",
            ...values,
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
                title={`Tạo mới bài học`}
                open={open}
                setOpen={setOpen}
            >
                <MyFormLesson form={form} onFinish={onFinish} />
            </MyModal>
        </>
    );
};

export default ModalCreateNewLessonItem;
