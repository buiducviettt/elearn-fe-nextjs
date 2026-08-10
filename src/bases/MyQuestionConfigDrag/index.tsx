"use client";
import numberHandler from "@/utils/numberHandler";
import objectHandler from "@/utils/objectHandler";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin7Line, RiDeleteBin6Line } from "react-icons/ri";
import MyEditor, { DATA_ID_FILLING_INPUT, TMyEditorRef } from "../MyEditor";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyMultipleAnswer from "../MyMultipleAnswer";
import MyRawButton from "../MyRawButton";
import MyTooltip from "../MyTooltip";
import { Switch } from "antd";
import {
    QUESTION_MULTIPLE_TYPE,
    QUESTION_CLONEABLE_TYPE,
    QUESTION_DRAGABLE_TYPE,
} from "@/types/enum";
import MyButton from "../MyButton";
import { Form } from "antd";

type TAnswerItem = {
    id: number;
    content: {
        id: number;
        value: string;
    }[];
};

type TState = {
    answers: TAnswerItem[];
    noise_answer: TAnswerItem[];
    questionContent: string;
    explanation: string[]; // mảng giải thích tương ứng từng đáp án
    multiple: QUESTION_MULTIPLE_TYPE;
    selected_ids: string;
    cloneable?: QUESTION_CLONEABLE_TYPE;
    draggable?: QUESTION_DRAGABLE_TYPE;
};

export type TMyQuestionConfigDragProps = {
    value?: TState;
    viewMode?: boolean;
    onChange?: (value: TState) => void;
    order: number;
    onRemove?: () => void;
    isIelts?: boolean;
};

const MyQuestionConfigDrag: React.FC<TMyQuestionConfigDragProps> = (props) => {
    const {
        value,
        onChange,
        order,
        onRemove,
        viewMode = false,
        isIelts = false,
    } = props;
    const editorRef = useRef<TMyEditorRef>(null);
    // update answer indirectly by finalOnChange doesn't work in updateAnswerInput
    // i don't know why ! so i use newAnswer instead
    const [newAnswer, setNewAnswer] = useState<TAnswerItem[]>([]);

    const [openConfirmRemove, setOpenConfirmRemove] = useState<boolean>(false);

    // update questionContent indirectly to prevent loop set when update questionContent via changeContentQuestion when onChange editor
    // i also even don't know why! so i use newValue instead
    const [newValue, setNewValue] = useState("");

    const [currentQuestions, setCurrentQuestions] = useState<TState>({
        answers: [],
        noise_answer: [],
        questionContent: "",
        explanation: [],
        multiple: QUESTION_MULTIPLE_TYPE.disable,
        selected_ids: "",
        cloneable: QUESTION_CLONEABLE_TYPE.disable,
        draggable: QUESTION_DRAGABLE_TYPE.disable,
    });

    const finalState = value || currentQuestions;
    const finalOnChange = onChange || setCurrentQuestions;

    const {
        answers = [],
        noise_answer = [],
        questionContent = "",
        explanation = [],
        multiple = QUESTION_MULTIPLE_TYPE.disable,
        selected_ids = "",
        cloneable = QUESTION_CLONEABLE_TYPE.disable,
        draggable = QUESTION_DRAGABLE_TYPE.disable,
    } = finalState;

    const changeContentQuestion = (content: string) => {
        finalOnChange({ ...finalState, questionContent: content });
    };

    const changeAnswerContent = (
        value: string,
        contentId: number,
        answerId: number,
    ) => {
        const clAnswer = [...answers];
        const index = clAnswer.findIndex((q) => q.id === answerId);
        clAnswer[index].content = clAnswer[index].content.map((c) =>
            c.id === contentId ? { ...c, value } : c,
        );
        setNewAnswer(clAnswer);
    };

    const addSubAnswer = (answerId: number) => {
        const clAnswer = [...answers];
        const index = clAnswer.findIndex((q) => q.id === answerId);
        clAnswer[index].content.push({
            id: numberHandler.random(0, 100000),
            value: "",
        });
        setNewAnswer(clAnswer);
        // finalOnChange({ ...finalState, answers: clAnswer });
    };

    const removeSubAnswer = (answerId: number, contentId: number) => {
        const clAnswer = [...answers];
        const index = clAnswer.findIndex((q) => q.id === answerId);
        clAnswer[index].content = clAnswer[index].content.filter(
            (c) => c.id !== contentId,
        );
        setNewAnswer(clAnswer);
        // finalOnChange({ ...finalState, answers: clAnswer });
    };

    const changeNoiseAnswerContent = (
        value: string,
        contentId: number,
        answerId: number,
    ) => {
        const clNoiseAnswer = [...noise_answer];
        const index = clNoiseAnswer.findIndex((q) => q.id === answerId);
        clNoiseAnswer[index].content = clNoiseAnswer[index].content.map((c) =>
            c.id === contentId ? { ...c, value } : c,
        );
        finalOnChange({ ...finalState, noise_answer: clNoiseAnswer });
    };

    const addNoiseSubAnswer = (answerId: number) => {
        const clNoiseAnswer = [...noise_answer];
        const index = clNoiseAnswer.findIndex((q) => q.id === answerId);
        clNoiseAnswer[index].content.push({
            id: numberHandler.random(0, 100000),
            value: "",
        });
        finalOnChange({ ...finalState, noise_answer: clNoiseAnswer });
    };

    const removeNoiseSubAnswer = (answerId: number, contentId: number) => {
        const clNoiseAnswer = [...noise_answer];
        const index = clNoiseAnswer.findIndex((q) => q.id === answerId);
        clNoiseAnswer[index].content = clNoiseAnswer[index].content.filter(
            (c) => c.id !== contentId,
        );
        finalOnChange({ ...finalState, noise_answer: clNoiseAnswer });
    };

    const updateAnswerInput = (inputsEl) => {
        const { answers } = finalState;
        // the idea is:
        //   - get all inputs from MyEditor
        //   - convert answers to object
        //   - find answer by id and push it to newAnswers array
        //   - if answer does not exist, create new one with default content
        //   - update final state with newAnswers array
        //   - this will update the state with current answers based on the filled inputs in MyEditor

        const objectAnswer = objectHandler.toObject(answers, "id");
        const newAnswers: TAnswerItem[] = [];

        inputsEl.forEach((inputEl) => {
            const id = Number(inputEl.getAttribute(DATA_ID_FILLING_INPUT));
            const isExist = Boolean(objectAnswer?.[id]);
            if (isExist) {
                newAnswers.push(objectAnswer[id]);
            } else {
                newAnswers.push({
                    id: id,
                    content: [
                        {
                            id: numberHandler.random(0, 1000000),
                            value: "",
                        },
                    ],
                });
            }
        });
        setNewAnswer(newAnswers);
    };

    useEffect(() => {
        finalOnChange({ ...finalState, answers: newAnswer });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newAnswer]);

    useEffect(() => {
        setNewValue(questionContent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        changeContentQuestion(newValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newValue]);

    useEffect(() => {
        changeContentQuestion(questionContent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionContent]);

    const handleExplanationChange = (val: string, idx: number) => {
        const newExplanation = [...explanation];
        newExplanation[idx] = val;
        finalOnChange({ ...finalState, explanation: newExplanation });
    };

    const handleMultipleChange = (checked: boolean) => {
        finalOnChange({
            ...finalState,
            multiple: checked
                ? QUESTION_MULTIPLE_TYPE.enable
                : QUESTION_MULTIPLE_TYPE.disable,
        });
    };

    const handleCloneableChange = (checked: boolean) => {
        finalOnChange({
            ...finalState,
            cloneable: checked
                ? QUESTION_CLONEABLE_TYPE.enable
                : QUESTION_CLONEABLE_TYPE.disable,
        });
    };
    const handleDraggableChange = (checked: boolean) => {
        finalOnChange({
            ...finalState,
            draggable: checked
                ? QUESTION_DRAGABLE_TYPE.enable
                : QUESTION_DRAGABLE_TYPE.disable,
        });
    };
    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 ">
                        <p className="text-blue-600 flex-1 font-semibold">
                            Câu {order}.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Kéo thả tự do
                                    </span>
                                    <MyTooltip title="Cho phép kéo thả đáp án vào vùng content">
                                        <div
                                            className={
                                                viewMode
                                                    ? "cursor-not-allowed"
                                                    : ""
                                            }
                                        >
                                            <Switch
                                                checked={
                                                    draggable ===
                                                    QUESTION_DRAGABLE_TYPE.enable
                                                }
                                                onChange={handleDraggableChange}
                                                disabled={viewMode}
                                            />
                                        </div>
                                    </MyTooltip>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Cloneable
                                    </span>
                                    <MyTooltip title="Cho phép 1 đáp án có thể kéo thả ở nhiều vị trí">
                                        <div
                                            className={
                                                viewMode
                                                    ? "cursor-not-allowed"
                                                    : ""
                                            }
                                        >
                                            <Switch
                                                checked={
                                                    cloneable ===
                                                    QUESTION_CLONEABLE_TYPE.enable
                                                }
                                                onChange={handleCloneableChange}
                                                disabled={viewMode}
                                            />
                                        </div>
                                    </MyTooltip>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Multiple
                                    </span>
                                    <MyTooltip title="Tính điểm cho từng đáp án đúng của câu hỏi">
                                        <div
                                            className={
                                                viewMode
                                                    ? "cursor-not-allowed"
                                                    : ""
                                            }
                                        >
                                            <Switch
                                                checked={
                                                    multiple ===
                                                    QUESTION_MULTIPLE_TYPE.enable
                                                }
                                                onChange={handleMultipleChange}
                                                disabled={viewMode}
                                            />
                                        </div>
                                    </MyTooltip>
                                </div>
                            </div>
                            {!viewMode && (
                                <MyTooltip title="Xoá">
                                    <MyRawButton
                                        onClick={() => {
                                            const hasFilledValue = Boolean(
                                                finalState?.questionContent ||
                                                finalState?.answers?.some(
                                                    (answer) =>
                                                        Boolean(
                                                            answer?.content,
                                                        ),
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
                    </div>
                    <MyEditor
                        ref={editorRef}
                        showAddInput
                        readOnly={viewMode}
                        value={newValue}
                        onChange={(value) => {
                            setNewValue(value);
                        }}
                        onFillingInputUpdate={updateAnswerInput}
                    />
                </div>
                <div className="flex flex-col gap-4 mt-2">
                    {answers?.map((question, index) => {
                        const { content, id } = question;
                        return (
                            <div
                                key={id}
                                className="flex flex-col items-start gap-2"
                            >
                                <p className="text-base text-black-700 font-bold">
                                    Đáp án câu {index + 1}
                                </p>
                                <div className="flex flex-col gap-4 w-full bg-blue-50 p-4 rounded-md">
                                    <div className="flex-flex-col gap-2">
                                        <p className="text-sm text-gray-600 font-semibold mb-2">
                                            Đáp án đúng
                                        </p>
                                        <MyMultipleAnswer
                                            viewMode={viewMode}
                                            answers={content.map((item) => ({
                                                id: item.id,
                                                content: item.value,
                                            }))}
                                            onRemoveAnswer={(contentId) =>
                                                removeSubAnswer(id, contentId)
                                            }
                                            onAddAnswers={() =>
                                                addSubAnswer(id)
                                            }
                                            onChangeAnswer={(
                                                contentId,
                                                value,
                                            ) =>
                                                changeAnswerContent(
                                                    value,
                                                    contentId,
                                                    id,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-gray-600 font-semibold">
                                            Giải thích đáp án (nếu có)
                                        </p>
                                        <MyEditor
                                            readOnly={viewMode}
                                            value={explanation[index] || ""}
                                            onChange={(val) =>
                                                handleExplanationChange(
                                                    val,
                                                    index,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md text-gray-600">
                            Đáp án gây nhiễu
                        </h3>
                        {!viewMode && (
                            <MyButton
                                type="primary"
                                size="middle"
                                onClick={() => {
                                    const newNoiseAnswer = [...noise_answer];
                                    newNoiseAnswer.push({
                                        id: numberHandler.random(0, 100000),
                                        content: [
                                            {
                                                id: numberHandler.random(
                                                    0,
                                                    100000,
                                                ),
                                                value: "",
                                            },
                                        ],
                                    });
                                    finalOnChange({
                                        ...finalState,
                                        noise_answer: newNoiseAnswer,
                                    });
                                }}
                            >
                                Thêm đáp án gây nhiễu
                            </MyButton>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        {noise_answer?.map((question, index) => {
                            const { content, id } = question;
                            return (
                                <div
                                    key={id}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Đáp án gây nhiễu ${
                                            index + 1
                                        }`}
                                        value={content[0]?.value || ""}
                                        onChange={(e) =>
                                            changeNoiseAnswerContent(
                                                e.target.value,
                                                content[0]?.id,
                                                id,
                                            )
                                        }
                                        readOnly={viewMode}
                                    />
                                    {!viewMode && (
                                        <button
                                            onClick={() => {
                                                const newNoiseAnswer =
                                                    noise_answer.filter(
                                                        (item) =>
                                                            item.id !== id,
                                                    );
                                                finalOnChange({
                                                    ...finalState,
                                                    noise_answer:
                                                        newNoiseAnswer,
                                                });
                                            }}
                                            className="px-3 py-2 border rounded hover:bg-gray-100 text-gray-500 hover:text-red-500"
                                        >
                                            <RiDeleteBin6Line size={20} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {!viewMode && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1"></div>
                            </div>
                        )}
                    </div>
                    {noise_answer?.length === 0 && !viewMode && (
                        <p className="text-red-500 text-sm mt-2">
                            Vui lòng nhập nội dung cho tất cả đáp án gây nhiễu
                        </p>
                    )}
                </div>
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

export default MyQuestionConfigDrag;
