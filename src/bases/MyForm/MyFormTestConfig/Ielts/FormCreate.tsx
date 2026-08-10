import MyCard from "@/bases/MyCard";
import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectCreateIeltsType from "@/bases/MyGroupSelect/MyGroupSelectCreateIeltsType";
import MyInput from "@/bases/MyInput";
import MyTableSelectQuestion from "@/bases/MyTableSelectQuestion";
import {
    CREATE_IELTS_TYPE,
    EXAM_STRUCTURE,
    RDOM_STRUCTURE,
    QUESTION_CATEGORIES,
    TEST_MODE,
} from "@/types/enum";
import { TQuestionGetDetailResponse, TBaseResponse } from "@/types/response";
import toastHandler from "@/utils/toastHandler";
import { useState } from "react";
import CreateNew from "./CreateNew";
import { formRequired } from "@/constants/common";
import { Modal, Button } from "antd";
import styles from "../style.module.scss";
import { EyeOutlined } from "@ant-design/icons";
import MyTooltip from "@/bases/MyTooltip";
import MyIconButton from "@/bases/MyIconButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { questionService } from "@/services/question";
import { TQuestionGet } from "@/types/service-get";
import MyItemQuestionGroup from "@/bases/MyItemQuestionGroup";
import {
    getExamConfigConverterToClient,
    getQuestionConfigComponent,
} from "@/utils/common";
import { taxonomyService } from "@/services/taxonomy";
import React from "react";
import { useWatch } from "antd/es/form/Form";

interface FormCreateProps {
    structureAdd: (
        defaultValue?: any,
        insertIndex?: number | undefined,
    ) => void;
    structureFields: any;
    form: any;
    onSelectCreateType?: (type: CREATE_IELTS_TYPE) => void;
    disableAddNew?: boolean;
}

const FormCreate = ({
    structureAdd,
    structureFields,
    form,
    onSelectCreateType,
    disableAddNew = false,
}: FormCreateProps) => {
    const questionnaireSystem = useWatch(["questionnaire_system"], form);

    const [title, setTitle] = useState("");
    const [createType, setCreateType] = useState<CREATE_IELTS_TYPE | undefined>(
        CREATE_IELTS_TYPE.from_already_exist,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configInfo, setConfigInfo] = useState<any>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewQuestions, setPreviewQuestions] = useState<
        TQuestionGetDetailResponse[]
    >([]);

    const { mutate: fetchPreviewQuestions, isPending: isPreviewLoading } =
        useMutation({
            mutationFn: (data: TQuestionGet) => questionService.get(data),
            onSuccess: (response) => {
                const questions = response?.payload?.data?.list || [];
                if (questions.length > 0) {
                    setPreviewQuestions(questions);
                    setIsPreviewModalOpen(true);
                } else {
                    toastHandler.warning("Không tìm thấy câu hỏi nào");
                }
            },
            onError: () => {
                toastHandler.error("Có lỗi xảy ra khi lấy câu hỏi ngẫu nhiên");
            },
        });

    const { data: levelData } = useQuery({
        queryKey: [taxonomyService.keyGet, QUESTION_CATEGORIES.question_level],
        queryFn: () =>
            taxonomyService.get({
                taxonomy: QUESTION_CATEGORIES.question_level,
                per_page: 9999,
            }),
        select: (data) => data.payload.data.list,
    });

    const { data: skillData } = useQuery({
        queryKey: [taxonomyService.keyGet, QUESTION_CATEGORIES.question_skill],
        queryFn: () =>
            taxonomyService.get({
                taxonomy: QUESTION_CATEGORIES.question_skill,
                per_page: 9999,
            }),
        select: (data) => data.payload.data.list,
    });

    const { data: categoryData } = useQuery({
        queryKey: [
            taxonomyService.keyGet,
            QUESTION_CATEGORIES.question_category,
        ],
        queryFn: () =>
            taxonomyService.get({
                taxonomy: QUESTION_CATEGORIES.question_category,
                per_page: 9999,
            }),
        select: (data) => data.payload.data.list,
    });

    const { data: partData } = useQuery({
        queryKey: [taxonomyService.keyGet, QUESTION_CATEGORIES.question_part],
        queryFn: () =>
            taxonomyService.get({
                taxonomy: QUESTION_CATEGORIES.question_part,
                per_page: 9999,
            }),
        select: (data) => data.payload.data.list,
    });

    const getLevelName = (id: string) => {
        return levelData?.find((item) => item.id === id)?.name || id;
    };

    const getSkillName = (id: string) => {
        return skillData?.find((item) => item.id === id)?.name || id;
    };

    const getCategoryName = (id: string) => {
        return categoryData?.find((item) => item.id === id)?.name || id;
    };

    const getPartName = (id: string) => {
        return partData?.find((item) => item.id === id)?.name || id;
    };

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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setConfigInfo(null);
    };

    const showPreviewModal = (config: any) => {
        if (config?.number) {
            fetchPreviewQuestions({
                type: EXAM_STRUCTURE.single,
                random: RDOM_STRUCTURE.disable,
                per_page: config.number,
                level: config.question_level,
                skill: config.question_skill,
                category: config.question_category,
                part: config.question_part,
            });
        }
    };

    const handlePreviewOk = () => {
        setIsPreviewModalOpen(false);
        setPreviewQuestions([]);
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalOpen(false);
        setPreviewQuestions([]);
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div
                    className="flex flex-col p-6 bg-white rounded-xs"
                    style={
                        disableAddNew
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                    }
                >
                    <MyFormItem label="Tên nhóm bài tập" rules={[formRequired]}>
                        <MyInput
                            placeholder="Nhập tên nhóm bài tập"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.currentTarget.value)
                            }
                        />
                    </MyFormItem>
                    <MyGroupSelectCreateIeltsType
                        value={createType}
                        onChange={(value) => {
                            setCreateType(value);
                            setConfigInfo(null);
                            if (value === CREATE_IELTS_TYPE.create_from_part) {
                                onSelectCreateType?.(value);
                                return;
                            }
                            showModal();
                        }}
                        excludeTypes={
                            questionnaireSystem === TEST_MODE.yes
                                ? [CREATE_IELTS_TYPE.create_from_part]
                                : []
                        }
                    />
                </div>

                {/* Display created question groups */}
                {structureFields?.map((field, index) => {
                    const structure = form?.getFieldValue(
                        "questionnaire_structure",
                    )?.[index];
                    const {
                        questions = [],
                        title = "",
                        config = null,
                    } = structure || {};

                    return (
                        <React.Fragment key={field.key}>
                            {config?.number ? (
                                <div className="bg-white flex p-6 bg-white rounded-xs">
                                    <div className="flex-1">
                                        <p className="font-semibold mb-2 text-lg">
                                            Thông tin câu hỏi random: {title}
                                        </p>
                                        <p className="flex gap-4">
                                            {config.number && (
                                                <span>
                                                    <span className="font-semibold">
                                                        Số câu hỏi:
                                                    </span>{" "}
                                                    {config.number}
                                                </span>
                                            )}
                                            {config.question_level && (
                                                <span>
                                                    <span className="font-semibold">
                                                        Độ khó:
                                                    </span>{" "}
                                                    {getLevelName(
                                                        config.question_level,
                                                    )}
                                                </span>
                                            )}
                                            {config.question_skill && (
                                                <span>
                                                    <span className="font-semibold">
                                                        Kỹ năng:
                                                    </span>{" "}
                                                    {getSkillName(
                                                        config.question_skill,
                                                    )}
                                                </span>
                                            )}
                                            {config.question_category && (
                                                <span>
                                                    <span className="font-semibold">
                                                        Danh mục:
                                                    </span>{" "}
                                                    {getCategoryName(
                                                        config.question_category,
                                                    )}
                                                </span>
                                            )}
                                            {config.question_part && (
                                                <span>
                                                    <span className="font-semibold">
                                                        Phần:
                                                    </span>{" "}
                                                    {getPartName(
                                                        config.question_part,
                                                    )}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <MyTooltip title="Xem thử">
                                        <Button
                                            type="text"
                                            icon={<EyeOutlined />}
                                            onClick={() => {
                                                setPreviewQuestions([]);
                                                showPreviewModal(config);
                                            }}
                                            loading={isPreviewLoading}
                                            className="text-white hover:text-white !border !border-black !border-solid rounded-md cursor-pointer"
                                            style={{ padding: "11px" }}
                                        />
                                    </MyTooltip>
                                </div>
                            ) : null}
                        </React.Fragment>
                    );
                })}
            </div>

            <Modal
                className={styles.modalContent}
                width="100%"
                title="Tạo nhóm bài tập"
                open={isModalOpen}
                onCancel={handleCancel}
                centered={true}
                footer={null}
            >
                <div className="flex flex-col gap-4">
                    {createType === CREATE_IELTS_TYPE.from_already_exist && (
                        <MyTableSelectQuestion
                            existingQuestionIds={getExistingQuestionIds()}
                            questionnaireSkillType={form.getFieldValue(
                                "questionnaire_skill",
                            )}
                            disableSkill
                            onConfirm={(questions) => {
                                toastHandler.success(
                                    `Đã tạo thành công ${questions.length} câu hỏi`,
                                );

                                const currentStructure =
                                    form?.getFieldValue(
                                        "questionnaire_structure",
                                    ) || [];
                                structureAdd({
                                    title: title,
                                    questions: questions.map(
                                        (item: any) => item.question_id,
                                    ),
                                    config: null,
                                });
                                setTitle("");
                                handleCancel();
                            }}
                        />
                    )}
                    {createType === CREATE_IELTS_TYPE.create_new && (
                        <CreateNew
                            onGenerate={(questionIds) => {
                                toastHandler.success(
                                    `Đã tạo thành công ${questionIds.length} câu hỏi`,
                                );
                                structureAdd({
                                    title: title,
                                    questions: questionIds,
                                    config: null,
                                });
                                setTitle("");
                                handleCancel();
                            }}
                            questionnaireSkillType={form.getFieldValue(
                                "questionnaire_skill",
                            )}
                        />
                    )}
                </div>
            </Modal>

            <Modal
                title="Xem trước câu hỏi"
                open={isPreviewModalOpen}
                onOk={handlePreviewOk}
                onCancel={handlePreviewCancel}
                width={1000}
            >
                <div className="flex flex-col gap-4">
                    {previewQuestions.map((question, index) => {
                        const { question_items = [], question_type } = question;
                        return (
                            <MyCard
                                key={question.question_id}
                                title={
                                    <div className="flex gap-2 items-center">
                                        <p>
                                            Câu {index + 1}.{" "}
                                            {question.question_title}
                                        </p>
                                    </div>
                                }
                            >
                                <div className="flex flex-col gap-3">
                                    {question_items.map((item, itemIndex) => {
                                        const { type } = item;
                                        const converter =
                                            getExamConfigConverterToClient(
                                                type,
                                            );
                                        const QuestionConfigComponent =
                                            getQuestionConfigComponent(type);
                                        if (QuestionConfigComponent) {
                                            return (
                                                <QuestionConfigComponent
                                                    viewMode
                                                    value={converter(item)}
                                                    order={itemIndex + 1}
                                                    key={item.id}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </MyCard>
                        );
                    })}
                </div>
            </Modal>
        </>
    );
};

export default FormCreate;
