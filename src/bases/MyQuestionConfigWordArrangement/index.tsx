import numberHandler from "@/utils/numberHandler";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import MyButton from "../MyButton";
import MyInput from "../MyInput";
import MyModalDelete from "../MyModal/MyModalDelete";
import MyRawButton from "../MyRawButton";
import MyTooltip from "../MyTooltip";

type TValue = {
    correctSentence: string[];
    showSentence: {
        id: number;
        content: string;
    }[];
};

export type TMyQuestionConfigWordArrangementProps = {
    order: number;
    value?: TValue;
    viewMode?: boolean;
    onClickRemove?: () => void;
    onChange?: (value: TValue) => void;
};

export const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-md shadow-md"
        >
            {children}
        </div>
    );
};

const MyQuestionConfigWordArrangement: React.FC<
    TMyQuestionConfigWordArrangementProps
> = (props) => {
    const { value, onChange, order, onClickRemove, viewMode } = props;

    const touchedRef = useRef<boolean>(false); // check where use arranged the words or not ?

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [insideValue, setInsideValue] = useState<TValue>({
        correctSentence: [],
        showSentence: [],
    });

    const finalValue = value || insideValue;

    const finalOnchange: (value: TValue) => void = onChange || setInsideValue;
    const { correctSentence = [], showSentence = [] } = finalValue || {};

    const [text, setText] = useState<string>(correctSentence.join("/"));

    const name = `Câu ${order}`;

    const setShowSentence = (newValues: TValue["showSentence"]) => {
        finalOnchange({
            ...finalValue,
            showSentence: newValues,
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!touchedRef.current) touchedRef.current = true;

        if (active.id !== over.id) {
            const oldIndex = showSentence.findIndex(
                (word) => word.id === active.id
            );
            const newIndex = showSentence.findIndex(
                (word) => word.id === over.id
            );
            const newWords = arrayMove(showSentence, oldIndex, newIndex);
            setShowSentence(newWords);
        }
    };

    return (
        <div className="flex flex-col gap-2 ">
            <div className="flex gap-2 items-center">
                <p className="flex-1 font-semibold text-blue-600">{name}.</p>
                <div className="flex gap-2">
                    {!viewMode && (
                        <MyTooltip title="Xoá">
                            <MyRawButton
                                onClick={() => {
                                    if (touchedRef.current) {
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

            <div className="flex gap-2">
                <MyInput
                    placeholder="Nhập nội dung các từ cách nhau bằng dấu '/'"
                    disabled={viewMode}
                    value={text}
                    onChange={(e) => {
                        const newText = e.target.value;
                        setText(newText);
                        const words = newText
                            .split("/")
                            .filter((word) => word.trim());
                        touchedRef.current = false; // reset as we've just created the new correctSentence
                        finalOnchange({
                            ...finalValue,
                            correctSentence: words,
                            showSentence: words.map((word) => ({
                                id: numberHandler.random(0, 10000000),
                                content: word,
                            })),
                        });
                    }}
                />
            </div>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    disabled={viewMode}
                    items={showSentence}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="bg-gray-50 flex-col rounded-lg p-4  flex  space-y-2">
                        <p className="text-sm text-gray-600">
                            {showSentence.length !== 0
                                ? "Học viên nhìn thấy"
                                : `Nhập nội dung các từ cách nhau bằng dấu "/" ví dụ: Happy/new year/2025`}
                        </p>
                        <div className="flex overflow-x-auto space-x-2">
                            {showSentence.map((word) => (
                                <SortableItem key={word.id} id={word.id}>
                                    {word.content}
                                </SortableItem>
                            ))}
                        </div>
                    </div>
                </SortableContext>
            </DndContext>
            <MyModalDelete
                destroyOnHidden
                open={showConfirmDelete}
                setOpen={setShowConfirmDelete}
                onOk={onClickRemove}
                message={`Bạn có chắc chắn muốn xoá ${name} ?`}
            />
        </div>
    );
};

export default MyQuestionConfigWordArrangement;
