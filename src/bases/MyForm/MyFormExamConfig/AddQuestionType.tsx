import MyButton from "@/bases/MyButton";
import MyCard from "@/bases/MyCard";
import MyGroupSelectQuestionType from "@/bases/MyGroupSelect/MyGroupSelectQuestionType";
import { INIT_DATA_DRAG } from "@/bases/MyQuestionConfigDrag/utils";
// import { INIT_DATA_MATCH } from "@/bases/MyQuestionConfigMatch/utils";
import { INIT_DATA_MULTIPLE_CHOICE } from "@/bases/MyQuestionConfigMultipleChoice/utils";
import { INIT_DATA_SINGLE_CHOICE } from "@/bases/MyQuestionConfigSingleChoice/utils";
import { EXAM_STRUCTURE, QUESTION_TYPES, TEST_VISUAL } from "@/types/enum";
import { TEST_VISUAL_STRUCTURE } from "@/types/common";
import { Select } from "antd";
import { useWatch } from "antd/es/form/Form";
import { useState, useEffect } from "react";

const AddQuestionType = ({ form, add, disableGroupQuestion }) => {
    const questions = useWatch(["question_items"], form);
    const questionType = useWatch(["question_type"], form);
    const questionVisual = useWatch(["question_visual"], form);
    const questionSkill = useWatch(["question_skill"], form); // Thêm watch cho question_skill

    const alreadyConfigQuestion = Boolean(questions?.length > 0);
    const isSingleQuestion = questionType === EXAM_STRUCTURE.single;
    const isTableView = questionVisual === TEST_VISUAL.table;

    const [type, setType] = useState<QUESTION_TYPES>();

    // Reset skill về 4 khi chọn EXAM_STRUCTURE.group và đang chọn skill 6 hoặc 7
    useEffect(() => {
        if (questionType === EXAM_STRUCTURE.group && questionSkill) {
            const skillId = questionSkill?.id || questionSkill;

            if (skillId === "6" || skillId === "7") {
                // Reset về skill 4 (Nghe)
                form?.setFieldValue("question_skill", "4");
            }
        }
    }, [questionType, questionSkill, form]);

    // Reset selected type if it's not allowed in table view
    useEffect(() => {
        if (
            isTableView &&
            type &&
            type !== QUESTION_TYPES.single_choice &&
            type !== QUESTION_TYPES.multiple_choice
        ) {
            setType(undefined);
        }
    }, [isTableView, type]);

    // Reset selected type if it's not allowed based on skill
    useEffect(() => {
        if (questionSkill && type) {
            const skillId = questionSkill?.id || questionSkill;

            // Nếu chọn kỹ năng Nghe (id 4) hoặc Đọc (id 5) mà type là speaking/writing
            if (
                (skillId === "4" || skillId === "5") &&
                (type === QUESTION_TYPES.speaking ||
                    type === QUESTION_TYPES.writing)
            ) {
                setType(undefined);
            }
            // Nếu chọn kỹ năng Nói (id 6) mà type không phải speaking
            else if (skillId === "6" && type !== QUESTION_TYPES.speaking) {
                setType(undefined);
            }
            // Nếu chọn kỹ năng Viết (id 7) mà type không phải writing
            else if (skillId === "7" && type !== QUESTION_TYPES.writing) {
                setType(undefined);
            }
        }
    }, [questionSkill, type]);

    if (isSingleQuestion && alreadyConfigQuestion) {
        return (
            <p className="text-orange-500">
                Loại câu hỏi đơn chỉ có thể tạo được 1 câu hỏi
            </p>
        );
    }

    const handleAddQuestion = () => {
        if (!type) return;

        if (type === QUESTION_TYPES.drag) {
            const { type: questionType, questionContent } = INIT_DATA_DRAG;
            add({
                type: questionType,
                question: [questionContent],
                answer: [],
                noise_answer: [],
            });
            return;
        }
        if (type === QUESTION_TYPES.multiple_choice) {
            const data = {
                type: type,
                ...INIT_DATA_MULTIPLE_CHOICE,
            };
            add(data);
            return;
        }
        if (type === QUESTION_TYPES.single_choice) {
            const data = {
                type: type,
                ...INIT_DATA_SINGLE_CHOICE,
            };
            add(data);
            return;
        }
        add({ type: type });
    };

    // Logic để filter các loại câu hỏi dựa trên kỹ năng, table view và exam structure
    const getDisabledQuestionTypes = () => {
        let disabledTypes: QUESTION_TYPES[] = [];

        if (isTableView) {
            disabledTypes = Object.values(QUESTION_TYPES).filter(
                (type) =>
                    type !== QUESTION_TYPES.single_choice &&
                    type !== QUESTION_TYPES.multiple_choice
            );
        }
        // if (questionType === EXAM_STRUCTURE.single) {
        // }
        if (questionType === EXAM_STRUCTURE.group) {
            disabledTypes.push(QUESTION_TYPES.drag);
            // Disable tất cả nếu skill là 6 hoặc 7
            const skillId = questionSkill?.id || questionSkill;
            if (skillId === "6" || skillId === "7") {
                disabledTypes = [...Object.values(QUESTION_TYPES)];
            } else {
                const groupDisabledTypes = Object.values(QUESTION_TYPES).filter(
                    (type) =>
                        type === QUESTION_TYPES.speaking ||
                        type === QUESTION_TYPES.writing
                );
                disabledTypes = [...disabledTypes, ...groupDisabledTypes];
            }
        }

        // Filter dựa trên kỹ năng
        if (questionSkill) {
            const skillId = questionSkill?.id || questionSkill;

            if (skillId === "4" || skillId === "5") {
                disabledTypes.push(
                    QUESTION_TYPES.speaking,
                    QUESTION_TYPES.writing
                );
            } else if (skillId === "6") {
                disabledTypes = [
                    ...disabledTypes,
                    ...Object.values(QUESTION_TYPES).filter(
                        (type) => type !== QUESTION_TYPES.speaking
                    ),
                ];
            } else if (skillId === "7") {
                disabledTypes = [
                    ...disabledTypes,
                    ...Object.values(QUESTION_TYPES).filter(
                        (type) => type !== QUESTION_TYPES.writing
                    ),
                ];
            }
        }

        return [...new Set(disabledTypes)];
    };

    return (
        <MyCard className="!bg-blue-50 !border !border-dashed !border-blue-500">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <p className="flex-1 font-medium">Thêm câu hỏi</p>
                    <MyButton
                        disabled={!Boolean(type)}
                        onClick={handleAddQuestion}
                        type="primary"
                    >
                        Thêm câu hỏi
                    </MyButton>
                </div>
                {questionType === EXAM_STRUCTURE.group && (
                    <div className="bg-white rounded p-2 flex flex-col gap-2">
                        <label className="text-sm font-medium">
                            Giao diện hiển thị
                        </label>
                        <Select
                            className="w-full"
                            value={questionVisual}
                            onChange={(value) =>
                                form.setFieldValue("question_visual", value)
                            }
                            options={Object.values(TEST_VISUAL_STRUCTURE)}
                            placeholder="Chọn giao diện hiển thị"
                        />
                    </div>
                )}
                <MyGroupSelectQuestionType
                    className="bg-white border-none"
                    value={type}
                    onChange={(value) => setType(value as QUESTION_TYPES)}
                    disabledOptions={getDisabledQuestionTypes()}
                />
            </div>
        </MyCard>
    );
};

export default AddQuestionType;
