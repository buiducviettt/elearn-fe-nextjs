"use client";

import MyCard from "@/bases/MyCard";
import MyEditor, { TMyEditorRef } from "../../MyEditor";
import MyEmpty from "@/bases/MyEmpty";
import MyFormItem from "@/bases/MyFormItem";
import MyInput from "@/bases/MyInput";

import MyTextArea from "@/bases/MyTextArea";
import { formRequired } from "@/constants/common";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Form, Switch, Radio, Select, Modal } from "antd";
import { memo, useState, useEffect, useRef } from "react";
import MyForm, { TMyFormProps } from "..";
import MyInputNumber from "@/bases/MyInputNumber";
import MyGroupSelectTypeLesson from "@/bases/MyGroupSelect/MyGroupSelectTypeLesson";
import ProductsCategories from "./products/productsCategories";
import ProductsPassage from "./products/productsPassage";
import ProductsSource from "./products/productsSource";
import ProductsQuestionType from "./products/productsQuestionType";
import ProductsSection from "./products/productsSection";
import ProductsExamType from "./products/productsExamType";
import ProductsTopic from "./products/productsTopic";
import ProductsPart from "./products/productsPart";
import ProductsTask from "./products/productsTask";
import MyUploadImageHasApi from "@/bases/MyUploadImage/MyUploadImageHasApi";
import MyUploadImgHasApi from "@/bases/MyUploadImg/MyUploadImgHasApi";
import MyUploadMultipleTypeHasApi from "@/bases/MyUploadMultipleType/MyUploadMultipleTypeHasApi";
import MyUploadPdfHasApi from "@/bases/MyUploadPdf/MyUploadPdfHasApi";
import MyUploadAudioHasApi from "@/bases/MyUploadAudio/MyUploadAudioHasApi";

const VIDEO_IFRAME = `<iframe
            title="MAP (demo)"
            style="min-height: 250px"
            width="560"
            height="315"
            src="https://video.mona-cloud.com/api/video/?user=04465380&video=1774408632-map-demo&protected=False&version=v2&token=gAAAAABpw2jUZwq03hMTrsLywajzgkaKXwDyYkCtuz1J4fecmVYm29d00HGSz5XOrdbWmzvbxXZUiu7BosPWPxWUy-2LJH-fl0cPiv4nqQEha6LXpu3ZA-c%3D"
            allowfullscreen=""
            allow="encrypted-media"
            class="h-[100%] w-[100%] object-cover absolute top-0" ></iframe>`;

type TMyFormLessonProps = {
    editorKey?: string | number;
} & TMyFormProps;

const MyFormLesson: React.FC<TMyFormLessonProps> = (props) => {
    const { form, editorKey, className = "", ...rest } = props;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const localEditorKeyRef = useRef<string>(
        `lesson_editor_${Math.random().toString(36).slice(2)}`,
    );
    useEffect(() => {
        if (!form) return;
        const current = form.getFieldValue("video");
        if (!current) {
            form.setFieldsValue({ video: VIDEO_IFRAME });
        }
    }, [form]);

    return (
        <MyForm
            form={form}
            className={`flex flex-col gap-3 ${className}`}
            onFinish={(values) => {
                setIsSubmitted(true);
                try {
                    console.log("[MyFormLesson] onFinish values:", values);
                } catch (e) {
                    // ignore
                }
                rest.onFinish?.(values);
            }}
            {...rest}
        >
            <div className="flex flex-col gap-3">
                <div className="grid gap-4 grid-cols-12">
                    <div className="col-span-4">
                        <MyCard>
                            <div className="hidden">
                                <MyInput hidden name="video_type" />
                                <MyInput hidden name="questionnaire_id" />
                            </div>

                            <MyFormItem
                                rules={[formRequired]}
                                label="Tiêu đề"
                                name="title"
                            >
                                <MyInput placeholder="Nhập tiêu đề bài học" />
                            </MyFormItem>
                            <MyFormItem
                                name="level"
                                rules={[formRequired]}
                                label="Loại bài học"
                            >
                                <MyGroupSelectTypeLesson />
                            </MyFormItem>
                            <MyFormItem
                                name="duration"
                                rules={[formRequired]}
                                label="Thời gian làm bài"
                            >
                                <MyInputNumber
                                    suffix="Phút"
                                    className="!w-full"
                                    step={1}
                                    min={1}
                                    placeholder="Nhập vào số phút"
                                />
                            </MyFormItem>
                            <MyFormItem
                                name="product_filters_link"
                                label="Danh mục sản phẩm"
                            >
                                <ProductsCategories form={form} />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_source"]}
                                label="Nguồn tài liệu"
                            >
                                <ProductsSource
                                    form={form}
                                    name={["product_filters", "product_source"]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_passage"]}
                                label="Passage (Độ khó)"
                            >
                                <ProductsPassage
                                    form={form}
                                    name={[
                                        "product_filters",
                                        "product_passage",
                                    ]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={[
                                    "product_filters",
                                    "product_question_type",
                                ]}
                                label="Loại câu hỏi"
                            >
                                <ProductsQuestionType
                                    form={form}
                                    name={[
                                        "product_filters",
                                        "product_question_type",
                                    ]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_exam_type"]}
                                label="Loại đề thi"
                            >
                                <ProductsExamType
                                    form={form}
                                    name={[
                                        "product_filters",
                                        "product_exam_type",
                                    ]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_section"]}
                                label="Section"
                            >
                                <ProductsSection
                                    form={form}
                                    name={[
                                        "product_filters",
                                        "product_section",
                                    ]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_topic"]}
                                label="Chủ đề"
                            >
                                <ProductsTopic
                                    form={form}
                                    name={["product_filters", "product_topic"]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_part"]}
                                label="Phần"
                            >
                                <ProductsPart
                                    form={form}
                                    name={["product_filters", "product_part"]}
                                />
                            </MyFormItem>
                            <MyFormItem
                                name={["product_filters", "product_task"]}
                                label="Task"
                            >
                                <ProductsTask
                                    form={form}
                                    name={["product_filters", "product_task"]}
                                />
                            </MyFormItem>
                        </MyCard>
                    </div>
                    <div className="col-span-8 flex flex-col gap-3">
                        <div className="sticky top-2">
                            <MyCard>
                                <MyFormItem
                                    label="Nội dung bài học"
                                    name="description"
                                >
                                    <MyEditor
                                        key={
                                            editorKey ??
                                            localEditorKeyRef.current
                                        }
                                    />
                                </MyFormItem>
                                <MyFormItem label="Nội dung video" name="video">
                                    <MyTextArea style={{ height: 300 }} />
                                </MyFormItem>
                                <MyFormItem label="Nhập file pdf" name="files">
                                    <MyUploadPdfHasApi />
                                </MyFormItem>
                            </MyCard>
                        </div>
                    </div>
                </div>
            </div>
        </MyForm>
    );
};

export default memo(MyFormLesson);
