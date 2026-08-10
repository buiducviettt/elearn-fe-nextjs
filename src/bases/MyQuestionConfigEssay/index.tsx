import { QUESTION_TYPES } from "@/types/enum";
import { useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import MyFormItem from "../MyFormItem";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyRawButton from "../MyRawButton";
import MyTextArea from "../MyTextArea";
import MyTooltip from "../MyTooltip";

type TValue = {
    type: QUESTION_TYPES.spell;
    content: string;
};
export type TMyQuestionConfigEssayProps = {
    value?: TValue;
    viewMode?: boolean;
    order: number;
    onChange?: (value: TValue) => void;
    onClickRemove?: () => void;
};

const MyQuestionConfigEssay: React.FC<TMyQuestionConfigEssayProps> = (
    props
) => {
    const { value, onChange, order, onClickRemove, viewMode = false } = props;
    const [insideValue, setInsideValue] = useState<TValue>({
        content: "",
        type: QUESTION_TYPES.spell,
    });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const finalValue = value || insideValue;
    const { content } = finalValue;
    const finalChange = (onChange || setInsideValue) as (value: TValue) => void;
    const name = `Câu ${order}`;

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <p className="flex-1 font-semibold text-blue-600">
                        {name}.
                    </p>
                    <div className="flex gap-2">
                        {!viewMode && (
                            <MyTooltip title="Xoá">
                                <MyRawButton
                                    onClick={() => {
                                        if (finalValue) {
                                            // show confirm first
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
                        )}
                    </div>
                </div>
                <MyFormItem style={{ margin: 0 }}>
                    <MyTextArea
                        disabled={viewMode}
                        value={content}
                        onChange={(e) =>
                            finalChange({
                                ...finalValue,
                                content: e.target.value,
                            })
                        }
                    />
                </MyFormItem>
            </div>
            <MyModalDelete
                destroyOnHidden
                open={showConfirmDelete}
                setOpen={setShowConfirmDelete}
                onOk={onClickRemove}
                message={`Bạn có chắc chắn muốn xoá ${name} ?`}
            />
        </>
    );
};

export default MyQuestionConfigEssay;
