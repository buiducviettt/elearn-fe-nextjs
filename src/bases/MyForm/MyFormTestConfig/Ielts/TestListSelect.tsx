import { useState } from "react";
import MySpin from "@/bases/MySpin";
import MyEmpty from "@/bases/MyEmpty";
import MyCheckbox from "@/bases/MyCheckbox";
import MyTagTestType from "@/bases/MyTagTestType";
import MyPagination from "@/bases/MyPanination";
import MyButton from "@/bases/MyButton";
import { PlusOutlined } from "@ant-design/icons";
import toastHandler from "@/utils/toastHandler";
import { useQuery } from "@tanstack/react-query";
import { questionnaireService } from "@/services/questionnaire";
import MyCard from "@/bases/MyCard";
// import { PAGE_SIZE } from "@/constants/common";
import { EXAM_SKILL, TEST_MODE, TEST_TYPES } from "@/types/enum";
import { Content } from "next/font/google";
import MyGroupSelectTestSkill from "@/bases/MyGroupSelect/MyGroupSelectTestSkill";
import MyFormItem from "@/bases/MyFormItem";
import { formRequired } from "@/constants/common";

type TestListSelectProps = {
    form: any;
    addedIds: string[];
    onAdd: (selectedStructures: any[], newSelectedTests: string[]) => void;
    questionnaireSkillType?: string;
};

const TestListSelect: React.FC<TestListSelectProps> = ({
    form,
    addedIds,
    onAdd,
    questionnaireSkillType,
}) => {
    const [state, setState] = useState({ page: 1, keyword: "" });
    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const PAGE_SIZE = 5;

    const skill = Object.values(EXAM_SKILL).includes(
        questionnaireSkillType as EXAM_SKILL
    )
        ? (questionnaireSkillType as EXAM_SKILL)
        : EXAM_SKILL.reading; // fallback nếu không hợp lệ

    const { data, isLoading } = useQuery({
        queryKey: ["questionnaireList", state, skill],
        queryFn: () =>
            questionnaireService.get({
                keyword: state.keyword || undefined,
                per_page: PAGE_SIZE,
                page: state.page || 1,
                system: TEST_MODE.yes,
                skill: skill || undefined,
            }),
        select: (data) => data.payload.data,
    });

    const { list = [], total = 0 } = data || {};
    const currentId = form.getFieldValue("questionnaire_id");

    return (
        <div className="flex flex-col">
            {/* <div className="flex gap-3 items-center justify-between mb-3">
                <label
                    className="flex items-center gap-2 p-2 text-white font-semibold bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            const selectableIds = list
                                .filter(
                                    (test) =>
                                        !addedIds.includes(test.questionnaire_id) &&
                                        test.questionnaire_system === "1"
                                )
                                .map((test) => test.questionnaire_id);

                            if (selectedTests.length === selectableIds.length) {
                                setSelectedTests([]);
                            } else {
                                setSelectedTests(selectableIds);
                            }
                        }
                    }}
                >
                    <MyCheckbox
                        checked={
                            list.filter(
                                (test) =>
                                    !addedIds.includes(test.questionnaire_id) &&
                                    test.questionnaire_system === "1"
                            ).length > 0 &&
                            selectedTests.length ===
                            list
                                .filter(
                                    (test) =>
                                        !addedIds.includes(test.questionnaire_id) &&
                                        test.questionnaire_system === "1"
                                )
                                .map((test) => test.questionnaire_id).length
                        }
                        indeterminate={
                            selectedTests.length > 0 &&
                            selectedTests.length <
                            list.filter(
                                (test) =>
                                    !addedIds.includes(test.questionnaire_id) &&
                                    test.questionnaire_system === "1"
                            ).length
                        }
                        onChange={(e) => {
                            const selectableIds = list
                                .filter(
                                    (test) =>
                                        !addedIds.includes(test.questionnaire_id) &&
                                        test.questionnaire_system === "1"
                                )
                                .map((test) => test.questionnaire_id);

                            if (e.target.checked) {
                                setSelectedTests(selectableIds);
                            } else {
                                setSelectedTests([]);
                            }
                        }}
                    />
                    <span>Chọn tất cả</span>
                </label>
            </div> */}
            <MyFormItem name="questionnaire_skill">
                <p className="font-semibold font-medium mb-2">Lọc kỹ năng</p>
                <MyGroupSelectTestSkill
                    value={skill}
                    className="opacity-50 pointer-events-none"
                    onChange={() => {}}
                />
            </MyFormItem>
            <MySpin spinning={isLoading}>
                <div className="grid grid-cols-2 gap-4 min-h-[ư00px]">
                    {list.length === 0 && <MyEmpty className="col-span-2" />}
                    {list
                        .filter((test) => test.questionnaire_system === "1")
                        .map((test) => {
                            const {
                                questionnaire_id,
                                questionnaire_title,
                                questionnaire_type,
                                questionnaire_structure,
                                questionnaire_system,
                            } = test || {};
                            const isAdded = addedIds.includes(questionnaire_id);
                            const isLe = questionnaire_system === "1";
                            const isCurrent = questionnaire_id === currentId;

                            return (
                                <div
                                    className={`flex gap-2 col-span-6 bg-gray-100 border-2 border-solid border-blue-400 p-3 rounded-lg items-center ${
                                        isAdded || !isLe || isCurrent
                                            ? "opacity-50 pointer-events-none"
                                            : ""
                                    }`}
                                    key={questionnaire_id}
                                    onClick={() => {
                                        if (isAdded || !isLe || isCurrent)
                                            return;
                                        if (
                                            selectedTests.includes(
                                                questionnaire_id
                                            )
                                        ) {
                                            setSelectedTests(
                                                selectedTests.filter(
                                                    (id) =>
                                                        id !== questionnaire_id
                                                )
                                            );
                                        } else {
                                            setSelectedTests([
                                                ...selectedTests,
                                                questionnaire_id,
                                            ]);
                                        }
                                    }}
                                    style={{
                                        cursor:
                                            isAdded || !isLe || isCurrent
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    <MyCheckbox
                                        checked={selectedTests.includes(
                                            questionnaire_id
                                        )}
                                        disabled={isAdded || !isLe || isCurrent}
                                        onChange={(e) => {
                                            if (isAdded || !isLe || isCurrent)
                                                return;
                                            if (e.target.checked) {
                                                setSelectedTests([
                                                    ...selectedTests,
                                                    questionnaire_id,
                                                ]);
                                            } else {
                                                setSelectedTests(
                                                    selectedTests.filter(
                                                        (id) =>
                                                            id !==
                                                            questionnaire_id
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                    <MyTagTestType
                                        amount={questionnaire_structure.length}
                                        type={questionnaire_type}
                                    />
                                    <p className="font-semibold text-left flex align-center gap-2 flex-1 line-clamp-1">
                                        <span className="truncate">
                                            {questionnaire_title}
                                        </span>
                                        {isAdded && (
                                            <span className="italic font-bold text-red-500">
                                                (Đã tồn tại)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            );
                        })}
                </div>
                {list.length > 0 && (
                    <div className="flex mt-4 justify-center">
                        <MyPagination
                            current={state.page}
                            pageSize={PAGE_SIZE}
                            size="small"
                            onChange={(page) => setState({ ...state, page })}
                            total={Number(total)}
                        />
                    </div>
                )}
            </MySpin>
            <div className="flex justify-end mt-4">
                <MyButton
                    onClick={() => {
                        if (selectedTests.length === 0) {
                            toastHandler.error(
                                "Vui lòng chọn ít nhất một bài tập!"
                            );
                            return;
                        }

                        try {
                            const currentStructure =
                                form?.getFieldValue(
                                    "questionnaire_structure"
                                ) || [];
                            const addedIds = currentStructure.map(
                                (item) =>
                                    item?.id ||
                                    item?.questionnaire_id ||
                                    item?.questionnaire_structure_id
                            );

                            const newSelectedTests = selectedTests.filter(
                                (id) => !addedIds.includes(id)
                            );

                            if (newSelectedTests.length === 0) {
                                toastHandler.error(
                                    "Các nhóm bài tập đã tồn tại trong đề thi!"
                                );
                                return;
                            }

                            const selectedStructures = list
                                .filter((test) =>
                                    newSelectedTests.includes(
                                        test.questionnaire_id
                                    )
                                )
                                .map((test) => ({
                                    title:
                                        test.questionnaire_structure[0]
                                            ?.title || "",
                                    transcript_audio:
                                        test.questionnaire_structure[0]
                                            ?.transcript_audio || "",
                                    transcript:
                                        test.questionnaire_structure[0]
                                            ?.transcript || "",
                                    content:
                                        test.questionnaire_structure[0]
                                            ?.content || "",
                                    questions:
                                        test.questionnaire_structure[0]
                                            ?.questions || [],
                                    questionnaire_id: test.questionnaire_id,
                                }));

                            onAdd(selectedStructures, newSelectedTests);

                            toastHandler.success(
                                `Đã thêm ${newSelectedTests.length} nhóm bài tập`
                            );
                            setSelectedTests(
                                selectedTests.filter(
                                    (id) => !newSelectedTests.includes(id)
                                )
                            );
                        } catch (error) {
                            console.error("Error adding structures:", error);
                            toastHandler.error("Thêm nhóm bài tập thất bại!");
                        }
                    }}
                    type="primary"
                    disabled={selectedTests.length === 0}
                    className="flex items-center gap-2"
                >
                    <PlusOutlined />
                    Thêm vào nhóm bài tập
                    {selectedTests.length > 0 && (
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                            {selectedTests.length}
                        </span>
                    )}
                </MyButton>
            </div>
        </div>
    );
};

export default TestListSelect;
