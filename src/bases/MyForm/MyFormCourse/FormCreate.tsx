"use client";

import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectCreateCourseType from "@/bases/MyGroupSelect/MyGroupSelectCreateCourseType";
import MyIconButton from "@/bases/MyIconButton";
import MyInput from "@/bases/MyInput";
import MyTooltip from "@/bases/MyTooltip";
import { CREATE_COURSE_TYPE } from "@/types/enum";
import { TCourseItemLesson } from "@/types/service-get";
import React, { useState, useRef, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleDots2 } from "react-icons/rx";
import MyEditor from "@/bases/MyEditor";
import ModalEditLessonItem from "../../../app/(main)/course/components/Modal-Lesson/ModalEditLessonItem";
import ModalDeleteLessonItem from "../../../app/(main)/course/components/Modal-Lesson/ModalDeleteLessonItem";
import toastHandler from "@/utils/toastHandler";
import MyTableSelectLesson from "./MyTableSelectLesson";
import MyFormLesson from "../MyFormLesson";
import MyModal from "@/bases/MyModal";
// ─── FormCreate ────────────────────────────────────────────────────────────────
export interface FormCreateProps {
    structureAdd: (
        defaultValue?: any,
        insertIndex?: number | undefined,
    ) => void;
    structureFields: any[];
    onSelectCreateType?: (type: CREATE_COURSE_TYPE) => void;
    structureRemove: (index: number) => void;
    form: any;
}

// Sortable lesson item component
type SortableLessonProps = {
    id: string;
    lesson: any;
    form: any;
    onUpdated?: (updated: TCourseItemLesson) => void;
};

const SortableLesson: React.FC<SortableLessonProps> = ({
    id,
    lesson,
    form,
    onUpdated,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    } as React.CSSProperties;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 bg-gray-100 border border-gray-200 py-2 px-3 rounded"
        >
            <RxDragHandleDots2
                size={20}
                className=" cursor-pointer flex-shrink-0 text-gray-600"
                {...attributes}
                {...listeners}
            />
            <p className="flex-1 font-medium text-sm">{lesson.title}</p>
            <div className="flex gap-2">
                <ModalEditLessonItem data={lesson} onUpdated={onUpdated}>
                    {({ setOpen }) => (
                        <MyTooltip title="Chỉnh sửa">
                            <MyIconButton
                                onClick={() => setOpen(true)}
                                color="BLUE"
                                icon="EDIT"
                            />
                        </MyTooltip>
                    )}
                </ModalEditLessonItem>

                <ModalDeleteLessonItem
                    id={Number(lesson.id)}
                    title={lesson.title}
                >
                    {({ setOpen }) => (
                        <MyTooltip title="Xoá">
                            <MyIconButton
                                onClick={() => setOpen(true)}
                                color="RED"
                                icon="DELETE"
                            />
                        </MyTooltip>
                    )}
                </ModalDeleteLessonItem>
            </div>
        </div>
    );
};

const FormCreate: React.FC<FormCreateProps> = ({
    structureAdd,
    structureFields,
    onSelectCreateType,
    structureRemove,
    form,
}) => {
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterSummary, setChapterSummary] = useState("");

    const [createType, setCreateType] = useState<
        CREATE_COURSE_TYPE | undefined
    >(undefined);
    const modalSetOpenRef = useRef<React.Dispatch<
        React.SetStateAction<boolean>
    > | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectLessonModalIndex, setSelectLessonModalIndex] = useState<
        number | null
    >(null);
    const [isSelectLessonModalOpen, setIsSelectLessonModalOpen] =
        useState(false);
    const [configInfo, setConfigInfo] = useState<any>(null);
    const allExistingLessonIds: string[] = (
        form?.getFieldValue("structure") || []
    ).flatMap((ch: any) => (ch?.lesson || []).map((l: any) => String(l.id)));

    const addChapter = (lessons: TCourseItemLesson[]) => {
        structureAdd({
            chapter: chapterTitle,
            summary: chapterSummary,
            lesson: lessons,
        });
        setChapterTitle("");
        setChapterSummary("");
        setCreateType(undefined);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setConfigInfo(null);
    };
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border">
                    <p className="font-semibold text-base">Thêm chương mới</p>
                    <div className="flex flex-col gap-3 border p-4 rounded-lg">
                        <MyFormItem label="Tên chương">
                            <MyInput
                                placeholder="Nhập tên chương"
                                value={chapterTitle}
                                onChange={(e) =>
                                    setChapterTitle(e.target.value)
                                }
                            />
                        </MyFormItem>
                        <MyFormItem label="Tóm tắt chương">
                            <MyEditor
                                value={chapterSummary}
                                onChange={(value) => setChapterSummary(value)}
                            />
                        </MyFormItem>
                        <MyGroupSelectCreateCourseType
                            value={createType}
                            onChange={(value) => {
                                setCreateType(value);
                                setConfigInfo(null);
                                showModal();
                                if (value !== undefined) {
                                    onSelectCreateType?.(value);
                                }
                            }}
                        />
                    </div>
                </div>

                {structureFields?.map((field, index) => {
                    const chapter = form?.getFieldValue("structure")?.[index];
                    const {
                        chapter: chapterName = "",
                        summary = "",
                        lesson = [],
                    } = chapter || {};
                    return (
                        <div
                            key={field.key}
                            className="bg-white p-4 rounded-lg flex flex-col gap-3 border"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <MyFormItem
                                    label="Tên chương"
                                    required
                                    className="flex-1"
                                >
                                    <MyInput
                                        placeholder="Nhập tên chương"
                                        value={chapterName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const structure =
                                                form.getFieldValue(
                                                    "structure",
                                                ) || [];
                                            structure[index] = {
                                                ...(structure[index] || {}),
                                                chapter: value,
                                            };
                                            form.setFieldsValue({ structure });
                                        }}
                                    />
                                </MyFormItem>
                                <div className="flex gap-2">
                                    <MyTooltip title="Thêm bài học">
                                        <MyIconButton
                                            onClick={() => {
                                                setSelectLessonModalIndex(
                                                    index,
                                                );
                                                setIsSelectLessonModalOpen(
                                                    true,
                                                );
                                            }}
                                            color="GREEN"
                                            icon="ADD"
                                        />
                                    </MyTooltip>
                                    <MyTooltip title="Xoá chương">
                                        <MyIconButton
                                            onClick={() =>
                                                structureRemove(index)
                                            }
                                            color="RED"
                                            icon="DELETE"
                                        />
                                    </MyTooltip>
                                </div>
                            </div>
                            <MyFormItem label="Tóm tắt chương">
                                <MyEditor
                                    value={summary}
                                    onChange={(v) => {
                                        const structure =
                                            form.getFieldValue("structure") ||
                                            [];
                                        structure[index] = {
                                            ...(structure[index] || {}),
                                            summary: v,
                                        };
                                        form.setFieldsValue({ structure });
                                    }}
                                />
                            </MyFormItem>
                            {lesson.length > 0 && (
                                <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-lg">
                                    <p className="font-semibold text-base">
                                        Danh sách bài học
                                    </p>
                                    <DndContext
                                        collisionDetection={closestCenter}
                                        onDragEnd={(event) => {
                                            const { active, over } = event;
                                            if (!over) return;
                                            const activeId = String(active.id);
                                            const overId = String(over.id);
                                            const currentStructure =
                                                form.getFieldValue(
                                                    "structure",
                                                ) || [];
                                            const idx = index;
                                            const target = currentStructure[
                                                idx
                                            ] || { lesson: [] };
                                            const items = Array.isArray(
                                                target.lesson,
                                            )
                                                ? [...target.lesson]
                                                : [];
                                            const oldIndex = items.findIndex(
                                                (it) =>
                                                    String(it.id) === activeId,
                                            );
                                            const newIndex = items.findIndex(
                                                (it) =>
                                                    String(it.id) === overId,
                                            );
                                            if (
                                                oldIndex === -1 ||
                                                newIndex === -1
                                            )
                                                return;
                                            const item = items.splice(
                                                oldIndex,
                                                1,
                                            )[0];
                                            items.splice(newIndex, 0, item);
                                            currentStructure[idx] = {
                                                ...target,
                                                lesson: items,
                                            };
                                            form.setFieldsValue({
                                                structure: currentStructure,
                                            });
                                        }}
                                    >
                                        <SortableContext
                                            items={lesson.map((l: any) =>
                                                String(
                                                    l && l.id !== undefined
                                                        ? l.id
                                                        : l,
                                                ),
                                            )}
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >
                                            {lesson.map(
                                                (l: any, li: number) => {
                                                    return (
                                                        <SortableLesson
                                                            key={String(
                                                                l &&
                                                                    l.id !==
                                                                        undefined
                                                                    ? l.id
                                                                    : l,
                                                            )}
                                                            id={String(
                                                                l &&
                                                                    l.id !==
                                                                        undefined
                                                                    ? l.id
                                                                    : l,
                                                            )}
                                                            lesson={l}
                                                            form={form}
                                                            onUpdated={(
                                                                updated,
                                                            ) => {
                                                                const currentStructure =
                                                                    form.getFieldValue(
                                                                        "structure",
                                                                    ) || [];
                                                                const idx =
                                                                    index;
                                                                const target =
                                                                    currentStructure[
                                                                        idx
                                                                    ] || {
                                                                        lesson: [],
                                                                    };
                                                                const items =
                                                                    Array.isArray(
                                                                        target.lesson,
                                                                    )
                                                                        ? [
                                                                              ...target.lesson,
                                                                          ]
                                                                        : [];
                                                                const foundIndex =
                                                                    items.findIndex(
                                                                        (it) =>
                                                                            String(
                                                                                it &&
                                                                                    it.id
                                                                                    ? it.id
                                                                                    : it,
                                                                            ) ===
                                                                            String(
                                                                                updated.id,
                                                                            ),
                                                                    );
                                                                if (
                                                                    foundIndex !==
                                                                    -1
                                                                )
                                                                    items[
                                                                        foundIndex
                                                                    ] = updated;
                                                                else
                                                                    items.push(
                                                                        updated,
                                                                    );
                                                                currentStructure[
                                                                    idx
                                                                ] = {
                                                                    ...target,
                                                                    lesson: items,
                                                                };
                                                                form.setFieldsValue(
                                                                    {
                                                                        structure:
                                                                            currentStructure,
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    );
                                                },
                                            )}
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <MyModal
                width="100%"
                open={isModalOpen}
                title={
                    createType === CREATE_COURSE_TYPE.create_new
                        ? "Tạo mới bài học"
                        : "Chọn bài học có sẵn"
                }
                onCancel={handleCancel}
                centered={true}
                footer={null}
            >
                <div className="flex flex-col gap-4">
                    {createType === CREATE_COURSE_TYPE.from_already_exist && (
                        <MyTableSelectLesson
                            existingLessonIds={allExistingLessonIds}
                            onConfirm={(lessons) => {
                                if (lessons.length === 0) return;
                                addChapter(lessons as any);
                                toastHandler.success(
                                    `Đã thêm ${lessons.length} bài học`,
                                );
                                handleCancel();
                            }}
                        />
                    )}
                    {createType === CREATE_COURSE_TYPE.create_new && (
                        <MyFormLesson />
                    )}
                </div>
            </MyModal>

            {/* Modal to add existing lessons into a specific chapter */}
            <MyModal
                width="100%"
                open={isSelectLessonModalOpen}
                title={`Chọn bài học để thêm vào chương`}
                onCancel={() => {
                    setIsSelectLessonModalOpen(false);
                    setSelectLessonModalIndex(null);
                }}
                centered={true}
                footer={null}
            >
                <MyTableSelectLesson
                    existingLessonIds={allExistingLessonIds}
                    onConfirm={(lessons) => {
                        if (!Array.isArray(lessons) || lessons.length === 0)
                            return;
                        const structure = form.getFieldValue("structure") || [];
                        const idx = selectLessonModalIndex ?? 0;
                        const target = structure[idx] || { lesson: [] };
                        const existing = Array.isArray(target.lesson)
                            ? target.lesson
                            : [];
                        // append selected lessons
                        const newLessons = [...existing, ...lessons];
                        structure[idx] = { ...target, lesson: newLessons };
                        form.setFieldsValue({ structure });
                        toastHandler.success(
                            `Đã thêm ${lessons.length} bài học`,
                        );
                        setIsSelectLessonModalOpen(false);
                        setSelectLessonModalIndex(null);
                    }}
                />
            </MyModal>
        </>
    );
};

export default FormCreate;
