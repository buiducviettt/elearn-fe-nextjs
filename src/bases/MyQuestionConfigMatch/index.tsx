import { QUESTION_TYPES, QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import { useRef, useState, useEffect } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { TbArrowsExchange } from "react-icons/tb";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyQuestionItemAdd from "../MyQuestionItemAdd";
import MyRawButton from "../MyRawButton";
import MyTooltip from "../MyTooltip";
import InputType from "./InputType";
import { INIT_DATA_MATCH } from "./utils";
import { Switch } from "antd";

export type TType = "text" | "image";

type TMatchItem = {
    type: TType;
    content: string;
};

type TValue = {
    type: QUESTION_TYPES.match_words_images;
    values: [TMatchItem[], TMatchItem[]][];
    multiple?: QUESTION_MULTIPLE_TYPE;
};

export type TMyQuestionConfigMatchProps = {
    value?: TValue;
    viewMode?: boolean;
    order: number;
    onChange?: (value: TValue) => void;
    onClickRemove?: () => void;
};

const MyQuestionConfigMatch: React.FC<TMyQuestionConfigMatchProps> = (
    props
) => {
    const { value, onChange, order, onClickRemove, viewMode = false } = props;

    const indexAnswerNeedDeleting = useRef(0);
    const [insideValue, setInsideValue] = useState<TValue>({
        ...(INIT_DATA_MATCH as TValue),
        multiple: QUESTION_MULTIPLE_TYPE.disable,
    });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmDeleteAnswer, setShowConfirmDeleteAnswer] =
        useState(false);

    useEffect(() => {
        if (value?.multiple !== undefined) {
            setInsideValue((prev) => ({
                ...prev,
                multiple: value.multiple,
            }));
        }
    }, [value?.multiple]);

    const finalValue = value || insideValue;
    const finalChange = (onChange || setInsideValue) as (value: TValue) => void;

    const { values = [], multiple = QUESTION_MULTIPLE_TYPE.disable } =
        finalValue;

    const handleMultipleChange = (checked: boolean) => {
        const newValue = {
            ...finalValue,
            multiple: checked
                ? QUESTION_MULTIPLE_TYPE.enable
                : QUESTION_MULTIPLE_TYPE.disable,
        };
        console.log("New multiple value:", newValue.multiple);
        finalChange(newValue);
    };

    const handleAddAnswer = () => {
        finalChange({
            ...finalValue,
            values: [
                ...values,
                [
                    [{ type: "text", content: "" }],
                    [{ type: "text", content: "" }],
                ],
            ],
        });
    };

    const changeFirstValue = (value: TMatchItem, index: number) => {
        const newValues = values.map((item, i) => {
            if (i === index) {
                return [[value], item[1]] as [TMatchItem[], TMatchItem[]];
            }
            return item;
        });

        finalChange({
            ...finalValue,
            values: newValues,
        });
    };

    const changeSecondValue = (value: TMatchItem, index: number) => {
        const newValues = values.map((item, i) => {
            if (i === index) {
                return [item[0], [value]] as [TMatchItem[], TMatchItem[]];
            }
            return item;
        });

        finalChange({
            ...finalValue,
            values: newValues,
        });
    };

    const handleRemoveAnswer = (index: number) => {
        finalChange({
            ...finalValue,
            values: values.filter((_, i) => i !== index),
        });
    };

    const name = `Câu ${order}`;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <p className="text-blue-600 flex-1 font-semibold">{name}</p>
                    {!viewMode && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Multiple
                                </span>
                                <MyTooltip title="Tính điểm cho từng đáp án đúng của câu hỏi">
                                    <Switch
                                        checked={
                                            multiple ===
                                            QUESTION_MULTIPLE_TYPE.enable
                                        }
                                        onChange={handleMultipleChange}
                                    />
                                </MyTooltip>
                            </div>
                            <MyTooltip title="Xoá">
                                <MyRawButton
                                    onClick={() => {
                                        const hasFilledValue =
                                            values.length > 0;
                                        if (hasFilledValue) {
                                            setShowConfirmDelete(true);
                                        } else {
                                            onClickRemove?.();
                                        }
                                    }}
                                    className="text-red-500 bg-red-50 p-1 rounded-md"
                                >
                                    <RiDeleteBin7Line size={18} />
                                </MyRawButton>
                            </MyTooltip>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 flex-col">
                    {values.map((value, index) => {
                        const isFilled = value.some((arr) =>
                            arr.some((item) => item.content)
                        );
                        return (
                            <div
                                key={index}
                                className="flex relative gap-2 items-center"
                            >
                                {!viewMode && (
                                    <MyTooltip title="Xoá">
                                        <MyRawButton
                                            onClick={() => {
                                                if (isFilled) {
                                                    setShowConfirmDeleteAnswer(
                                                        true
                                                    );
                                                    indexAnswerNeedDeleting.current =
                                                        index;
                                                    return;
                                                }
                                                handleRemoveAnswer(index);
                                            }}
                                            className="absolute p-1 bg-slate-100 rounded-md z-20 right-1 top-1"
                                        >
                                            <LiaTimesSolid
                                                size={18}
                                                className="text-gray-600"
                                            />
                                        </MyRawButton>
                                    </MyTooltip>
                                )}
                                <InputType
                                    viewMode={viewMode}
                                    value={value[0][0]}
                                    onChange={(data) =>
                                        changeFirstValue(data, index)
                                    }
                                />
                                <TbArrowsExchange
                                    className="flex-shrink-0"
                                    size={24}
                                />
                                <InputType
                                    viewMode={viewMode}
                                    value={value[1][0]}
                                    onChange={(data) =>
                                        changeSecondValue(data, index)
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
                {!viewMode && (
                    <MyQuestionItemAdd onClick={handleAddAnswer}>
                        Thêm đáp án
                    </MyQuestionItemAdd>
                )}
            </div>
            <MyModalDelete
                destroyOnHidden
                open={showConfirmDelete}
                setOpen={setShowConfirmDelete}
                onOk={onClickRemove}
                message={`Bạn có chắc chắn muốn xoá ${name} ?`}
            />
            <MyModalDelete
                message={`Bạn có chắc chắn muốn xoá đáp án này ?`}
                open={showConfirmDeleteAnswer}
                setOpen={setShowConfirmDeleteAnswer}
                destroyOnHidden
                onOk={() => {
                    handleRemoveAnswer(indexAnswerNeedDeleting.current);
                    setShowConfirmDeleteAnswer(false);
                    indexAnswerNeedDeleting.current = 0;
                }}
            />
        </div>
    );
};

export default MyQuestionConfigMatch;
