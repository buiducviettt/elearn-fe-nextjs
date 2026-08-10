"use client";
import React, { useState } from "react";
import { courseService } from "@/services/course";
import { TCourse } from "@/types/service-get";
import MyPagination from "@/bases/MyPanination";
import MyTooltip from "@/bases/MyTooltip";
import MyIconButton from "@/bases/MyIconButton";
import ModalEditCourseItem from "../components/Modal-Course/ModalEditCouseItem";
import ModalDeleteCourseItem from "../components/Modal-Course/ModalDeleteCourseItem";
import { useQuery } from "@tanstack/react-query";
import MySpin from "@/bases/MySpin";
import MyEmpty from "@/bases/MyEmpty";
import MyCard from "@/bases/MyCard";
import MyFormItem from "@/bases/MyFormItem";
import MyInput from "@/bases/MyInput";

const CourseListContent: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [perPage] = useState<number>(9);
    const [keywordState, setKeywordState] = useState<string>("");

    const { data, isLoading } = useQuery({
        queryKey: [
            courseService.keyGet,
            { page, per_page: perPage, keyword: keywordState },
        ],
        queryFn: () =>
            courseService.get({
                page,
                per_page: perPage,
                keyword: keywordState,
            } as any),
        select: (res) => (res as any).payload.data,
    });

    const courses = (data?.list || []) as TCourse[];
    const total = Number(data?.total || 0);

    return (
        <div className="w-full">
            <MyCard className="flex flex-col gap-3">
                <MyFormItem label="Tìm kiếm khóa học">
                    <MyInput
                        value={keywordState}
                        onChange={(event) => {
                            setKeywordState(event.target.value);
                        }}
                        onChangeDebounced={(event) => {
                            setKeywordState(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Nhập khóa học cần tìm kiếm"
                    />
                </MyFormItem>
                <MySpin spinning={isLoading}>
                    <div className="min-h-[180px] flex flex-col gap-2">
                        {courses.length === 0 && !isLoading && <MyEmpty />}
                        {courses.map((course) => (
                            <div
                                className=" w-full flex gap-2 col-span-1 bg-gray-100 py-2 px-3 justify-between rounded items-center"
                                key={course.id}
                            >
                                <h2 className="text-base font-semibold line-clamp-1 flex-1">
                                    {course.title}
                                </h2>
                                <div className="flex gap-2">
                                    <ModalEditCourseItem data={course}>
                                        {({ setOpen }) => (
                                            <MyTooltip title="Chỉnh sửa">
                                                <MyIconButton
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
                                                    color="BLUE"
                                                    icon="EDIT"
                                                />
                                            </MyTooltip>
                                        )}
                                    </ModalEditCourseItem>

                                    <ModalDeleteCourseItem
                                        id={Number(course.id)}
                                        title={course.title}
                                    >
                                        {({ setOpen }) => (
                                            <MyTooltip title="Xoá">
                                                <MyIconButton
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
                                                    color="RED"
                                                    icon="DELETE"
                                                />
                                            </MyTooltip>
                                        )}
                                    </ModalDeleteCourseItem>
                                </div>
                            </div>
                        ))}
                    </div>
                </MySpin>

                <div className="mt-6 flex items-center justify-center">
                    <MyPagination
                        current={page}
                        pageSize={perPage}
                        total={total}
                        showSizeChanger={false}
                        onChange={(p, pageSize) => {
                            setPage(p);
                            if (pageSize && pageSize !== perPage) {
                            }
                        }}
                    />
                </div>
            </MyCard>
        </div>
    );
};

export default CourseListContent;
