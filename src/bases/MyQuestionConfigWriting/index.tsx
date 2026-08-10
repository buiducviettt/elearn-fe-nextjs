"use client";
import { useCallback, useEffect, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import MyFormItem from "../MyFormItem";
import MyInputNumber from "../MyInputNumber";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyRawButton from "../MyRawButton";
import MyTooltip from "../MyTooltip";
import MyEditor from "../MyEditor";
import { Tabs, Spin, Select } from "antd";
import {
    EditOutlined,
    CheckCircleOutlined,
    BookOutlined,
} from "@ant-design/icons";
import MyUploadMultipleTypeHasApi from "../MyUploadMultipleType/MyUploadMultipleTypeHasApi";
import MyUploadImgHasApi from "../MyUploadImg/MyUploadImgHasApi";

type TState = {
    ready?: number;
    todo?: number;
    title: string;
    description?: string;
    category?: string;
    answer: string;
    file?: string;
    explanation?: string;
    outline?: string;
};

export type TMyAnswerConfigWritingProps = {
    value?: TState;
    onChange?: (value: TState) => void;
    onRemove?: () => void;
    order: number;
    isSubmitted?: boolean;
    viewMode?: boolean;
};

const MyQuestionConfigWriting: React.FC<TMyAnswerConfigWritingProps> = (
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
        category: "task-1",
        outline: "",
    });

    useEffect(() => {
        if (value) {
            setCurrentQuestions((prev) => ({
                ...prev,
                ...value,
                category: value.category ?? "task-1",
            }));
        }
    }, [value]);

    const finalState = {
        ...currentQuestions,
        ...value,
        category: value?.category ?? currentQuestions.category ?? "task-1",
    };

    const finalOnChange = useCallback(
        (newValue: TState) => {
            if (onChange) {
                onChange(newValue);
            } else {
                setCurrentQuestions(newValue);
            }
        },
        [onChange]
    );

    const {
        ready,
        todo,
        title,
        description,
        file,
        answer,
        explanation,
        category,
        outline,
    } = finalState || {};

    const showError = isSubmitted && !title?.trim();

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

    const changeFile = useCallback(
        (newFile: string) => {
            finalOnChange({ ...finalState, file: newFile });
        },
        [finalOnChange, finalState]
    );

    const changeAnswers = useCallback(
        (newAnswers: string) => {
            finalOnChange({ ...finalState, answer: newAnswers });
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

    const changeOutline = useCallback(
        (newOutline: string) => {
            finalOnChange({ ...finalState, outline: newOutline });
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
                                value={category ?? "task-1"}
                                defaultValue="task-1"
                                onChange={changeCategory}
                                options={[
                                    { label: "Task 1", value: "task-1" },
                                    { label: "Task 2", value: "task-2" },
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
                            ...(category === "task-2"
                                ? []
                                : [
                                      {
                                          key: "file",
                                          label: (
                                              <span>
                                                  <EditOutlined
                                                      style={{ marginRight: 4 }}
                                                  />
                                                  <span>Ảnh đính kèm</span>
                                              </span>
                                          ),
                                          children: (
                                              <Spin spinning={loadingTab}>
                                                  <MyUploadImgHasApi
                                                      disabled={viewMode}
                                                      value={file}
                                                      onChange={changeFile}
                                                  />
                                              </Spin>
                                          ),
                                      },
                                  ]),
                            {
                                key: "description",
                                label: (
                                    <span>
                                        <EditOutlined
                                            style={{ marginRight: 4 }}
                                        />
                                        <span>Nội dung</span>
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
                                        <MyEditor
                                            readOnly={viewMode}
                                            value={answer}
                                            onChange={changeAnswers}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: "explanation",
                                label: (
                                    <span>
                                        <BookOutlined
                                            style={{ marginRight: 4 }}
                                        />
                                        <span>Lời giải chi tiết</span>
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loadingTab}>
                                        <MyEditor
                                            readOnly={viewMode}
                                            value={explanation}
                                            onChange={changeExplanation}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: "outline",
                                label: (
                                    <span>
                                        <EditOutlined
                                            style={{ marginRight: 4 }}
                                        />
                                        <span>Dàn ý chi tiết</span>
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loadingTab}>
                                        <MyEditor
                                            readOnly={viewMode}
                                            value={outline}
                                            onChange={changeOutline}
                                        />
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

export default MyQuestionConfigWriting;
