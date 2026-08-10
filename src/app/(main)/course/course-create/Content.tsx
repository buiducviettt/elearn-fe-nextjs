"use client";
import React from "react";
import MyCard from "@/bases/MyCard";
import MyEditor from "@/bases/MyEditor";
import MyFormItem from "@/bases/MyFormItem";
import MyInput from "@/bases/MyInput";
import MyForm from "@/bases/MyForm";
import { TCoursePost } from "@/types/service-post";
import { courseService } from "@/services/course";
import toastHandler from "@/utils/toastHandler";
import MyButton from "@/bases/MyButton";
import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { formRequired } from "@/constants/common";
import FormCreate from "../../../../bases/MyForm/MyFormCourse/FormCreate";
import MyFormCourse from "@/bases/MyForm/MyFormCourse";

const CourseCreateContent: React.FC = () => {
    const [form] = Form.useForm();

    const create = useMutation({
        mutationFn: (data: TCoursePost) => {
            return courseService.post(data);
        },
        onSuccess: (response) => {
            toastHandler.success(response?.payload?.message);
            form.resetFields();
        },
        onError: (error: any) => {
            toastHandler.error(error?.payload?.message);
        },
    });

    const onFinish = (values: any) => {
        console.log("TCoursePost raw values:", values);
        const payload: TCoursePost = {
            ...values,
            structure: (values?.structure || []).map((ch: any) => ({
                ...ch,
                lesson: Array.isArray(ch.lesson)
                    ? ch.lesson.map((l: any) =>
                          l && l.id !== undefined ? l.id : l,
                      )
                    : ch.lesson,
            })),
        };
        console.log("TCoursePost payload:", payload);
        create.mutate(payload);
    };

    return (
        <div className="w-full flex flex-col gap-3">
            <MyFormCourse form={form} onFinish={onFinish} />
            <div className="w-full sticky bottom-0 p-2 z-10 flex justify-end bg-white">
                <MyButton
                    loading={create.isPending}
                    className="self-end"
                    onClick={form.submit}
                    type="primary"
                >
                    Tạo khóa học
                </MyButton>
            </div>
        </div>
    );
};

export default CourseCreateContent;
