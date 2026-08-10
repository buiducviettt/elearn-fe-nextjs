"use client";

import MyFormCourse from "@/bases/MyForm/MyFormCourse";
import MyModal from "@/bases/MyModal";
import { courseService } from "@/services/course";
import { courseLessonService } from "@/services/courseLesson";
import { TCourse } from "@/types/service-get";
import { TCoursePost } from "@/types/service-post";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CourseCreatePage from "../../course-create/page";
import CourseCreateContent from "../../course-create/Content";

type TProps = {
    children: (params: {
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => React.ReactNode;
    data?: TCourse;
};

const ModalEditCourseItem: React.FC<TProps> = ({ children, data }) => {
    const queryClient = useQueryClient();
    const [form] = useForm();
    const [open, setOpen] = useState(false);

    const update = useMutation({
        mutationFn: (value: TCoursePost) =>
            courseService.update(Number(data?.id), value),
        onSuccess: (response) => {
            setOpen(false);
            toastHandler.success(response?.payload?.message);
            queryClient.invalidateQueries({
                queryKey: [courseService.keyGet],
            });
        },
        onError: (error: any) => {
            toastHandler.error(
                error?.payload?.message || "Có lỗi xảy ra, vui lòng thử lại !",
            );
        },
    });

    useEffect(() => {
        if (open) {
            const resolveAndSet = async () => {
                const structure = data?.structure || [];
                // collect all lesson ids (handle case where lesson items may be objects or primitive ids)
                const allIds: string[] = [];
                structure.forEach((ch: any) => {
                    const lessons = ch.lesson || [];
                    lessons.forEach((l: any) => {
                        if (l === undefined || l === null) return;
                        if (typeof l === "object" && l.id !== undefined) {
                            allIds.push(String(l.id));
                        } else {
                            allIds.push(String(l));
                        }
                    });
                });

                const uniqueIds = Array.from(new Set(allIds));

                // simple cache to avoid duplicate requests
                const cache = new Map<string, any>();
                await Promise.all(
                    uniqueIds.map(async (id) => {
                        try {
                            const res: any = await courseLessonService.get({
                                id,
                            } as any);
                            const lessonItem =
                                res?.payload?.data?.list?.[0] || null;
                            if (lessonItem) cache.set(String(id), lessonItem);
                        } catch (e) {
                            // ignore individual failures
                        }
                    }),
                );

                const resolved = structure.map((ch: any) => ({
                    ...ch,
                    lesson: (ch.lesson || []).map((l: any) => {
                        if (l === undefined || l === null) return l;
                        // if it's already an object with id, keep it
                        if (typeof l === "object" && l.id !== undefined)
                            return l;
                        const key = String(l);
                        if (cache.has(key)) return cache.get(key);
                        return { id: l };
                    }),
                }));

                form.setFieldsValue({
                    title: data?.title || "",
                    description: data?.description || "",
                    structure: resolved,
                });
            };

            resolveAndSet();
        } else {
            form.resetFields();
        }
    }, [form, data, open]);

    const onFinish = (values: any) => {
        const normalizedStructure = (values?.structure || []).map(
            (ch: any) => ({
                ...ch,
                lesson: Array.isArray(ch.lesson)
                    ? ch.lesson.map((l: any) => {
                          if (l === undefined || l === null) return l;
                          if (typeof l === "object") {
                              const idVal = l.id !== undefined ? l.id : l;
                              if (typeof idVal === "object" && idVal !== null) {
                                  return idVal.id !== undefined
                                      ? idVal.id
                                      : idVal;
                              }
                              return idVal;
                          }
                          return l;
                      })
                    : ch.lesson,
            }),
        );

        const dataSubmit: TCoursePost = {
            id: data?.id ?? "",
            ...values,
            structure: normalizedStructure,
        };

        update.mutate(dataSubmit);
    };

    return (
        <>
            {children({ setOpen })}
            <MyModal
                confirmLoading={update.isPending}
                onOk={() => {
                    form.submit();
                }}
                width={"100%"}
                title={`Chỉnh sửa khóa học`}
                open={open}
                setOpen={setOpen}
            >
                <MyFormCourse form={form} onFinish={onFinish} />
            </MyModal>
        </>
    );
};

export default ModalEditCourseItem;
