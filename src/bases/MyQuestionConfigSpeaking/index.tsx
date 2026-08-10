"use client";
import { useCallback, useEffect, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import MyFormItem from "../MyFormItem";
import MyInputNumber from "../MyInputNumber";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyRawButton from "../MyRawButton";
import MyTooltip from "../MyTooltip";
import MyEditor from "../MyEditor";

import { Tabs, Spin, Select, Radio } from "antd";
import {
    EditOutlined,
    CheckCircleOutlined,
    BookOutlined,
    AudioOutlined,
} from "@ant-design/icons";
import MyUploadAudioHasApi from "../MyUploadAudio/MyUploadAudioHasApi";
import MyUploadAudioVideoHasApi from "../MyUploadAudioVideo/MyUploadAudioVideoHasApi";
import MySelect from "../MySelect";

type TState = {
    ready?: number;
    todo?: number;
    title: string;
    description?: string;
    answer: string;
    file?: string;
    category?: string;
    explanation?: string;
};

export type TMyAnswerConfigSpeakingProps = {
    value?: TState;
    onChange?: (value: TState) => void;
    onRemove?: () => void;
    order: number;
    isSubmitted?: boolean;
    viewMode?: boolean;
};

const MyQuestionConfigSpeaking: React.FC<TMyAnswerConfigSpeakingProps> = (
    props
) => {
    const { value, onChange, order, onRemove, isSubmitted, viewMode } = props;

    const [openConfirmRemove, setOpenConfirmRemove] = useState<boolean>(false);

    const [currentQuestions, setCurrentQuestions] = useState<TState>({
        ready: undefined,
        todo: undefined,
        title: "",
        description: "",
        answer: "",
        file: "",
        explanation: "",
        category: "part-1",
    });
    useEffect(() => {
        if (value) {
            setCurrentQuestions((prev) => ({
                ...prev,
                ...value,
                category: value.category ?? "part-1", // Nếu chưa có thì set mặc định
            }));
        }
    }, [value]);
    const finalState = {
        ...currentQuestions,
        ...value,
        category: value?.category ?? currentQuestions.category ?? "part-1", // luôn có mặc định
    };
    const finalOnChange = onChange || setCurrentQuestions;

    const {
        ready,
        todo,
        title,
        description,
        category,
        answer,
        file,
        explanation,
    } = finalState || {};

    const showError = isSubmitted && !title?.trim();
    const [answerType, setAnswerType] = useState<"both" | "audio" | "text">(
        "both"
    );

    const changeReady = useCallback(
        (seconds: number | undefined) => {
            finalOnChange({ ...finalState, ready: seconds });
        },
        [finalOnChange, finalState]
    );

    const changeTodo = useCallback(
        (seconds: number | undefined) => {
            finalOnChange({ ...finalState, todo: seconds });
        },
        [finalOnChange, finalState]
    );

    const changeTitle = useCallback(
        (newTitle: string) => {
            finalOnChange({ ...finalState, title: newTitle });
        },
        [finalOnChange, finalState]
    );

    const changeDescription = useCallback(
        (newDescription: string) => {
            finalOnChange({ ...finalState, description: newDescription });
        },
        [finalOnChange, finalState]
    );

    const changeAnswer = useCallback(
        (newAnswer: string) => {
            finalOnChange({ ...finalState, answer: newAnswer });
        },
        [finalOnChange, finalState]
    );
    const changeFile = useCallback(
        (newFile: string) => {
            finalOnChange({ ...finalState, file: newFile });
        },
        [finalOnChange, finalState]
    );

    const changeExplanation = useCallback(
        (newExplanation: string) => {
            finalOnChange({ ...finalState, explanation: newExplanation });
        },
        [finalOnChange, finalState]
    );

    const changeCategory = useCallback(
        (newCategory: string) => {
            finalOnChange({ ...finalState, category: newCategory });
        },
        [finalOnChange, finalState]
    );

    // Tab & loading state
    const [activeTab, setActiveTab] = useState<string>("description");
    const [loadingTab, setLoadingTab] = useState<boolean>(false);

    const handleTabChange = (key: string) => {
        if (key !== activeTab) {
            setLoadingTab(true);
            setTimeout(() => {
                setActiveTab(key);
                setLoadingTab(false);
            }, 350);
        }
    };

    return (
        <>
            <div className="flex flex-col">
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
                                            ready || todo || title
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

                    <MyFormItem
                        label="Tiêu đề câu hỏi"
                        required
                        style={{ marginBottom: 8 }}
                        validateStatus={showError ? "error" : ""}
                        help={showError ? "Vui lòng nhập tiêu đề câu hỏi" : ""}
                    >
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md ${
                                showError ? "border-red-500" : ""
                            }`}
                            value={title}
                            onChange={(e) => changeTitle(e.target.value)}
                            placeholder="Nhập tiêu đề câu hỏi"
                            required
                            disabled={viewMode}
                        />
                    </MyFormItem>

                    <div className="grid grid-cols-3 gap-4">
                        <MyFormItem
                            required
                            label="Chọn phần"
                            style={{ flex: 1, marginBottom: 0 }}
                        >
                            <Select
                                value={category}
                                defaultValue={category || "part-1"}
                                onChange={changeCategory}
                                options={[
                                    { label: "Part 1", value: "part-1" },
                                    { label: "Part 2", value: "part-2" },
                                    { label: "Part 3", value: "part-3" },
                                ]}
                                placeholder="Chọn phần"
                                disabled={viewMode}
                            />
                        </MyFormItem>
                        <MyFormItem
                            label="Thời gian chuẩn bị"
                            style={{ flex: 1, marginBottom: 0 }}
                        >
                            <MyInputNumber
                                className="!w-full"
                                suffix="Giây"
                                value={ready}
                                step={1}
                                min={0}
                                placeholder="Nhập vào thời gian (giây)"
                                onChange={(value) => {
                                    changeReady(value as number);
                                }}
                                disabled={viewMode}
                            />
                        </MyFormItem>
                        <MyFormItem
                            label="Thời gian thực hiện"
                            style={{ flex: 1, marginBottom: 0 }}
                        >
                            <MyInputNumber
                                className="!w-full"
                                step={1}
                                min={1}
                                onChange={(value) => {
                                    changeTodo(value as number);
                                }}
                                suffix="Giây"
                                value={todo}
                                placeholder="Nhập vào thời gian (giây)"
                                disabled={viewMode}
                            />
                        </MyFormItem>
                    </div>

                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        className="mb-2 custom-writing-tabs"
                        items={[
                            {
                                key: "description",
                                label: (
                                    <span>
                                        <EditOutlined
                                            style={{ marginRight: 4 }}
                                        />
                                        <span>Nội dung </span>
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loadingTab}>
                                        <MyEditor
                                            readOnly={viewMode}
                                            value={description}
                                            onChange={changeDescription}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: "file",
                                label: (
                                    <span>
                                        <AudioOutlined
                                            style={{ marginRight: 4 }}
                                        />
                                        <span>Audio câu hỏi</span>
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loadingTab}>
                                        <MyFormItem label="Upload file audio">
                                            <MyUploadAudioHasApi
                                                disabled={viewMode}
                                                value={file}
                                                onChange={changeFile}
                                            />
                                        </MyFormItem>
                                    </Spin>
                                ),
                            },
                            {
                                key: "answer",
                                label: (
                                    <span>
                                        <CheckCircleOutlined
                                            style={{ marginRight: 4 }}
                                        />
                                        <span>Câu trả lời mẫu</span>
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loadingTab}>
                                        <MyFormItem label="Upload file audio">
                                            <MyUploadAudioHasApi
                                                disabled={viewMode}
                                                value={answer}
                                                onChange={changeAnswer}
                                            />
                                        </MyFormItem>
                                        <MyFormItem label="Đoạn văn trả lời mẫu">
                                            <MyEditor
                                                readOnly={viewMode}
                                                value={explanation}
                                                onChange={changeExplanation}
                                            />
                                        </MyFormItem>
                                    </Spin>
                                ),
                            },
                        ]}
                    />
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

export default MyQuestionConfigSpeaking;
