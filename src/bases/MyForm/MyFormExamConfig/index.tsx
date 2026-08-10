"use client";

import MyCard from "@/bases/MyCard";
import MyEditor, { TMyEditorRef } from "../../MyEditor";
import MyEmpty from "@/bases/MyEmpty";
import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectExamLevel from "@/bases/MyGroupSelect/MyGroupSelectExamLevel";
import MyGroupSelectExamSkill from "@/bases/MyGroupSelect/MyGroupSelectExamSkill";
import MyInput from "@/bases/MyInput";
import MyQuestionConfigFillingGapNoSSR from "@/bases/MyQuestionConfigFillingGap/MyQuestionConfigFillingGapNoSSR";
import { validateFillingGap } from "@/bases/MyQuestionConfigFillingGap/util";
import MyQuestionConfigMultipleChoice from "@/bases/MyQuestionConfigMultipleChoice";
import { validateMultipleChoice } from "@/bases/MyQuestionConfigMultipleChoice/utils";
import MyQuestionConfigSingleChoice from "@/bases/MyQuestionConfigSingleChoice";
import { validateSingleChoice } from "@/bases/MyQuestionConfigSingleChoice/utils";
import MyQuestionConfigSpeaking from "@/bases/MyQuestionConfigSpeaking";
import { validateSpeaking } from "@/bases/MyQuestionConfigSpeaking/utils";
//
import MyQuestionConfigDrag from "@/bases/MyQuestionConfigDrag";
import { validateDrag } from "@/bases/MyQuestionConfigDrag/utils";
import MyRadioV1ExamCategory from "@/bases/MyRadioV1/MyRadioV1ExamCategory";
import MyRadioV1ExamPart from "@/bases/MyRadioV1/MyRadioV1ExamPart";
import MyTextArea from "@/bases/MyTextArea";
import { formRequired } from "@/constants/common";
import {
    EXAM_STRUCTURE,
    RDOM_STRUCTURE,
    QUESTION_TYPES,
    TEST_VISUAL,
    EXAM_SKILL,
    LAYOUT_QUESTION_TYPES,
} from "@/types/enum";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Form, Switch, Radio, Select, Modal } from "antd";
import { useWatch } from "antd/es/form/Form";
import { memo, useState, useEffect, useRef } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import MyForm, { TMyFormProps } from "..";
import AddQuestionType from "./AddQuestionType";
import QuestionRandomFormItem from "./QuestionRandomFormItem";
import MyQuestionConfigWriting from "@/bases/MyQuestionConfigWriting";
import { validateWriting } from "@/bases/MyQuestionConfigWriting/utils";
import MyUploadAudioVideoHasApi from "@/bases/MyUploadAudioVideo/MyUploadAudioVideoHasApi";

export const initDataExamConfigJoin = {
    question_random: RDOM_STRUCTURE.enable,
};
export const initDataExamConfig = {
    question_type: EXAM_STRUCTURE.single,
};
export const initDataExamConfigVisual = {
    question_visual: TEST_VISUAL.default,
};
type TMyFormExamConfigProps = {
    editorKey?: string | number;
    isIelts?: boolean;
    questionnaireSkillType?: string;
    disabledSkills?: string[];
    disableGroupQuestion?: boolean;
} & TMyFormProps;

const MyFormExamConfig: React.FC<TMyFormExamConfigProps> = (props) => {
    const {
        form,
        editorKey,
        className = "",
        isIelts = false,
        questionnaireSkillType,
        disabledSkills = [],
        disableGroupQuestion = false,
        ...rest
    } = props;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const questionType = useWatch(["question_type"], form);
    const questionVisual = useWatch(["question_visual"], form);
    const questionSkill = useWatch(["question_skill"], form);
    const prevSkillRef = useRef<string | undefined>(undefined);
    // Set isIelts value to form when component mounts
    useEffect(() => {
        form?.setFieldValue("isIelts", isIelts);
    }, [form, isIelts]);

    // Auto set question_visual to default when question_type is single
    useEffect(() => {
        if (questionType === EXAM_STRUCTURE.single && form) {
            form.setFieldValue("question_visual", TEST_VISUAL.default);
        }
    }, [questionType, form]);

    // Auto set question_type to single when questionnaireSkillType is speaking or writing
    useEffect(() => {
        if (questionnaireSkillType && form) {
            if (
                questionnaireSkillType === EXAM_SKILL.speaking ||
                questionnaireSkillType === EXAM_SKILL.writing
            ) {
                // Bắt buộc chọn single cho speaking/writing
                if (questionType !== EXAM_STRUCTURE.single) {
                    form.setFieldValue("question_type", EXAM_STRUCTURE.single);
                }
            }
        }
    }, [questionnaireSkillType, questionType, form]);

    // useEffect(() => {
    //     if (!form) return;

    //     // Bỏ qua khi chưa có giá trị rõ ràng
    //     if (
    //         questionSkill === undefined ||
    //         questionSkill === null ||
    //         questionSkill === ""
    //     ) {
    //         return;
    //     }

    //     // Kiểm tra field có bị user chạm vào không
    //     const skillTouched =
    //         typeof form.isFieldTouched === "function"
    //             ? form.isFieldTouched("question_skill")
    //             : typeof form.isFieldsTouched === "function"
    //             ? form.isFieldsTouched(["question_skill"], false)
    //             : false;

    //     // Lần đầu có giá trị hợp lệ -> lưu baseline và thoát
    //     if (typeof prevSkillRef.current === "undefined") {
    //         prevSkillRef.current = questionSkill;
    //         return;
    //     }

    //     // Nếu giá trị thay đổi
    //     if (questionSkill !== prevSkillRef.current) {
    //         // Nếu user chưa chạm vào field => coi là thay đổi theo lập trình, chỉ đồng bộ baseline
    //         if (!skillTouched) {
    //             prevSkillRef.current = questionSkill;
    //             return;
    //         }

    //         // User thực sự đổi -> hỏi xác nhận
    //         const items = form.getFieldValue("question_items") || [];
    //         if (items.length > 0) {
    //             Modal.confirm({
    //                 title: "Đổi kỹ năng sẽ xóa toàn bộ câu hỏi hiện tại. Bạn có chắc muốn đổi?",
    //                 okText: "Đồng ý",
    //                 centered: true,
    //                 cancelText: "Hủy",
    //                 onOk: () => {
    //                     form.setFieldValue("question_items", []);
    //                     prevSkillRef.current = questionSkill;
    //                 },
    //                 onCancel: () => {
    //                     form.setFieldValue(
    //                         "question_skill",
    //                         prevSkillRef.current
    //                     );
    //                 },
    //             });
    //         } else {
    //             prevSkillRef.current = questionSkill;
    //         }
    //     }
    // }, [questionSkill, form]);

    return (
        <MyForm
            form={form}
            initialValues={{
                question_random: RDOM_STRUCTURE.enable,
                question_type:
                    questionnaireSkillType === EXAM_SKILL.speaking ||
                    questionnaireSkillType === EXAM_SKILL.writing
                        ? EXAM_STRUCTURE.single
                        : EXAM_STRUCTURE.single,
                question_visual: TEST_VISUAL.default,
                isIelts: isIelts,
                // question_skill: "4",
            }}
            className={`flex flex-col gap-3 ${className}`}
            onFinish={(values) => {
                setIsSubmitted(true);
                rest.onFinish?.(values);
            }}
            {...rest}
        >
            {/* Hidden Form.Item for isIelts */}
            <Form.Item name="isIelts" hidden>
                <input type="hidden" />
            </Form.Item>

            {/* Hidden Form.Item for question_visual */}
            <Form.Item name="question_visual" hidden>
                <input type="hidden" />
            </Form.Item>

            <div className="grid gap-4 grid-cols-12">
                <div className="col-span-12 xl:col-span-4 row-span-2 flex flex-col gap-6">
                    <div className="sticky top-0">
                        <div className="p-4 bg-white rounded-lg mb-2">
                            <MyFormItem
                                rules={[formRequired]}
                                label="Tiêu đề"
                                name="question_title"
                            >
                                <MyInput placeholder="Nhập tiêu đề câu hỏi" />
                            </MyFormItem>
                        </div>
                        {/* <MyCard title="Phân loại layout câu hỏi">
              <MyFormItem
                name="question_optional"
              >
                <Select placeholder="Chọn layout câu hỏi">
                  {Object.entries(LAYOUT_QUESTION_TYPES).map(([value, label]) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </MyFormItem>
            </MyCard> */}
                        <MyCard title="Phân loại câu hỏi">
                            {/* <QuestionRandomFormItemJoin form={form} /> */}
                            <QuestionRandomFormItem
                                form={form}
                                disableGroupQuestion={disableGroupQuestion}
                            />
                            <MyFormItem
                                rules={[formRequired]}
                                name="question_skill"
                                label="Kỹ năng"
                            >
                                <MyGroupSelectExamSkill
                                    disabledSkills={
                                        questionType === EXAM_STRUCTURE.group
                                            ? Array.from(
                                                  new Set([
                                                      ...(disabledSkills || []),
                                                      "6",
                                                      "7",
                                                  ]),
                                              )
                                            : disabledSkills
                                    }
                                />
                            </MyFormItem>
                            <MyFormItem
                                rules={[formRequired]}
                                name="question_level"
                                label="Độ khó"
                            >
                                <MyGroupSelectExamLevel />
                            </MyFormItem>
                            <MyFormItem
                                name="question_category"
                                label="Danh mục câu hỏi"
                            >
                                <MyRadioV1ExamCategory />
                            </MyFormItem>
                            <MyFormItem
                                name="question_part"
                                label="Phần câu hỏi"
                            >
                                <MyRadioV1ExamPart />
                            </MyFormItem>
                        </MyCard>
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-8 row-span-1 flex flex-col gap-3">
                    <MyCard>
                        <MyFormItem
                            label="Nội dung nhóm câu hỏi"
                            name="question_description"
                        >
                            <MyEditor key={editorKey} />
                        </MyFormItem>
                    </MyCard>
                    <MyCard>
                        <MyFormItem label="Upload file" name="question_file">
                            <MyUploadAudioVideoHasApi />
                        </MyFormItem>
                    </MyCard>
                    <MyCard>
                        <MyFormItem
                            label="Ghi chú nhóm câu hỏi"
                            name="question_explanation"
                        >
                            <MyEditor key={editorKey} />
                        </MyFormItem>
                    </MyCard>
                </div>

                <div className="flex flex-col gap-4 col-span-12 xl:col-span-8 row-span-1">
                    <Form.List name="question_items">
                        {(fields, { add, remove, move }) => {
                            const handleDragEnd = (event) => {
                                const { active, over } = event;
                                if (!over || active.id === over.id) return;

                                const oldIndex = fields.findIndex(
                                    (f) => f.key === active.id,
                                );
                                const newIndex = fields.findIndex(
                                    (f) => f.key === over.id,
                                );

                                move(oldIndex, newIndex);
                            };

                            return (
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={fields.map((field) => field.key)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="flex flex-col gap-3">
                                            <MyCard>
                                                {fields.length === 0 && (
                                                    <MyEmpty />
                                                )}
                                                <div className="flex flex-col gap-3">
                                                    {fields.map(
                                                        (field, index) => {
                                                            return (
                                                                <SortableItem
                                                                    form={form}
                                                                    key={
                                                                        field.key
                                                                    }
                                                                    field={
                                                                        field
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                    remove={
                                                                        remove
                                                                    }
                                                                    isSubmitted={
                                                                        isSubmitted
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </MyCard>

                                            <AddQuestionType
                                                form={form}
                                                add={add}
                                                disableGroupQuestion={
                                                    disableGroupQuestion
                                                }
                                            />
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            );
                        }}
                    </Form.List>
                    {questionType === EXAM_STRUCTURE.group &&
                        questionVisual === TEST_VISUAL.table && (
                            <MyCard title="Phân loại layout câu hỏi">
                                <MyFormItem
                                    name="question_optional"
                                    getValueProps={(value) => ({
                                        value: value || undefined,
                                    })}
                                >
                                    <Select placeholder="Chọn layout câu hỏi">
                                        {Object.entries(
                                            LAYOUT_QUESTION_TYPES,
                                        ).map(([value, label]) => (
                                            <Select.Option
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </MyFormItem>
                            </MyCard>
                        )}
                </div>
            </div>
        </MyForm>
    );
};

const SortableItem = ({ field, index, remove, form, isSubmitted }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: field.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { type } = form?.getFieldValue?.("question_items")?.[index] || {};
    const isIelts = form?.getFieldValue("isIelts");

    return (
        <div ref={setNodeRef} style={style} className="relative bg-white">
            <div className="flex items-center justify-center gap-2 mb-2">
                <RxDragHandleDots2
                    size={20}
                    className="cursor-pointer text-gray-500 flex-shrink-0"
                    {...attributes}
                    {...listeners}
                />
            </div>
            {type === QUESTION_TYPES.speaking && (
                <MyFormItem
                    rules={[{ validator: validateSpeaking }]}
                    name={[field.name]}
                >
                    <MyQuestionConfigSpeaking
                        order={index + 1}
                        onRemove={() => remove(index)}
                        isSubmitted={isSubmitted}
                    />
                </MyFormItem>
            )}

            {type === QUESTION_TYPES.writing && (
                <MyFormItem
                    rules={[{ validator: validateWriting }]}
                    name={[field.name]}
                >
                    <MyQuestionConfigWriting
                        order={index + 1}
                        onRemove={() => remove(index)}
                        isSubmitted={isSubmitted}
                    />
                </MyFormItem>
            )}
            {type === QUESTION_TYPES.single_choice && (
                <MyFormItem
                    rules={[{ validator: validateSingleChoice }]}
                    name={[field.name]}
                >
                    <MyQuestionConfigSingleChoice
                        order={index + 1}
                        onRemove={() => remove(index)}
                    />
                </MyFormItem>
            )}
            {type === QUESTION_TYPES.single_choice_selector && (
                <MyFormItem
                    rules={[{ validator: validateSingleChoice }]}
                    name={[field.name]}
                >
                    <MyQuestionConfigSingleChoice
                        order={index + 1}
                        onRemove={() => remove(index)}
                    />
                </MyFormItem>
            )}
            {type === QUESTION_TYPES.multiple_choice && (
                <MyFormItem
                    rules={[{ validator: validateMultipleChoice }]}
                    name={[field.name]}
                >
                    <MyQuestionConfigMultipleChoice
                        order={index + 1}
                        onRemove={() => remove(index)}
                    />
                </MyFormItem>
            )}
            {type === QUESTION_TYPES.fill_in_the_blank && (
                <MyFormItem
                    name={[field.name]}
                    rules={[{ validator: validateFillingGap }]}
                >
                    <MyQuestionConfigFillingGapNoSSR
                        order={index + 1}
                        onRemove={() => remove(index)}
                        viewMode={false}
                    />
                </MyFormItem>
            )}
            {type === QUESTION_TYPES.drag && (
                <MyFormItem
                    name={[field.name]}
                    rules={[{ validator: validateDrag }]}
                >
                    <MyQuestionConfigDrag
                        order={index + 1}
                        onRemove={() => remove(index)}
                        isIelts={isIelts}
                    />
                </MyFormItem>
            )}
        </div>
    );
};

export default memo(MyFormExamConfig);
