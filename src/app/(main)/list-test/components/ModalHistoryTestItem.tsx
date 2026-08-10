"use client";
import { historyService } from "@/services/history";
import { userService } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Pagination, Select, Spin } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import MyEmpty from "@/bases/MyEmpty";
import MyButton from "@/bases/MyButton";
import HistoryQuestionItem from "./HistoryQuestionItem";
import QuestionnaireHistoryItem from "./QuestionnaireHistoryItem";
import { getUserName } from "./historyUtils";

type TProps = {
    children?: (params: {
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => React.ReactNode;
    data?: any;
    isInline?: boolean;
    onBack?: () => void;
};

const ModalHistoryTestItem: React.FC<TProps> = (props) => {
    const { children, data, isInline, onBack } = props;
    const [userOptions, setUserOptions] = useState<any[]>([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);
    const [viewingTest, setViewingTest] = useState<any>(null);
    const [userHistoryList, setUserHistoryList] = useState<any[]>([]);
    const [userHistoryPage, setUserHistoryPage] = useState(1);
    const [userHistoryHasMore, setUserHistoryHasMore] = useState(false);
    const userHistoryPageSize = 5;

    // Lấy danh sách user từ API (dùng cho getUserName)
    const { data: userList, isLoading: isUserLoading } = useQuery({
        queryKey: ["userService", "list"],
        queryFn: async () => {
            const res = await userService.get({ per_page: 100 });
            console.log(
                "User List JSON:",
                JSON.stringify(res.payload, null, 2)
            ); // Log JSON user
            setUserOptions(
                (res.payload || []).map((u: any) => ({
                    label: `${u.name} (${u.user_email})`,
                    value: String(u.id),
                }))
            );
            return res.payload || [];
        },
    });

    // Hàm fetch user cho select search (search remote)
    const fetchUserOptions = async (keyword: string) => {
        setUserSearchLoading(true);
        const res = await userService.get({ per_page: 20, search: keyword });
        setUserOptions(
            (res.payload || []).map((u: any) => ({
                label: `${u.name} (${u.user_email})`,
                value: String(u.id),
            }))
        );
        setUserSearchLoading(false);
    };

    // Debounce search
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const handleUserSearch = (keyword: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (!keyword) {
            setUserOptions([]);
            return;
        }
        searchTimeout.current = setTimeout(() => {
            fetchUserOptions(keyword);
        }, 400);
    };

    // Lấy lịch sử làm bài từ API (theo phân trang backend)
    const { data: dataHistoty, isLoading } = useQuery({
        queryKey: ["historyService", data?.questionnaire_id, page, pageSize],
        queryFn: async () => {
            const res = await historyService.get({
                per_page: pageSize,
                page,
                user_id: "",
                questionnaire_id: data.questionnaire_id,
            });
            return res.payload?.data;
        },
        enabled: !!data?.questionnaire_id,
    });

    // Lọc data theo user nếu có chọn user
    const isUserSelected = !!selectedUser;
    const historyList = isUserSelected
        ? userHistoryList
        : dataHistoty?.list || [];
    const total = Number(dataHistoty?.total) || 0;

    // Toggle dropdown từng item
    const handleToggle = (idx: number) => {
        setOpenIndexes((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    // Khi chọn user mới
    const handleSelectUser = async (val: string) => {
        setSelectedUser(val || "");
        setPage(1);
        setOpenIndexes([]);
        setUserHistoryList([]);
        setUserHistoryPage(1);

        if (val) {
            setUserSearchLoading(true);
            const res = await historyService.get({
                per_page: userHistoryPageSize,
                page: 1,
                user_id: val,
                questionnaire_id: data.questionnaire_id,
            });
            const list = res.payload?.data?.list || [];
            setUserHistoryList(list);
            setUserHistoryHasMore(list.length === userHistoryPageSize);
            setUserSearchLoading(false);
        }
    };

    // Khi bấm "Xem thêm"
    const handleLoadMoreUserHistory = async () => {
        const nextPage = userHistoryPage + 1;
        setUserSearchLoading(true);
        const res = await historyService.get({
            per_page: userHistoryPageSize,
            page: nextPage,
            user_id: selectedUser,
            questionnaire_id: data.questionnaire_id,
        });
        const list = res.payload?.data?.list || [];
        setUserHistoryList((prev) => [...prev, ...list]);
        setUserHistoryPage(nextPage);
        setUserHistoryHasMore(list.length === userHistoryPageSize);
        setUserSearchLoading(false);
    };

    // Nếu là inline thì chỉ render nội dung, không dùng modal
    if (isInline) {
        // Nếu đang xem chi tiết 1 bài thi
        if (viewingTest) {
            return (
                <div>
                    <MyButton
                        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => {
                            setViewingTest(null);
                            setOpenIndexes([]);
                        }}
                    >
                        ← Quay lại danh sách lịch sử làm bài
                    </MyButton>
                    <h2 className="text-lg font-bold mb-2">
                        Danh sách câu hỏi bài thi {data?.questionnaire_title}
                    </h2>
                    <p className="text-blue-600 font-bold mb-2">
                        <span className="text-gray-600 font-semibold">
                            Người làm bài:{" "}
                        </span>
                        {getUserName(viewingTest.user_id, userList ?? [])}
                    </p>
                    <p className="text-gray-500 mb-4">
                        Thời làm bài: {viewingTest.created || "Chưa có dữ liệu"}
                    </p>
                    {Array.isArray(viewingTest.structure) &&
                    viewingTest.structure.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {(() => {
                                let questionIndex = 1;
                                return viewingTest.structure.map(
                                    (part: any, partIdx: number) => (
                                        <div
                                            key={partIdx}
                                            className="bg-gray-50 rounded-lg p-4"
                                        >
                                            <div className="p-2 border-b mb-4">
                                                <h4 className="font-bold mb-2 text-xl text-gray-700">
                                                    {part.title}
                                                </h4>
                                            </div>
                                            <div className="p-4 rounded bg-white grid grid-cols-2 gap-4">
                                                {part.questions.flatMap(
                                                    (q: any) =>
                                                        q.question_items.map(
                                                            (
                                                                item: any,
                                                                itemIdx: number
                                                            ) => {
                                                                const currentIndex =
                                                                    questionIndex;
                                                                if (
                                                                    item.multiple ===
                                                                    "1"
                                                                ) {
                                                                    questionIndex +=
                                                                        Array.isArray(
                                                                            item.answer
                                                                        )
                                                                            ? item
                                                                                  .answer
                                                                                  .length
                                                                            : 0;
                                                                } else {
                                                                    questionIndex++;
                                                                }
                                                                return (
                                                                    <HistoryQuestionItem
                                                                        key={
                                                                            itemIdx +
                                                                            "-" +
                                                                            currentIndex
                                                                        }
                                                                        q={q}
                                                                        item={
                                                                            item
                                                                        }
                                                                        questionIndex={
                                                                            currentIndex
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )
                                                )}
                                            </div>
                                        </div>
                                    )
                                );
                            })()}
                        </div>
                    ) : (
                        <MyEmpty description="Không có dữ liệu câu hỏi" />
                    )}
                </div>
            );
        }

        return (
            <div>
                <MyButton
                    className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => onBack && onBack()}
                >
                    ← Quay lại danh sách đề thi
                </MyButton>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">
                        Lịch sử làm bài {data?.questionnaire_title}
                    </h2>
                    <Select
                        className="w-64 flex-shrink-0"
                        showSearch
                        allowClear
                        placeholder="Tìm kiếm user"
                        options={userOptions}
                        value={selectedUser || undefined}
                        onSearch={handleUserSearch}
                        onFocus={(e) => {
                            if (!(e.target as HTMLInputElement).value)
                                setUserOptions([]);
                        }}
                        onChange={handleSelectUser}
                        loading={userSearchLoading}
                        filterOption={false}
                        notFoundContent={
                            <div
                                style={{
                                    minHeight: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {userSearchLoading ? (
                                    <Spin size="small" />
                                ) : (
                                    <MyEmpty />
                                )}
                            </div>
                        }
                    />
                </div>
                <div
                    className="flex flex-col gap-3"
                    style={{ position: "relative" }}
                >
                    {(isLoading && !isUserSelected) ||
                    (userSearchLoading && isUserSelected) ? (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(255,255,255,0.6)",
                                zIndex: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Spin size="large" />
                        </div>
                    ) : null}

                    {(historyList?.length ?? 0) === 0 ? (
                        <div className="col-span-full">
                            <MyEmpty />
                        </div>
                    ) : (
                        historyList.map(
                            (
                                questionnaire: Record<string, any>,
                                idx: number
                            ) => {
                                const realIndex = isUserSelected
                                    ? idx
                                    : (page - 1) * pageSize + idx;
                                const isOpen = openIndexes.includes(realIndex);
                                return (
                                    <div
                                        key={questionnaire.created + idx}
                                        className="bg-white rounded-lg shadow border border-gray-200"
                                    >
                                        <div
                                            className="flex border-b flex-col md:flex-row md:items-center gap-2 cursor-pointer select-none px-4 py-3"
                                            onClick={() =>
                                                handleToggle(realIndex)
                                            }
                                        >
                                            <span className="font-bold text-lg text-blue-600">
                                                {`#${questionnaire.id} - U${questionnaire.user_id} `}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                ({questionnaire.created})
                                            </span>
                                            <span className="ml-auto">
                                                {isOpen ? (
                                                    <UpOutlined />
                                                ) : (
                                                    <DownOutlined />
                                                )}
                                            </span>
                                        </div>
                                        {isOpen && (
                                            <div className="px-4 py-3">
                                                <QuestionnaireHistoryItem
                                                    data={questionnaire}
                                                    onViewTest={() =>
                                                        setViewingTest(
                                                            questionnaire
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
                {!isUserSelected &&
                    total > pageSize &&
                    (historyList?.length ?? 0) > 0 && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={total}
                                onChange={(p) => {
                                    setPage(p);
                                    setOpenIndexes([]);
                                }}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                {isUserSelected &&
                    userHistoryHasMore &&
                    (historyList?.length ?? 0) > 0 && (
                        <div className="flex justify-center mt-4">
                            <MyButton
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleLoadMoreUserHistory}
                                disabled={userSearchLoading}
                            >
                                {userSearchLoading ? "Đang tải..." : "Xem thêm"}
                            </MyButton>
                        </div>
                    )}
            </div>
        );
    }
    return null;
};

export default ModalHistoryTestItem;
