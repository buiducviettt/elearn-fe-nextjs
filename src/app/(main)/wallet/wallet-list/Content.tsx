"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import MyForm from "@/bases/MyForm";
import { useForm } from "antd/lib/form/Form";
import { walletService } from "@/services/wallet";
import { userService } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "@/constants/common";
import { Pagination, Select, Skeleton } from "antd";
import { EyeOutlined, SwapOutlined } from "@ant-design/icons";

const Content = () => {
    const [form] = useForm();
    const [page, setPage] = useState(1);
    const [userOptions, setUserOptions] = useState<any[]>([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | undefined>(
        undefined
    );
    const router = useRouter();

    // Cache user info theo id
    const [userCache, setUserCache] = useState<Record<string, any>>({});

    // Fetch user info theo id nếu chưa có trong cache
    const fetchUserName = async (userId: string) => {
        if (!userId || userCache[userId]) return;
        try {
            const res = await userService.get({ id: userId });
            const user = Array.isArray(res.payload)
                ? res.payload[0]
                : res.payload;
            setUserCache((prev) => ({
                ...prev,
                [userId]: user,
            }));
        } catch (e) {
            setUserCache((prev) => ({
                ...prev,
                [userId]: { name: "Không tìm thấy" },
            }));
        }
    };

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

    // Khi chọn user
    const handleSelectUser = (value: string | undefined) => {
        setSelectedUser(value);
        setPage(1);
    };

    // Query danh sách ví, lọc theo user nếu có
    const { data, isLoading } = useQuery({
        queryKey: [
            walletService.keyGet,
            {
                page,
                per_page: PAGE_SIZE,
                user_id: selectedUser || undefined,
            },
        ],
        queryFn: () =>
            walletService.get({
                page,
                per_page: PAGE_SIZE,
                user_id: selectedUser || undefined,
            }),
        select: (data) => data.payload.data,
    });
    const { list = [], total = 0, page: current = 0 } = data || {};

    // Khi có list ví mới, fetch user name cho các user_id chưa có trong cache
    useEffect(() => {
        const missingUserIds = list
            .map((w: any) => w.user_id)
            .filter((id: string) => id && !userCache[id]);
        missingUserIds.forEach((id: string) => fetchUserName(id));
    }, [list, userCache]);

    useEffect(() => {
        if (!selectedUser) setUserOptions([]);
    }, [selectedUser]);

    return (
        <MyForm form={form}>
            <div className="grid gap-4 grid-cols-1">
                <MyCard className="col-span-1">
                    <div className="flex flex-col gap-3">
                        <div className="mt-3">
                            <Select
                                className="w-64 flex-shrink-0"
                                showSearch
                                allowClear
                                placeholder="Tìm kiếm user"
                                options={userOptions}
                                value={selectedUser}
                                onSearch={handleUserSearch}
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
                                            <Skeleton.Input
                                                active
                                                size="small"
                                                style={{ width: 100 }}
                                            />
                                        ) : (
                                            <MyEmpty />
                                        )}
                                    </div>
                                }
                                onBlur={() => setUserOptions([])}
                            />
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {[...Array(PAGE_SIZE)].map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="col-span-1 flex gap-2 bg-gray-100 p-3 rounded-xl items-center"
                                    >
                                        <Skeleton.Avatar
                                            active
                                            size="large"
                                            shape="square"
                                        />
                                        <div className="flex-1">
                                            <Skeleton
                                                active
                                                title={false}
                                                paragraph={{
                                                    rows: 2,
                                                    width: ["60%", "40%"],
                                                }}
                                            />
                                        </div>
                                        <Skeleton.Button
                                            active
                                            size="small"
                                            shape="round"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : list.length === 0 ? (
                            <div className="flex flex-col gap-2 mt-2">
                                <MyEmpty />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {list.map((wallet: any) => {
                                    const userName =
                                        wallet.user_name ||
                                        userCache[wallet.user_id]?.name ||
                                        undefined;
                                    const isUserLoading =
                                        !wallet.user_name &&
                                        !userCache[wallet.user_id];
                                    return (
                                        <div
                                            key={
                                                wallet.id ?? `${wallet.user_id}`
                                            }
                                            className="col-span-1 flex gap-2 bg-gray-100 p-3 rounded-xl items-center"
                                        >
                                            <div className="p-2 bg-white rounded-md text-sm font-mono text-black">
                                                ID: {wallet.id ?? ""}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-lg font-medium line-clamp-1">
                                                    {isUserLoading ? (
                                                        <Skeleton.Input
                                                            active
                                                            size="small"
                                                            style={{
                                                                width: 120,
                                                                marginRight: 8,
                                                            }}
                                                        />
                                                    ) : (
                                                        <>
                                                            {userName ||
                                                                "User Name: "}{" "}
                                                            (
                                                            {wallet.user_id ??
                                                                ""}
                                                            )
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-gray-500">
                                                    <p className="text-base ">
                                                        Số dư:
                                                    </p>
                                                    <span className="text-sm ml-1">
                                                        {Number(
                                                            wallet.coin ?? 0
                                                        ).toLocaleString(
                                                            "en-US"
                                                        )}{" "}
                                                        xu
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                                                    title="Xem chi tiết"
                                                    onClick={() => {
                                                        router.push(
                                                            `/wallet/wallet-Item?id=${wallet.id}`
                                                        );
                                                    }}
                                                >
                                                    <SwapOutlined />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex justify-end items-center gap-3 mt-3">
                            <Pagination
                                current={current || page}
                                total={Number(total)}
                                pageSize={PAGE_SIZE}
                                onChange={(p) => setPage(p)}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                </MyCard>
            </div>
        </MyForm>
    );
};

export default Content;
