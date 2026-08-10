import MyCard from "@/bases/MyCard";
import { Tabs } from "antd";
import MyFormItem from "@/bases/MyFormItem";
import MyIconButton from "@/bases/MyIconButton";
import MyInput from "@/bases/MyInput";
import MyTooltip from "@/bases/MyTooltip";
import MyEditor, { TMyEditorRef } from "../../../MyEditor";
import { formRequired, PAGE_SIZE } from "@/constants/common";
import { EXAM_SKILL, TEST_MODE } from "@/types/enum";
import toastHandler from "@/utils/toastHandler";
import numberHandler from "@/utils/numberHandler";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { useRef } from "react";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Form, Modal } from "antd";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { TMyFormProps } from "../..";
import FormCreate from "./FormCreate";
import ModalAddQuestionToPart from "./ModalAddQuestionToPart";
import ModalDeleteStructure from "./ModalDeleteStructure";
import QuestionSection from "./QuestionSection";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import TestListSelect from "./TestListSelect";
import { CREATE_IELTS_TYPE } from "@/types/enum";
import { useWatch } from "antd/es/form/Form";
import MyUploadAudioHasApi from "@/bases/MyUploadAudio/MyUploadAudioHasApi";
import TranslationSection from "./TranslationSection";

type TProps = {
    form: TMyFormProps["form"];
    questionnaireSkillType?: string;
};

type TQuestionSectionProps = {
    indexQuestion: number;
    indexStructure: number;
    form: any;
    id: string;
    collapsed: boolean;
    isIelts?: boolean;
};

const PartQuestionItem = (props) => {
    const {
        structureField,
        structure,
        addQuestionToStructure,
        id,
        collapsed,
        structureRemove,
        indexStructure,
        form,
        questionnaireSystem,
        questions,
        existingQuestionIds,
        questionnaireSkillType,
    } = props;
    const [activeTab, setActiveTab] = useState("questionnaire_content");

    const [dragging, setDragging] = useState(false);
    const [collapsedState, setCollapsedState] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: id });

    const splitContentToSentencesAndWords = (content: string) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const paragraphs: string[][][] = [];
        tempDiv.querySelectorAll("p, h1, h2, h3, h4, h5, div").forEach((el) => {
            // Tách đoạn theo <br>
            const parts = el.innerHTML.split(/<br\s*\/?\>/i);
            parts.forEach((part) => {
                // Sử dụng textContent để loại bỏ thẻ HTML
                const tempSpan = document.createElement("span");
                tempSpan.innerHTML = part;
                const text =
                    tempSpan.textContent?.replace(/&nbsp;/g, " ").trim() || "";
                if (text) {
                    const sentenceRegex = /[^.!?]+[.!?]?/g;
                    const sentences = text.match(sentenceRegex) || [];
                    const sentenceWordsArr = sentences.map((sentence) => {
                        const words = sentence
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean);
                        return words;
                    });
                    if (sentenceWordsArr.length)
                        paragraphs.push(sentenceWordsArr);
                }
            });
        });
        return paragraphs;
    };
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (structure?.config) {
        return null;
    }
    // console.log("questionnaireSkillType:", questionnaireSkillType);
    // console.log("EXAM_SKILL.reading:", EXAM_SKILL.reading);
    return (
        <div className="relative" ref={setNodeRef} style={style}>
            <RxDragHandleDots2
                size={25}
                className=" cursor-pointer flex-shrink-0 rounded-md absolute top-1  z-10 left-[50%] rotate-90 text-gray-800 "
                {...attributes}
                {...listeners}
            />

            <MyCard
                title={
                    <MyFormItem
                        label={
                            <>
                                Nhập tên nhóm bài tập{"  "}
                                <DownOutlined
                                    className="cursor-pointer rounded-md flex-shrink-0 ml-auto w-6 h-6 flex items-center justify-center"
                                    size={14}
                                    onClick={() =>
                                        setCollapsedState((prev) => !prev)
                                    }
                                    rotate={collapsedState ? 0 : 180}
                                />
                            </>
                        }
                        rules={[formRequired]}
                        name={[structureField.name, "title"]}
                        style={{ marginRight: 46, marginTop: 16 }}
                    >
                        <MyInput placeholder="Vui lòng nhập tên nhóm bài tập" />
                    </MyFormItem>
                }
                style={{
                    borderColor: "#dcdcdc",
                }}
                styles={{
                    body: {
                        display: !collapsedState
                            ? !collapsed
                                ? "block"
                                : "none"
                            : "none",
                    },
                }}
                extra={
                    <div className="flex gap-2" style={{ paddingTop: "19px" }}>
                        <ModalAddQuestionToPart
                            addQuestionToStructure={addQuestionToStructure}
                            existingQuestionIds={existingQuestionIds}
                        >
                            {({ setOpen }) => (
                                <MyTooltip title="Thêm câu hỏi">
                                    <MyIconButton
                                        onClick={() => setOpen(true)}
                                        icon="ADD"
                                        color="GREEN"
                                        style={{ padding: "11px" }}
                                    />
                                </MyTooltip>
                            )}
                        </ModalAddQuestionToPart>
                        <ModalDeleteStructure
                            onDelete={() => structureRemove(indexStructure)}
                        >
                            {({ setOpen }) => {
                                return (
                                    <MyTooltip title="Xoá câu hỏi">
                                        <MyIconButton
                                            onClick={() => setOpen(true)}
                                            icon="DELETE"
                                            color="RED"
                                            style={{ padding: "11px" }}
                                        />
                                    </MyTooltip>
                                );
                            }}
                        </ModalDeleteStructure>
                    </div>
                }
            >
                {questionnaireSkillType === EXAM_SKILL.listening && (
                    <>
                        <MyFormItem
                            name={[structureField.name, "transcript_audio"]}
                        >
                            <p className="text-base font-semibold mb-4">
                                Transcript Audio
                            </p>
                            <MyUploadAudioHasApi
                                value={structure?.transcript_audio || ""}
                                onChange={(value) => {
                                    const questionnaireStructure =
                                        form?.getFieldValue(
                                            "questionnaire_structure",
                                        );
                                    questionnaireStructure[indexStructure] = {
                                        ...questionnaireStructure[
                                        indexStructure
                                        ],
                                        transcript_audio: value,
                                    };
                                    form?.setFieldValue(
                                        "questionnaire_structure",
                                        questionnaireStructure,
                                    );
                                }}
                            />
                        </MyFormItem>
                        <MyFormItem name={[structureField.name, "transcript"]}>
                            <p className="text-base font-semibold mb-4">
                                Transcript
                            </p>
                            <MyEditor
                                height={600}
                                value={structure?.transcript || ""}
                                showAddInput={true}
                                showHighlight={true}
                                questions={questions}
                                onFillingInputUpdate={(
                                    fillingInputs,
                                ) => {
                                    const questionnaireStructure =
                                        form?.getFieldValue(
                                            "questionnaire_structure",
                                        );
                                    const answers =
                                        fillingInputs.map(
                                            (input) => {
                                                const inputNumber =
                                                    input.innerHTML;
                                                return {
                                                    id: inputNumber
                                                        ? parseInt(
                                                            inputNumber,
                                                        )
                                                        : numberHandler.random(
                                                            0,
                                                            1000000,
                                                        ),
                                                    content:
                                                        [
                                                            {
                                                                id: numberHandler.random(
                                                                    0,
                                                                    1000000,
                                                                ),
                                                                value: "",
                                                            },
                                                        ],
                                                };
                                            },
                                        );

                                    questionnaireStructure[
                                        indexStructure
                                    ] = {
                                        ...questionnaireStructure[
                                        indexStructure
                                        ],
                                        fillingInputs:
                                            fillingInputs.length,
                                        answers:
                                            answers,
                                    };
                                    form?.setFieldValue(
                                        "questionnaire_structure",
                                        questionnaireStructure,
                                    );
                                }}
                                onChange={(value) => {
                                    const questionnaireStructure =
                                        form?.getFieldValue(
                                            "questionnaire_structure",
                                        );
                                    questionnaireStructure[indexStructure] = {
                                        ...questionnaireStructure[
                                        indexStructure
                                        ],
                                        transcript: value,
                                    };
                                    form?.setFieldValue(
                                        "questionnaire_structure",
                                        questionnaireStructure,
                                    );
                                }}
                            />
                        </MyFormItem>
                    </>
                )}

                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="flex flex-col gap-4 p-1">
                            {questionnaireSkillType === EXAM_SKILL.reading && (
                                <div className="flex-1">
                                    <p className="text-base font-semibold mb-4">
                                        Nhập nội dung bài đọc
                                    </p>
                                    <Tabs
                                        activeKey={activeTab}
                                        onChange={setActiveTab}
                                        defaultActiveKey="questionnaire_content"
                                        items={[
                                            {
                                                key: "questionnaire_content",
                                                label: "Nội dung",
                                                children: (
                                                    <MyEditor
                                                        height={300}
                                                        value={
                                                            structure?.content ||
                                                            ""
                                                        }
                                                        showAddInput={true}
                                                        showHighlight={true}
                                                        questions={questions}
                                                        onFillingInputUpdate={(
                                                            fillingInputs,
                                                        ) => {
                                                            const questionnaireStructure =
                                                                form?.getFieldValue(
                                                                    "questionnaire_structure",
                                                                );
                                                            const answers =
                                                                fillingInputs.map(
                                                                    (input) => {
                                                                        const inputNumber =
                                                                            input.innerHTML;
                                                                        return {
                                                                            id: inputNumber
                                                                                ? parseInt(
                                                                                    inputNumber,
                                                                                )
                                                                                : numberHandler.random(
                                                                                    0,
                                                                                    1000000,
                                                                                ),
                                                                            content:
                                                                                [
                                                                                    {
                                                                                        id: numberHandler.random(
                                                                                            0,
                                                                                            1000000,
                                                                                        ),
                                                                                        value: "",
                                                                                    },
                                                                                ],
                                                                        };
                                                                    },
                                                                );

                                                            questionnaireStructure[
                                                                indexStructure
                                                            ] = {
                                                                ...questionnaireStructure[
                                                                indexStructure
                                                                ],
                                                                fillingInputs:
                                                                    fillingInputs.length,
                                                                answers:
                                                                    answers,
                                                            };
                                                            form?.setFieldValue(
                                                                "questionnaire_structure",
                                                                questionnaireStructure,
                                                            );
                                                        }}
                                                        onChange={(value) => {
                                                            const questionnaireStructure =
                                                                form?.getFieldValue(
                                                                    "questionnaire_structure",
                                                                );
                                                            questionnaireStructure[
                                                                indexStructure
                                                            ] = {
                                                                ...questionnaireStructure[
                                                                indexStructure
                                                                ],
                                                                content: value,
                                                            };
                                                            form?.setFieldValue(
                                                                "questionnaire_structure",
                                                                questionnaireStructure,
                                                            );
                                                        }}
                                                    />
                                                ),
                                            },
                                            {
                                                key: "content",
                                                label: "Bản dịch",
                                                children: (
                                                    <TranslationSection
                                                        structure={structure}
                                                        indexStructure={
                                                            indexStructure
                                                        }
                                                        form={form}
                                                        splitContentToSentencesAndWords={
                                                            splitContentToSentencesAndWords
                                                        }
                                                    />
                                                ),
                                            },
                                        ]}
                                    />
                                </div>
                            )}
                            <div className={"flex-1"}>
                                <p className="text-base font-semibold mb-4">
                                    Danh sách câu hỏi
                                </p>
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragStart={() => {
                                        setDragging(true);
                                    }}
                                    onDragEnd={(event) => {
                                        setDragging(false);

                                        const { active, over } = event;
                                        const questionnaireStructure =
                                            form?.getFieldValue(
                                                "questionnaire_structure",
                                            );
                                        const questionnaireStructureItem =
                                            questionnaireStructure[
                                            indexStructure
                                            ];

                                        if (!over || active.id === over.id)
                                            return;

                                        const oldIndex = questions.findIndex(
                                            (f) => f === active.id,
                                        );
                                        const newIndex = questions.findIndex(
                                            (f) => f === over.id,
                                        );
                                        const arrangedQuestions = arrayMove(
                                            questions,
                                            oldIndex,
                                            newIndex,
                                        );
                                        questionnaireStructureItem.questions =
                                            arrangedQuestions;

                                        form?.setFieldValue(
                                            "questionnaire_structure",
                                            questionnaireStructure,
                                        );
                                    }}
                                >
                                    <div className="flex flex-col gap-3">
                                        <SortableContext
                                            items={questions.map(
                                                (ques) => ques,
                                            )}
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >
                                            {questions.map(
                                                (ques, indexQuestion) => {
                                                    return (
                                                        <QuestionSection
                                                            indexQuestion={
                                                                indexQuestion
                                                            }
                                                            indexStructure={
                                                                indexStructure
                                                            }
                                                            form={form}
                                                            id={ques}
                                                            collapsed={dragging}
                                                            key={ques}
                                                            isIelts={true}
                                                        />
                                                    );
                                                },
                                            )}
                                        </SortableContext>
                                    </div>
                                </DndContext>
                            </div>
                        </div>
                    </motion.div>
                )}
            </MyCard>
        </div>
    );
};

const Ielts: React.FC<TProps> = ({ form, questionnaireSkillType }) => {
    const [dragging, setDragging] = useState<boolean>(false);
    const [isTestListModalOpen, setIsTestListModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("content");

    const [createType, setCreateType] = useState<
        CREATE_IELTS_TYPE | undefined
    >();
    const questionnaireSystem = useWatch(["questionnaire_system"], form);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    useEffect(() => {
        const currentStructure =
            form?.getFieldValue("questionnaire_structure") || [];
        // Kiểm tra điều kiện chuyển đổi và số nhóm bài tập
        if (
            questionnaireSystem === TEST_MODE.yes &&
            currentStructure.length >= 2
        ) {
            setShowConfirmDeleteModal(true);
            // Ngăn không cho chuyển sang TEST_MODE.yes ngay lập tức
            form?.setFieldValue("questionnaire_system", TEST_MODE.no);
        }
    }, [questionnaireSystem]);

    useEffect(() => {
        if (!form?.getFieldValue("questionnaire_structure")) {
            form?.setFieldValue("questionnaire_structure", []);
        }
    }, [form]);

    // Lấy danh sách tất cả câu hỏi đã có trong form
    const getExistingQuestionIds = () => {
        const currentStructure =
            form?.getFieldValue("questionnaire_structure") || [];
        const existingIds: string[] = [];

        currentStructure.forEach((structure: any) => {
            if (structure?.questions) {
                existingIds.push(...structure.questions);
            }
        });

        return existingIds;
    };

    const currentStructure =
        form?.getFieldValue("questionnaire_structure") || [];
    const addedIds = currentStructure.map(
        (item) =>
            item?.id ||
            item?.questionnaire_id ||
            item?.questionnaire_structure_id,
    );
    return (
        <div className="flex flex-col gap-3">
            <Modal
                open={showConfirmDeleteModal}
                onCancel={() => {
                    setShowConfirmDeleteModal(false);
                    // Không chuyển sang TEST_MODE.yes nếu hủy
                    form?.setFieldValue("questionnaire_system", TEST_MODE.no);
                }}
                onOk={() => {
                    form?.setFieldValue("questionnaire_structure", []);
                    setShowConfirmDeleteModal(false);
                    form?.setFieldValue("questionnaire_system", TEST_MODE.yes);
                    toastHandler.success("Đã xóa toàn bộ nhóm bài tập!");
                }}
                title="Xác nhận chuyển đổi Kỹ năng bộ đề"
                centered
            >
                <p>
                    Khi chuyển sang chế độ kỹ năng bộ đề, toàn bộ nhóm bài tập
                    hiện tại sẽ bị xóa. Bạn có chắc chắn muốn tiếp tục?
                </p>
            </Modal>
            <Modal
                open={isTestListModalOpen}
                onCancel={() => setIsTestListModalOpen(false)}
                footer={null}
                width={900}
                title="Chọn nhóm bài tập lẻ từ danh sách"
            >
                <TestListSelect
                    form={form}
                    addedIds={addedIds}
                    onAdd={(selectedStructures, newSelectedTests) => {
                        form?.setFieldValue("questionnaire_structure", [
                            ...currentStructure,
                            ...selectedStructures,
                        ]);
                        setIsTestListModalOpen(false);
                    }}
                    questionnaireSkillType={questionnaireSkillType}
                />
            </Modal>
            <Form.List name="questionnaire_structure">
                {(
                    structureFields,
                    {
                        add: structureAdd,
                        remove: structureRemove,
                        move: structureMove,
                    },
                ) => {
                    return (
                        <div className="flex flex-col gap-3">
                            <FormCreate
                                structureAdd={structureAdd}
                                structureFields={structureFields}
                                form={form}
                                disableAddNew={
                                    questionnaireSystem === TEST_MODE.yes &&
                                    currentStructure.length >= 1
                                }
                                onSelectCreateType={(
                                    type: CREATE_IELTS_TYPE,
                                ) => {
                                    setCreateType(type);
                                    if (
                                        type ===
                                        CREATE_IELTS_TYPE.create_from_part
                                    ) {
                                        setIsTestListModalOpen(true);
                                    }
                                }}
                            />
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragStart={() => {
                                    setDragging(true);
                                }}
                                onDragEnd={(event) => {
                                    setDragging(false);
                                    const { active, over } = event;

                                    if (!over || active.id === over.id) return;

                                    const oldIndex = structureFields.findIndex(
                                        (f) => f.key === active.id,
                                    );
                                    const newIndex = structureFields.findIndex(
                                        (f) => f.key === over.id,
                                    );
                                    structureMove(oldIndex, newIndex);
                                }}
                            >
                                <SortableContext
                                    items={structureFields.map(
                                        (structure) => structure.key,
                                    )}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {structureFields.map(
                                        (structureField, indexStructure) => {
                                            const structure =
                                                form?.getFieldValue(
                                                    "questionnaire_structure",
                                                )[indexStructure];
                                            const { questions = [] } =
                                                structure || {};

                                            const addQuestionToStructure = (
                                                questionIds: string[],
                                            ) => {
                                                try {
                                                    const clQuestionnaireStructure =
                                                        form?.getFieldValue(
                                                            "questionnaire_structure",
                                                        );

                                                    clQuestionnaireStructure[
                                                        indexStructure
                                                    ] = {
                                                        ...clQuestionnaireStructure[
                                                        indexStructure
                                                        ],
                                                        questions: [
                                                            ...(clQuestionnaireStructure[
                                                                indexStructure
                                                            ].questions || []),
                                                            ...questionIds,
                                                        ],
                                                    };

                                                    form?.setFieldValue(
                                                        "questionnaire_structure",
                                                        clQuestionnaireStructure,
                                                    );
                                                    toastHandler.success(
                                                        `Đã thêm ${questionIds.length} câu hỏi `,
                                                    );
                                                } catch {
                                                    toastHandler.error(
                                                        "Thêm câu hỏi thất bại!",
                                                    );
                                                }
                                            };

                                            return (
                                                <PartQuestionItem
                                                    structureAdd={structureAdd}
                                                    key={structureField.key}
                                                    id={structureField.key}
                                                    collapsed={dragging}
                                                    questionnaireSystem={
                                                        questionnaireSystem
                                                    }
                                                    addQuestionToStructure={
                                                        addQuestionToStructure
                                                    }
                                                    structureField={
                                                        structureField
                                                    }
                                                    structure={structure}
                                                    structureRemove={
                                                        structureRemove
                                                    }
                                                    indexStructure={
                                                        indexStructure
                                                    }
                                                    form={form}
                                                    questions={questions}
                                                    existingQuestionIds={getExistingQuestionIds()}
                                                    questionnaireSkillType={
                                                        questionnaireSkillType
                                                    }
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                />
                                            );
                                        },
                                    )}
                                </SortableContext>
                            </DndContext>
                        </div>
                    );
                }}
            </Form.List>
        </div>
    );
};

export default Ielts;
