"use client";
import React from "react";
import { useForm } from "antd/es/form/Form";
import MyFormLesson from "@/bases/MyForm/MyFormLesson";
import { TCourseItemLessonPost } from "@/types/service-post";
import { courseLessonService } from "@/services/courseLesson";
import toastHandler from "@/utils/toastHandler";
import { useRouter } from "next/navigation";
import MyButton from "@/bases/MyButton";
import { create } from "domain";
import { useMutation } from "@tanstack/react-query";

const LessonCreateContent: React.FC = () => {
    const [form] = useForm();
    const router = useRouter();
    const create = useMutation({
        mutationFn: (data: TCourseItemLessonPost) =>
            courseLessonService.post(data),
        onSuccess: (response) => {
            toastHandler.success(response?.payload?.message);
            form.resetFields();
        },
        onError: (error: any) => {
            toastHandler.error(error?.payload?.message);
        },
    });

    const onFinish = (values: any) => {
        const payload: TCourseItemLessonPost = {
            // Ensure required fields exist; backend expects `type`
            type: values.type ?? "video",
            ...values,
        } as TCourseItemLessonPost;

        create.mutate(payload);
    };

    return (
        <div className="w-full flex flex-col gap-3">
            <MyFormLesson form={form} onFinish={onFinish} />
            <div className="w-full sticky bottom-0 p-2 z-10 flex justify-end bg-white">
                <MyButton
                    loading={create.isPending}
                    className="self-end"
                    onClick={form.submit}
                    type="primary"
                >
                    Tạo bài học
                </MyButton>
            </div>
        </div>
    );
};

export default LessonCreateContent;
