"use client";

import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import MyForm from "@/bases/MyForm";
import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectTestCannotSubmitUntilDone from "@/bases/MyGroupSelect/MyGroupSelectTestCannotSubmitUntilDone";
import MyGroupSelectTestCannotSubmitUntilTimeout from "@/bases/MyGroupSelect/MyGroupSelectTestCannotSubmitUntilTimeout";
import MyGroupSelectTestExplanation from "@/bases/MyGroupSelect/MyGroupSelectTestExplanation";
import MyGroupSelectTestType from "@/bases/MyGroupSelect/MyGroupSelectTestType";
import MyIconButton from "@/bases/MyIconButton";
import MyInput from "@/bases/MyInput";
import MyPagination from "@/bases/MyPanination";
import MySpin from "@/bases/MySpin";
import MyTagTestType from "@/bases/MyTagTestType";
import MyTooltip from "@/bases/MyTooltip";
import { PAGE_SIZE } from "@/constants/common";
import { questionnaireService } from "@/services/questionnaire";
import ModalSpilitExamFull from "./components/ModalSpilitExamFull";

import {
    TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL,
    TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT,
    TEST_EXPLANATION,
    TEST_TYPES,
    TEST_MODE,
    EXAM_SKILL,
} from "@/types/enum";
import { useQuery } from "@tanstack/react-query";
import {
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryStates,
} from "nuqs";
import { Dispatch, SetStateAction, useState } from "react";
import ModalDeleteQuestionItem from "./components/ModalDeleteTestItem";
import ModalEditTestItem from "./components/ModalEditTestItem";
import ModalHistoryTestItem from "./components/ModalHistoryTestItem";
import MyGroupSelectTestMode from "@/bases/MyGroupSelect/MyGroupSelectTestMode";
import MyGroupSelectTestSkill from "@/bases/MyGroupSelect/MyGroupSelectTestSkill";

const Content = () => {
    const [keywordState, setKeywordState] = useState<string>("");
    const [selectedHistoryTest, setSelectedHistoryTest] = useState<any>(null);

    const [state, setState] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        keyword: parseAsString.withDefault(""),
        type: parseAsStringEnum<TEST_TYPES>(
            Object.values(TEST_TYPES),
        ).withDefault(TEST_TYPES.ielts),
        skill: parseAsStringEnum<EXAM_SKILL>(Object.values(EXAM_SKILL)),
        system: parseAsStringEnum<TEST_MODE>(Object.values(TEST_MODE)),
        explanation: parseAsStringEnum<TEST_EXPLANATION>(
            Object.values(TEST_EXPLANATION),
        ),
        submit_all: parseAsStringEnum<TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL>(
            Object.values(TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL),
        ),
        submit_time: parseAsStringEnum<TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT>(
            Object.values(TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT),
        ),
    });

    const { data, isLoading } = useQuery({
        queryKey: [
            questionnaireService.keyGet,
            {
                type: state.type || undefined,
                keyword: state.keyword || undefined,
                explanation: state.explanation || undefined,
                submit_all: state.submit_all || undefined,
                submit_time: state.submit_time || undefined,
                system: state.system || undefined,
                skill: state.skill || undefined,
                per_page: PAGE_SIZE,
                page: state.page || 1,
            },
        ],
        queryFn: () =>
            questionnaireService.get({
                type: state.type || undefined,
                keyword: state.keyword || undefined,
                explanation: state.explanation || undefined,
                submit_all: state.submit_all || undefined,
                submit_time: state.submit_time || undefined,
                system: state.system || undefined,
                skill: state.skill || undefined,
                per_page: PAGE_SIZE,
                page: state.page || 1,
            }),
        select: (data) => data.payload.data,
    });
    const { list = [], total = 0 } = data || {};
    // console.log("Danh sách đề thi:", list);

    return (
        <MyForm>
            <div className="grid gap-4 grid-cols-12">
                <MyCard className="col-span-12  lg:col-span-4">
                    <MyFormItem label="Loại đề thi">
                        <MyGroupSelectTestType
                            value={state.type}
                            onChange={(value) =>
                                setState({
                                    type: value || (null as any),
                                    page: 1,
                                })
                            }
                            allowClear
                        />
                    </MyFormItem>
                    {state.type === TEST_TYPES.ielts && (
                        <MyFormItem label="Phân loại Kỹ năng">
                            <MyGroupSelectTestSkill
                                value={state.skill as any}
                                onChange={(value) =>
                                    setState({
                                        skill: value || (null as any),
                                        page: 1, // Reset về page 1 khi thay đổi filter
                                    })
                                }
                                allowClear
                            />
                        </MyFormItem>
                    )}
                    <MyFormItem label="Chế độ đề thi">
                        <MyGroupSelectTestMode
                            value={state.system as any}
                            onChange={(value) =>
                                setState({
                                    system: value || (null as any),
                                    page: 1, // Reset về page 1 khi thay đổi filter
                                })
                            }
                            allowClear
                        />
                    </MyFormItem>
                    <MyFormItem label="Làm hết câu hỏi mới được nộp bài">
                        <MyGroupSelectTestCannotSubmitUntilDone
                            value={state.submit_all as any}
                            onChange={(value) => {
                                setState({
                                    submit_all: value || (null as any),
                                    page: 1, // Reset về page 1 khi thay đổi filter
                                });
                            }}
                            allowClear
                        />
                    </MyFormItem>
                    <MyFormItem label="Hết thời gian mới được nộp bài">
                        <MyGroupSelectTestCannotSubmitUntilTimeout
                            value={state.submit_time as any}
                            onChange={(value) => {
                                setState({
                                    submit_time: value || (null as any),
                                    page: 1, // Reset về page 1 khi thay đổi filter
                                });
                            }}
                            allowClear
                        />
                    </MyFormItem>
                    <MyFormItem label="Hiện thị lời giải">
                        <MyGroupSelectTestExplanation
                            value={state.explanation as any}
                            onChange={(value) => {
                                setState({
                                    explanation: value || (null as any),
                                    page: 1, // Reset về page 1 khi thay đổi filter
                                });
                            }}
                            allowClear
                        />
                    </MyFormItem>
                </MyCard>
                <MyCard className="col-span-12 lg:col-span-8">
                    {selectedHistoryTest ? (
                        <>
                            <div>
                                <ModalHistoryTestItem
                                    data={selectedHistoryTest}
                                    isInline
                                    onBack={() => setSelectedHistoryTest(null)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <MyFormItem label="Tìm kiếm">
                                <MyInput
                                    value={keywordState}
                                    onChange={(event) => {
                                        setKeywordState(event.target.value);
                                    }}
                                    onChangeDebounced={(event) => {
                                        setState({
                                            keyword: event.target.value,
                                            page: 1, // Reset về page 1 khi search
                                        });
                                    }}
                                    placeholder="Nhập từ cần tìm kiếm"
                                />
                            </MyFormItem>
                            <MySpin spinning={isLoading}>
                                <div className="flex min-h-96 flex-col gap-3">
                                    {list.length === 0 && <MyEmpty />}
                                    {list.map((test) => {
                                        const {
                                            questionnaire_id,
                                            questionnaire_title,
                                            questionnaire_type,
                                            questionnaire_structure,
                                            questionnaire_system,
                                        } = test || {};
                                        const isFullTest =
                                            questionnaire_system === 0 ||
                                            questionnaire_system === "0" ||
                                            questionnaire_system ===
                                                TEST_MODE.no;
                                        const sections = (
                                            test?.questionnaire_structure || []
                                        ).map((section: any, idx: number) => ({
                                            key: String(idx),
                                            label:
                                                section?.title ||
                                                `Section ${idx + 1}`,
                                            ...section,
                                        }));
                                        return (
                                            <div
                                                className="flex gap-2 col-span-6 bg-gray-100 p-3 rounded-xl items-center"
                                                key={questionnaire_id}
                                            >
                                                <MyTagTestType
                                                    amount={
                                                        questionnaire_structure.length
                                                    }
                                                    type={questionnaire_type}
                                                />
                                                <p className="font-semibold text-left flex-1 line-clamp-1">
                                                    {questionnaire_title}
                                                </p>
                                                <div className="flex gap-2">
                                                    {isFullTest && (
                                                        <ModalSpilitExamFull
                                                            data={test}
                                                        >
                                                            {({ setOpen }) => (
                                                                <MyTooltip title="Tạo đề lẻ từ đề full">
                                                                    <MyIconButton
                                                                        color="PURPLE"
                                                                        icon="ADD"
                                                                        onClick={() =>
                                                                            setOpen(
                                                                                true,
                                                                            )
                                                                        }
                                                                    />
                                                                </MyTooltip>
                                                            )}
                                                        </ModalSpilitExamFull>
                                                    )}
                                                    <ModalEditTestItem
                                                        data={test}
                                                    >
                                                        {({ setOpen }) => (
                                                            <MyTooltip title="Chỉnh sửa">
                                                                <MyIconButton
                                                                    onClick={() =>
                                                                        setOpen(
                                                                            true,
                                                                        )
                                                                    }
                                                                    color="BLUE"
                                                                    icon="EDIT"
                                                                />
                                                            </MyTooltip>
                                                        )}
                                                    </ModalEditTestItem>
                                                    <MyTooltip title="Lịch sử làm bài">
                                                        <MyIconButton
                                                            onClick={() =>
                                                                setSelectedHistoryTest(
                                                                    {
                                                                        questionnaire_id,
                                                                        questionnaire_title,
                                                                    },
                                                                )
                                                            }
                                                            color="YELLOW"
                                                            icon="HISTORY"
                                                        />
                                                    </MyTooltip>
                                                    <ModalDeleteQuestionItem
                                                        id={Number(
                                                            questionnaire_id,
                                                        )}
                                                        title={
                                                            questionnaire_title
                                                        }
                                                    >
                                                        {({ setOpen }) => (
                                                            <MyTooltip title="Xoá">
                                                                <MyIconButton
                                                                    onClick={() =>
                                                                        setOpen(
                                                                            true,
                                                                        )
                                                                    }
                                                                    color="RED"
                                                                    icon="DELETE"
                                                                />
                                                            </MyTooltip>
                                                        )}
                                                    </ModalDeleteQuestionItem>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex mt-4 justify-end">
                                    <MyPagination
                                        current={state.page}
                                        pageSize={PAGE_SIZE}
                                        size="small"
                                        onChange={(page) => {
                                            setState({
                                                page,
                                            });
                                        }}
                                        total={Number(total)}
                                    />
                                </div>
                            </MySpin>
                        </>
                    )}
                </MyCard>
            </div>
        </MyForm>
    );
};

export default Content;
