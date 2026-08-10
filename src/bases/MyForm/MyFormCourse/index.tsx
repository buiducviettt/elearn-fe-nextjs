"use client";

import MyCard from "@/bases/MyCard";
import MyEditor, { TMyEditorRef } from "../../MyEditor";
import MyFormItem from "@/bases/MyFormItem";
import MyInput from "@/bases/MyInput";

import { formRequired } from "@/constants/common";

import { CSS } from "@dnd-kit/utilities";
import { Form, Switch, Radio, Select, Modal } from "antd";
import { memo, useState, useEffect, useRef } from "react";
import MyForm, { TMyFormProps } from "..";
import FormCreate from "./FormCreate";
type TMyFormCourseProps = {
    editorKey?: string | number;
} & TMyFormProps;

const MyFormCourse: React.FC<TMyFormCourseProps> = (props) => {
    const { form, editorKey, className = "", ...rest } = props;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const courseEditorKeyRef = useRef<string>(
        `course_editor_${Math.random().toString(36).slice(2)}`,
    );

    return (
        <MyForm
            form={form}
            className={`flex flex-col gap-3 ${className}`}
            onFinish={(values) => {
                setIsSubmitted(true);
                rest.onFinish?.(values);
            }}
            {...rest}
        >
            <div className="grid grid-cols-12 gap-3 mb-3">
                <div className="col-span-4">
                    <div className="sticky top-2">
                        <MyCard className="">
                            <MyFormItem
                                rules={[formRequired]}
                                label="Tiêu đề khóa học"
                                name="title"
                            >
                                <MyInput placeholder="Nhập tiêu đề khóa học" />
                            </MyFormItem>
                            <MyFormItem
                                label="Nội dung khóa học"
                                name="description"
                            >
                                <MyEditor
                                    id="description_course"
                                    key={
                                        editorKey ?? courseEditorKeyRef.current
                                    }
                                />
                            </MyFormItem>
                        </MyCard>
                    </div>
                </div>
                <div className="col-span-8">
                    {/* Chapters / Structure */}
                    <Form.List name="structure" initialValue={[]}>
                        {(fields, { add, remove }) => (
                            <FormCreate
                                structureAdd={add}
                                structureFields={fields}
                                structureRemove={remove}
                                form={form}
                            />
                        )}
                    </Form.List>
                </div>
            </div>
        </MyForm>
    );
};

export default memo(MyFormCourse);
