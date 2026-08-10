import MyButton from "@/bases/MyButton";
import { questionService } from "@/services/question";
import { TQuestionPost } from "@/types/service-post";
import { getExamConfigConverterToServer } from "@/utils/common";
import toastHandler from "@/utils/toastHandler";
import {
    QUESTION_TYPES,
    QUESTION_MULTIPLE_TYPE,
    EXAM_STRUCTURE,
    EXAM_SKILL,
} from "@/types/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Checkbox } from "antd";
import { useEffect, useMemo, useState } from "react";
import MyFormExamConfig, { initDataExamConfig } from "../../MyFormExamConfig";
import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import { DeleteOutlined } from "@ant-design/icons";
import MyIconButton from "@/bases/MyIconButton";
import MyTooltip from "@/bases/MyTooltip";
import MyTagQuestion from "@/bases/MyTagQuestion";

interface CreateNewProps {
    onGenerate: (questionIds: string[]) => void;
    questionnaireSkillType?: string;
}

interface TempQuestion {
    id: string;
    formData: any;
    title: string;
    createdAt: Date;
}

// Hàm lấy skill id theo loại đề
const getSkillIdByType = (type?: string) => {
    switch (type) {
        case EXAM_SKILL.listening:
            return "4";
        case EXAM_SKILL.reading:
            return "5";
        case EXAM_SKILL.speaking:
            return "6";
        case EXAM_SKILL.writing:
            return "7";
        default:
            return undefined;
    }
};

const CreateNew = ({ onGenerate, questionnaireSkillType }: CreateNewProps) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [tempQuestions, setTempQuestions] = useState<TempQuestion[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // Set mặc định skill khi mở form hoặc khi đổi skill đề
    useEffect(() => {
        form.setFieldsValue({
            ...initDataExamConfig,
            question_skill: getSkillIdByType(questionnaireSkillType),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, questionnaireSkillType]);

    const setInitDataForm = () => {
        form.setFieldsValue({
            ...initDataExamConfig,
            question_skill: getSkillIdByType(questionnaireSkillType),
        });
    };

    const createMultiple = useMutation({
        mutationFn: async (questions: TempQuestion[]) => {
            const results: any[] = [];
            for (const question of questions) {
                try {
                    const response = await questionService.create(
                        question.formData
                    );
                    results.push(response);
                } catch (error) {
                    console.error("Error creating question:", error);
                    results.push(null);
                }
            }
            return results;
        },
        onSuccess: (responses) => {
            const questionIds = responses
                .filter((response) => response !== null)
                .map((response) => response?.payload?.data?.question_id)
                .filter(Boolean);

            if (questionIds.length > 0) {
                onGenerate(questionIds);
                setTempQuestions((prev) =>
                    prev.filter((q) => !selectedQuestions.includes(q.id))
                );
                setSelectedQuestions([]);
                queryClient.invalidateQueries({
                    queryKey: [questionService.keyGet],
                });
                toastHandler.success(
                    `Đã tạo thành công ${questionIds.length} câu hỏi`
                );
            } else {
                toastHandler.error("Không thể tạo câu hỏi");
            }
        },
        onError: (error: any) => {
            toastHandler.error(
                error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !"
            );
        },
    });

    const addToTempList = useMemo(
        () => (value) => {
            const { question_items = [] } = value;
            const newQuestionItems = question_items.map((question) => {
                const { type } = question;
                const converter = getExamConfigConverterToServer(type);
                if (converter) {
                    const convertedData = converter(question);
                    return {
                        ...convertedData,
                        multiple:
                            question.multiple || QUESTION_MULTIPLE_TYPE.disable,
                    };
                }
                return question;
            });

            const tempQuestion: TempQuestion = {
                id: `temp_${Date.now()}_${Math.random()}`,
                formData: {
                    ...value,
                    question_items: newQuestionItems,
                },
                title: value.question_title || "Câu hỏi không có tiêu đề",
                createdAt: new Date(),
            };

            setTempQuestions((prev) => [...prev, tempQuestion]);
            setSelectedQuestions((prev) => [...prev, tempQuestion.id]);
            form.resetFields();
            setInitDataForm();
            toastHandler.success("Đã thêm câu hỏi vào danh sách tạo mới");
        },
        []
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedQuestions(tempQuestions.map((q) => q.id));
        } else {
            setSelectedQuestions([]);
        }
    };

    const handleSelectQuestion = (questionId: string, checked: boolean) => {
        if (checked) {
            setSelectedQuestions((prev) => [...prev, questionId]);
        } else {
            setSelectedQuestions((prev) =>
                prev.filter((id) => id !== questionId)
            );
        }
    };

    const handleCreateSelected = () => {
        const selectedTempQuestions = tempQuestions.filter((q) =>
            selectedQuestions.includes(q.id)
        );

        if (selectedTempQuestions.length === 0) {
            toastHandler.warning("Vui lòng chọn ít nhất một câu hỏi để tạo");
            return;
        }

        setIsCreating(true);
        createMultiple.mutate(selectedTempQuestions);
    };
    useEffect(() => {
        setTempQuestions([]);
        setSelectedQuestions([]);
    }, [questionnaireSkillType]);
    useEffect(() => {
        setInitDataForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    useEffect(() => {
        if (!createMultiple.isPending) {
            setIsCreating(false);
        }
    }, [createMultiple.isPending]);

    // Tính toán disabledSkills: chỉ cho chọn đúng skill của đề, disable các skill còn lại
    const allowedSkillId = getSkillIdByType(questionnaireSkillType);
    const disabledSkills = useMemo(
        () => ["4", "5", "6", "7"].filter((id) => id !== allowedSkillId),
        [allowedSkillId]
    );

    // Disable group question nếu là speaking hoặc writing
    const disableGroupQuestion =
        questionnaireSkillType === EXAM_SKILL.speaking ||
        questionnaireSkillType === EXAM_SKILL.writing;

    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-4 col-span-3">
                <MyFormExamConfig
                    onFinish={addToTempList}
                    form={form}
                    isIelts={true}
                    questionnaireSkillType={questionnaireSkillType}
                    disabledSkills={disabledSkills}
                    disableGroupQuestion={disableGroupQuestion}
                />
                <MyButton
                    onClick={form.submit}
                    type="primary"
                    className="self-end"
                >
                    Thêm vào danh sách
                </MyButton>
            </div>
            <div className="col-span-1">
                <div className="sticky top-4">
                    <MyCard
                        title={
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-gray-500">
                                    Danh sách câu hỏi mới (
                                    {tempQuestions.length})
                                </span>
                                {tempQuestions.length > 0 && (
                                    <Checkbox
                                        checked={
                                            selectedQuestions.length ===
                                            tempQuestions.length
                                        }
                                        indeterminate={
                                            selectedQuestions.length > 0 &&
                                            selectedQuestions.length <
                                                tempQuestions.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    >
                                        Chọn tất cả
                                    </Checkbox>
                                )}
                            </div>
                        }
                    >
                        <div className="flex flex-col gap-3">
                            {tempQuestions.length === 0 ? (
                                <MyEmpty />
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                                        {tempQuestions.map(
                                            (question, index) => {
                                                const questionItems =
                                                    question.formData
                                                        ?.question_items || [];
                                                const questionType =
                                                    questionItems.length > 1
                                                        ? EXAM_STRUCTURE.group
                                                        : EXAM_STRUCTURE.single;

                                                return (
                                                    <div
                                                        key={question.id}
                                                        className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer"
                                                        onClick={() =>
                                                            handleSelectQuestion(
                                                                question.id,
                                                                !selectedQuestions.includes(
                                                                    question.id
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <div className="flex gap-2 items-center flex-1">
                                                            <MyTagQuestion
                                                                type={
                                                                    questionType
                                                                }
                                                                amount={
                                                                    questionItems.length
                                                                }
                                                            />
                                                            <p className="text-sm font-medium truncate">
                                                                {question.title}
                                                            </p>
                                                        </div>
                                                        <Checkbox
                                                            checked={selectedQuestions.includes(
                                                                question.id
                                                            )}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectQuestion(
                                                                    question.id,
                                                                    e.target
                                                                        .checked
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>

                                    {selectedQuestions.length > 0 && (
                                        <div className="mt-3 pt-3 border-t">
                                            <MyButton
                                                type="primary"
                                                loading={isCreating}
                                                onClick={handleCreateSelected}
                                                className="w-full"
                                            >
                                                Tạo {selectedQuestions.length}{" "}
                                                câu hỏi đã chọn
                                            </MyButton>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </MyCard>
                </div>
            </div>
        </div>
    );
};

export default CreateNew;
