"use client";

import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import MyForm from "@/bases/MyForm";
import MyFormItem from "@/bases/MyFormItem";
import MyIconButton from "@/bases/MyIconButton";
import MyInput from "@/bases/MyInput";
import MyItemQuestionGroup from "@/bases/MyItemQuestionGroup";
import MyPagination from "@/bases/MyPanination";
import MySpin from "@/bases/MySpin";
import MyTooltip from "@/bases/MyTooltip";
import { PAGE_SIZE } from "@/constants/common";
import { questionService } from "@/services/question";
import { EXAM_STRUCTURE } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "antd/es/form/Form";
import { useState } from "react";
import ModalDeleteQuestionItem from "../list-question/components/ModalDeleteQuestionItem";
import ModalEditQuestionItem from "../list-question/components/ModalEditQuestionItem";
import styles from "./styles.module.scss";
const QuestionList = () => {
    const [form] = useForm();
    const [searchDebounced, setSearchDebounced] = useState<string>("");

    const [page, setPage] = useState(1);
    const level = useWatch(["level"], form);
    const category = useWatch(["category"], form);
    const part = useWatch(["part"], form);
    const skill = useWatch(["skill"], form);

    const { data, isLoading } = useQuery({
        queryKey: [
            questionService.keyGet,
            {
                page: page,
                per_page: PAGE_SIZE,
                keyword: searchDebounced,
                level,
                category,
                part,
                skill,
            },
        ],
        queryFn: () => {
            return questionService.get({
                page: page,
                per_page: PAGE_SIZE,
                keyword: searchDebounced,
                level,
                category,
                part,
                skill,
                question_id: "",
            });
        },
        select: (data) => data.payload.data,
    });
    const { list = [], total = 0, page: current = 0 } = data || {};

    return (
        <MyForm form={form}>
            <div className="grid gap-4 grid-cols-12">
                <MyCard className="col-span-12">
                    <div className="flex flex-col gap-3">
                        <MySpin spinning={isLoading}>
                            <div className="grid grid-cols-2 gap-3">
                                {list.map((item) => {
                                    const {
                                        question_id,
                                        question_title,
                                        question_type,
                                        question_items = [],
                                    } = item || {};

                                    return (
                                        <MyItemQuestionGroup
                                            options={{
                                                showCheckbox: false,
                                            }}
                                            key={question_id}
                                            tagQuestion={{
                                                amount: question_items.length,
                                                type: question_type,

                                                // type:
                                                //   question_type === EXAM_STRUCTURE.single
                                                //     ? EXAM_STRUCTURE.single
                                                //     : EXAM_STRUCTURE.group,
                                            }}
                                            label={question_title}
                                            extra={
                                                <div className="flex gap-2">
                                                    <ModalEditQuestionItem
                                                        question={item}
                                                    >
                                                        {({ setOpen }) => {
                                                            return (
                                                                <MyTooltip title="Chỉnh sửa 1">
                                                                    <MyIconButton
                                                                        onClick={() =>
                                                                            setOpen(
                                                                                true
                                                                            )
                                                                        }
                                                                        color="BLUE"
                                                                        icon="EDIT"
                                                                    />
                                                                </MyTooltip>
                                                            );
                                                        }}
                                                    </ModalEditQuestionItem>
                                                    <ModalDeleteQuestionItem
                                                        id={question_id}
                                                        title={question_title}
                                                    >
                                                        {({ setOpen }) => {
                                                            return (
                                                                <MyTooltip title="Xoá">
                                                                    <MyIconButton
                                                                        onClick={() =>
                                                                            setOpen(
                                                                                true
                                                                            )
                                                                        }
                                                                        color="RED"
                                                                        icon="DELETE"
                                                                    />
                                                                </MyTooltip>
                                                            );
                                                        }}
                                                    </ModalDeleteQuestionItem>
                                                </div>
                                            }
                                        />
                                    );
                                })}
                                {list.length !== 0 && (
                                    <div
                                        className={`col-span-2 flex mt-2 items-center justify-end ${styles["pagination"]} `}
                                    >
                                        <MyPagination
                                            size="small"
                                            pageSize={PAGE_SIZE}
                                            current={current}
                                            total={Number(total)}
                                            onChange={(page) => {
                                                setPage(page);
                                            }}
                                        />
                                    </div>
                                )}
                                {list.length === 0 && (
                                    <div className="col-span-full">
                                        <MyEmpty />
                                    </div>
                                )}
                            </div>
                        </MySpin>
                    </div>
                </MyCard>
            </div>
        </MyForm>
    );
};

export default QuestionList;
