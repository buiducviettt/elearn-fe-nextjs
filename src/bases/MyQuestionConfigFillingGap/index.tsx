"use client";
import numberHandler from "@/utils/numberHandler";
import objectHandler from "@/utils/objectHandler";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import MyEditor, { DATA_ID_FILLING_INPUT, TMyEditorRef } from "../MyEditor";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyMultipleAnswer from "../MyMultipleAnswer";
import MyRawButton from "../MyRawButton";
import MyTooltip from "../MyTooltip";
import { Switch } from "antd";
import { QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import MyInput from "../MyInput";

type TAnswerItem = {
    id: number;
    content: {
        id: number;
        value: string;
    }[];
};

type TState = {
    answers: TAnswerItem[];
    noise_answer: string[][]; // đổi sang mảng 2 chiều
    questionContent: string;
    explanation: string[]; // mảng giải thích tương ứng từng đáp án
    multiple: QUESTION_MULTIPLE_TYPE;
};

export type TMyQuestionConfigFillingGapProps = {
    value?: TState;
    viewMode?: boolean;
    onChange?: (value: TState) => void;
    order: number;
    onRemove?: () => void;
};

const MyQuestionConfigFillingGap: React.FC<TMyQuestionConfigFillingGapProps> = (
    props,
) => {
    const { value, onChange, order, onRemove, viewMode = false } = props;
    const editorRef = useRef<TMyEditorRef>(null);

    const [newAnswer, setNewAnswer] = useState<TAnswerItem[]>([]);
    // Mỗi đáp án 1 noise string, dùng để binding input
    const [noiseAnswer, setNoiseAnswer] = useState<string[]>([]);

    const [openConfirmRemove, setOpenConfirmRemove] = useState<boolean>(false);
    const [newValue, setNewValue] = useState("");

    const [currentQuestions, setCurrentQuestions] = useState<TState>({
        answers: [],
        noise_answer: [],
        questionContent: "",
        explanation: [],
        multiple: QUESTION_MULTIPLE_TYPE.disable,
    });

    const finalState = value || currentQuestions;
    const finalOnChange = onChange || setCurrentQuestions;

    const {
        answers = [],
        noise_answer = [],
        questionContent = "",
        explanation = [],
        multiple = QUESTION_MULTIPLE_TYPE.disable,
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
    };

    const removeSubAnswer = (answerId: number, contentId: number) => {
        const clAnswer = [...answers];
        const index = clAnswer.findIndex((q) => q.id === answerId);
        clAnswer[index].content = clAnswer[index].content.filter(
            (c) => c.id !== contentId,
        );
        setNewAnswer(clAnswer);
    };

    const updateAnswerInput = (inputsEl) => {
        const objectAnswer = objectHandler.toObject(answers, "id");
        const newAnswers: TAnswerItem[] = [];

        inputsEl.forEach((inputEl) => {
            const id = Number(inputEl.getAttribute(DATA_ID_FILLING_INPUT));
            // Nếu đã có đáp án cũ thì giữ lại content cũ
            if (objectAnswer[id]) {
                newAnswers.push(objectAnswer[id]);
            } else {
                // Nếu là ô mới thì tạo mới
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

    const handleMultipleChange = (checked: boolean) => {
        finalOnChange({
            ...finalState,
            multiple: checked
                ? QUESTION_MULTIPLE_TYPE.enable
                : QUESTION_MULTIPLE_TYPE.disable,
        });
    };

    const handleExplanationChange = (val: string, idx: number) => {
        const newExplanation = [...explanation];
        newExplanation[idx] = val;
        finalOnChange({ ...finalState, explanation: newExplanation });
    };

    // Xử lý noise answer cho từng đáp án
    const handleNoiseAnswerChange = (value: string, idx: number) => {
        const newNoise = [...noiseAnswer];
        newNoise[idx] = value;
        setNoiseAnswer(newNoise);

        // Cập nhật vào state chính, tách chuỗi thành mảng
        finalOnChange({
            ...finalState,
            noise_answer: newNoise.map((str) =>
                str
                    .split("/")
                    .map((s) => s.trim())
                    .filter(Boolean),
            ),
        });
    };

    useEffect(() => {
        finalOnChange({ ...finalState, answers: newAnswer });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newAnswer]);

    useEffect(() => {
        setNewValue(questionContent);
        // Khởi tạo noiseAnswer từ props nếu có
        setNoiseAnswer((noise_answer || []).map((arr) => arr.join(" / ")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        changeContentQuestion(newValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newValue]);

    // Nếu số lượng đáp án thay đổi thì đồng bộ noiseAnswer
    useEffect(() => {
        setNoiseAnswer((prev) => {
            const arr = [...prev];
            while (arr.length < answers.length) arr.push("");
            if (arr.length > answers.length) arr.length = answers.length;
            return arr;
        });
    }, [answers.length]);

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <p className="text-blue-600 flex-1 font-semibold">
                            Câu {order}.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Multiple
                                </span>
                                <MyTooltip title="Tính điểm cho từng đáp án đúng của câu hỏi">
                                    <div
                                        className={
                                            viewMode ? "cursor-not-allowed" : ""
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
                                    <div className="flex-flex-col gap-2">
                                        <p className="text-sm text-gray-600 font-semibold mb-2">
                                            Danh sách các tùy chọn (gây nhiễu)
                                            VD: A / B / C / D
                                        </p>
                                        <MyInput
                                            placeholder="Nhập các đáp án, cách nhau bằng dấu /"
                                            value={noiseAnswer[index] || ""}
                                            onChange={(e) =>
                                                handleNoiseAnswerChange(
                                                    e.target.value,
                                                    index,
                                                )
                                            }
                                            disabled={viewMode}
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

export default MyQuestionConfigFillingGap;
