"use client";

import MyEmpty from "@/bases/MyEmpty";
import MyModal from "@/bases/MyModal";
import MyPagination from "@/bases/MyPanination";
import MyRawButton from "@/bases/MyRawButton";
import MySpin from "@/bases/MySpin";
import { courseLessonService } from "@/services/courseLesson";
import { TCourseItemLesson } from "@/types/service-get";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

type TProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    existingLessonIds: string[];
    onConfirm: (lessons: TCourseItemLesson[]) => void;
};

const ModalExistLessonItem: React.FC<TProps> = ({
    open,
    setOpen,
    existingLessonIds,
    onConfirm,
}) => {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<TCourseItemLesson[]>([]);
    const perPage = 10;

    const { data, isLoading } = useQuery({
        queryKey: [courseLessonService.keyGet, { page, per_page: perPage }],
        queryFn: () =>
            courseLessonService.get({ page, per_page: perPage } as any),
        select: (res) => (res as any).payload.data,
        enabled: open,
    });

    const lessons = (data?.list || []) as TCourseItemLesson[];
    const total = Number(data?.total || 0);

    const toggle = (lesson: TCourseItemLesson) => {
        if (existingLessonIds.includes(String(lesson.id))) return;
        setSelected((prev) =>
            prev.find((l) => l.id === lesson.id)
                ? prev.filter((l) => l.id !== lesson.id)
                : [...prev, lesson],
        );
    };

    const handleOk = () => {
        if (selected.length === 0) return;
        onConfirm(selected);
        setSelected([]);
        setOpen(false);
    };

    return (
        <MyModal
            title="Chọn bài học có sẵn"
            open={open}
            setOpen={setOpen}
            onOk={handleOk}
            onCancel={() => {
                setSelected([]);
                setOpen(false);
            }}
            okText={`Xác nhận${selected.length > 0 ? ` (${selected.length})` : ""}`}
            okButtonProps={{ disabled: selected.length === 0 }}
            width={600}
        >
            <div className="flex flex-col gap-3">
                <MySpin spinning={isLoading}>
                    <div className="flex flex-col gap-2 min-h-[200px]">
                        {lessons.length === 0 && !isLoading && <MyEmpty />}
                        {lessons.map((lesson) => {
                            const isExisting = existingLessonIds.includes(
                                String(lesson.id),
                            );
                            const isChecked = !!selected.find(
                                (l) => l.id === lesson.id,
                            );
                            return (
                                <MyRawButton
                                    key={String(lesson.id)}
                                    onClick={() => toggle(lesson)}
                                    disabled={isExisting}
                                    style={{
                                        opacity: isExisting ? 0.5 : 1,
                                        cursor: isExisting
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                >
                                    <div
                                        className={`p-3 rounded-lg border-2 transition-all text-left w-full ${
                                            isChecked
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 bg-white"
                                        }`}
                                    >
                                        <p className="font-semibold">
                                            {lesson.title}
                                            {isExisting ? " (Đã có)" : ""}
                                        </p>
                                        {lesson.duration ? (
                                            <p className="text-gray-500 text-sm">
                                                {lesson.duration} phút
                                            </p>
                                        ) : null}
                                    </div>
                                </MyRawButton>
                            );
                        })}
                    </div>
                </MySpin>
                {total > perPage && (
                    <MyPagination
                        current={page}
                        pageSize={perPage}
                        total={total}
                        showSizeChanger={false}
                        onChange={(p) => setPage(p)}
                    />
                )}
            </div>
        </MyModal>
    );
};

export default ModalExistLessonItem;
