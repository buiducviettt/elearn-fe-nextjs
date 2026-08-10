"use client";
import { useState, useEffect } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import MyFormItem from "../MyFormItem";
import MyItemAnswerSingleChoice from "../MyItemAnswerSingleChoice";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyQuestionItemAdd from "../MyQuestionItemAdd";
import MyRawButton from "../MyRawButton";
import MyTextArea from "../MyTextArea";
import MyTooltip from "../MyTooltip";
import { QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import MyInput from "../MyInput";
import MyButton from "../MyButton";
import MyEditor from "../MyEditor";

type TAnswerItem = {
    id: number;
    checked: boolean;
    content: string;
};

type TState = {
    answers: TAnswerItem[];
    questionContent: string;
    explanation: string;
    multiple: QUESTION_MULTIPLE_TYPE;
};

export type TMyAnswerConfigSingleChoiceProps = {
    value: {
        questionContent: string;
        answers: {
            id: number;
            checked: boolean;
            content: string;
        }[];
    };
};

export type TMyAnswerConfigMultipleChoiceProps = {
    value?: TState;
    viewMode?: boolean;
    onChange?: (value: TState) => void;
    onRemove?: () => void;
    order: number;
};

const MyQuestionConfigSingleChoice: React.FC<
    TMyAnswerConfigMultipleChoiceProps
> = (props) => {
    const { value, onChange, order, viewMode = false, onRemove } = props;

    const [openConfirmRemove, setOpenConfirmRemove] = useState<boolean>(false);
    const [quickAnswersInput, setQuickAnswersInput] = useState<string>("");
    const [answersCreated, setAnswersCreated] = useState<boolean>(false);

    const [currentQuestions, setCurrentQuestions] = useState<TState>({
        answers: [],
        questionContent: "",
        explanation: "",
        multiple: QUESTION_MULTIPLE_TYPE.disable,
    });

    const finalState = value || currentQuestions;
    const finalOnChange = onChange || setCurrentQuestions;

    const { answers = [], questionContent = "", explanation = "" } = finalState;

    // Initialize answersCreated based on existing answers
    useEffect(() => {
        if (finalState.answers && finalState.answers.length > 0) {
            setAnswersCreated(true);
        }
    }, [finalState.answers]);

    const changeContentQuestion = (content: string) => {
        finalOnChange({ ...finalState, questionContent: content });
    };

    const changeCheckbox = (id: number) => {
        const newAnswers = answers.map((q) => ({
            ...q,
            checked: q.id === id,
        }));

        finalOnChange({
            ...finalState,
            answers: newAnswers,
        });
    };

    const changeContent = (value: string, id: number) => {
        finalOnChange({
            ...finalState,
            answers: answers.map((q) =>
                q.id === id ? { ...q, content: value } : q,
            ),
        });
    };

    const add = () => {
        finalOnChange({
            ...finalState,
            answers: [
                ...answers,
                { id: Math.random(), checked: false, content: "" },
            ],
        });
    };

    const removeAnswer = (id: number) => {
        const newAnswers = answers.filter((q) => q.id !== id);
        finalOnChange({
            ...finalState,
            answers: newAnswers,
        });

        // If no answers left, show the quick create input again
        if (newAnswers.length === 0) {
            setAnswersCreated(false);
        }
    };

    const handleSingleChange = (checked: boolean) => {
        finalOnChange({
            ...finalState,
            multiple: checked
                ? QUESTION_MULTIPLE_TYPE.enable
                : QUESTION_MULTIPLE_TYPE.disable,
        });
    };

    const handleQuickCreateAnswers = () => {
        if (!quickAnswersInput.trim()) return;

        const newAnswers = quickAnswersInput
            .split("/")
            .map((item) => item.trim())
            .filter((item) => item)
            .map((text) => ({
                id: Math.random(),
                checked: false,
                content: text,
            }));

        finalOnChange({
            ...finalState,
            answers: newAnswers,
        });

        setQuickAnswersInput("");
        setAnswersCreated(true);
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <p className="text-blue-600 flex-1 font-semibold">
                            Câu {order}.
                        </p>
                        {!viewMode && (
                            <MyTooltip title="Xoá">
                                <MyRawButton
                                    onClick={() => {
                                        const hasFilledValue = Boolean(
                                            finalState?.questionContent ||
                                            finalState?.answers?.some(
                                                (answer) =>
                                                    Boolean(answer?.content),
                                            ),
                                        );
                                        if (hasFilledValue) {
                                            setOpenConfirmRemove(true);
                                        } else {
                                            onRemove?.();
                                        }
                                    }}
                                    className="text-red-500 bg-red-50 p-1 rounded-md"
                                >
                                    <RiDeleteBin7Line size={18} />
                                </MyRawButton>
                            </MyTooltip>
                        )}
                    </div>
                    <MyFormItem>
                        <MyTextArea
                            disabled={viewMode}
                            onChange={(event) =>
                                changeContentQuestion(event.target.value)
                            }
                            value={questionContent}
                            rows={2}
                            placeholder="Vui lòng nhập tiêu đề"
                        />
                    </MyFormItem>
                    <MyFormItem label="Giải thích đáp án (nếu có)">
                        <MyEditor
                            readOnly={viewMode}
                            value={explanation}
                            onChange={(val) =>
                                finalOnChange({
                                    ...finalState,
                                    explanation: val,
                                })
                            }
                        />
                    </MyFormItem>
                </div>

                {/* Show quick create input only if no answers exist */}
                {!answersCreated && (
                    <div className="flex flex-col gap-2">
                        <p className="text-black-600 flex-1 font-semibold">
                            Khởi tạo nhanh đáp án
                        </p>
                        <div className="flex gap-2">
                            <MyInput
                                placeholder="nhập nhanh đáp án A / B / C / D"
                                value={quickAnswersInput}
                                onChange={(e) =>
                                    setQuickAnswersInput(e.target.value)
                                }
                            />
                            <MyButton
                                className="rounded-xs"
                                onClick={handleQuickCreateAnswers}
                            >
                                Tạo nhanh
                            </MyButton>
                        </div>
                    </div>
                )}

                {/* Show answer list when answers exist */}
                {answersCreated && (
                    <div className="flex flex-col gap-2 p-2 border rounded-md">
                        <div className="flex gap-2 items-center">
                            <p className="text-black-600 flex-1 font-semibold">
                                Danh sách đáp án
                            </p>
                            <MyTooltip title="Xoá nhanh">
                                <MyRawButton
                                    onClick={() => {
                                        finalOnChange({
                                            ...finalState,
                                            answers: [],
                                        });
                                        setAnswersCreated(false);
                                    }}
                                    className="text-red-500 bg-blue-50 p-1 rounded-md"
                                >
                                    <RiDeleteBin7Line size={18} />
                                </MyRawButton>
                            </MyTooltip>
                        </div>
                        <div className="flex flex-col gap-2">
                            {answers?.map((question) => {
                                const { checked, content, id } = question;
                                return (
                                    <MyItemAnswerSingleChoice
                                        viewMode={viewMode}
                                        onClick={() => changeCheckbox(id)}
                                        key={id}
                                        checked={checked}
                                        input={{
                                            value: content,
                                            onChange: (e) =>
                                                changeContent(
                                                    e.target.value,
                                                    id,
                                                ),
                                        }}
                                        btnDelete={{
                                            onClick: () => removeAnswer(id),
                                        }}
                                    />
                                );
                            })}
                            {!viewMode && <MyQuestionItemAdd onClick={add} />}
                        </div>
                    </div>
                )}
            </div>
            <MyModalDelete
                destroyOnHidden
                message="Bạn đã nhập nội dung cho câu hỏi này, bạn có thật sự muốn xóa ?"
                open={openConfirmRemove}
                onOk={onRemove}
                setOpen={setOpenConfirmRemove}
            />
        </>
    );
};

export default MyQuestionConfigSingleChoice;
