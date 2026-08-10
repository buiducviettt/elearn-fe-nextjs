"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { walletService } from "@/services/wallet";
import { userService } from "@/services/user";
import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import { Table, Button, Skeleton, Card, Avatar, Tag, Select } from "antd";
import { LOGO_URL } from "@/assets";
import {
    UserOutlined,
    MailOutlined,
    IdcardOutlined,
    DollarCircleOutlined,
    ArrowLeftOutlined,
    HistoryOutlined,
} from "@ant-design/icons";
import { WALLET_TRANSACTION_TYPE } from "@/types/enum";

// Map type sang nhãn tiếng Việt
const TYPE_LABELS: Record<string, string> = {
    order: "Đơn hàng",
    bonus: "Thưởng",
    speaking: "Lượt chấm bài nói",
    writing: "Lượt chấm bài viết",
};

const getTransactionTypeLabel = (type: string) => {
    return (
        WALLET_TRANSACTION_TYPE[type as keyof typeof WALLET_TRANSACTION_TYPE] ||
        type
    );
};

// Lấy tất cả method từ enum WALLET_TRANSACTION_TYPE
const methodOptions = Object.entries(WALLET_TRANSACTION_TYPE).map(
    ([key, value]) => ({
        label: value,
        value: key,
    })
);

const WalletDetailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const walletId = searchParams.get("id");
    const [selectedMethod, setSelectedMethod] = useState<string | undefined>(
        undefined
    );

    const [wallet, setWallet] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [txLoading, setTxLoading] = useState(false);
    const firstFilterRun = useRef(true);

    // Filter transactions theo method nếu có chọn
    const filteredTransactions = selectedMethod
        ? transactions.filter((tx) => tx.method === selectedMethod)
        : transactions;

    // Lấy thông tin ví + user + lần tải giao dịch đầu tiên (loading trang)
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                if (!walletId) {
                    setWallet(null);
                    setUser(null);
                    setTransactions([]);
                    setLoading(false);
                    return;
                }
                const walletRes = await walletService.get({ id: walletId });
                console.log("[WalletDetail] walletRes:", walletRes);

                const walletData =
                    walletRes.payload?.data?.list?.[0] ||
                    walletRes.payload?.data?.list ||
                    walletRes.payload?.data ||
                    walletRes.payload;
                setWallet(walletData);

                if (walletData?.user_id) {
                    const userRes = await userService.get({
                        id: walletData.user_id,
                    });
                    const userData = Array.isArray(userRes.payload)
                        ? userRes.payload[0]
                        : userRes.payload;
                    setUser(userData);
                }

                // tải transactions lần đầu
                setTxLoading(true);
                const txRes = await walletService.transactions(walletId, {});
                console.log("[WalletDetail] txRes(first):", txRes);
                const txList =
                    txRes.payload?.data?.list ||
                    txRes.payload?.data ||
                    txRes.payload;
                setTransactions(Array.isArray(txList) ? txList : []);
            } catch {
                setWallet(null);
                setUser(null);
                setTransactions([]);
            } finally {
                setTxLoading(false);
                setLoading(false);
            }
        };
        firstFilterRun.current = true; // reset chặn effect filter
        fetchAll();
    }, [walletId]);

    // Khi đổi filter method: chỉ load lại bảng
    useEffect(() => {
        if (!walletId) return;
        if (firstFilterRun.current) {
            firstFilterRun.current = false;
            return; // bỏ lần chạy đầu tiên (đã load ở effect trên)
        }
        const fetchTx = async () => {
            try {
                setTxLoading(true);
                const params: any = {};
                if (selectedMethod) params.method = selectedMethod;
                const txRes = await walletService.transactions(
                    walletId,
                    params
                );
                console.log("[WalletDetail] txRes(filter):", txRes);
                const txList =
                    txRes.payload?.data?.list ||
                    txRes.payload?.data ||
                    txRes.payload;
                setTransactions(Array.isArray(txList) ? txList : []);
            } finally {
                setTxLoading(false);
            }
        };
        fetchTx();
    }, [selectedMethod, walletId]);

    return (
        <MyCard>
            <Button
                onClick={() => router.back()}
                className="mb-6"
                icon={<ArrowLeftOutlined />}
                type="link"
                style={{ fontWeight: 500, fontSize: 16 }}
            >
                Quay lại
            </Button>
            {loading ? (
                <div className="flex flex-col gap-4">
                    <Skeleton active avatar paragraph={{ rows: 2 }} />
                    <Skeleton active title={false} paragraph={{ rows: 5 }} />
                </div>
            ) : !wallet ? (
                <MyEmpty />
            ) : (
                <div className="flex flex-col gap-6">
                    <Card
                        bordered={false}
                        className="shadow-md rounded-xl"
                        style={{
                            maxWidth: 500,
                            background: "#f9fafb",
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={user?.avatar_urls?.[0] || LOGO_URL}
                                size={64}
                                icon={<UserOutlined />}
                                className="border"
                                style={{ background: "#fff" }}
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-lg flex items-center gap-2">
                                    <UserOutlined className="text-blue-500" />
                                    {user?.name || (
                                        <span className="text-gray-400">
                                            Không có tên
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-gray-600">
                                    <MailOutlined />
                                    <span>
                                        {user?.user_email || "Không có email"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-gray-600">
                                    <IdcardOutlined />
                                    <span>ID ví:</span>
                                    <Tag color="blue">{wallet.id}</Tag>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-gray-600">
                                    <DollarCircleOutlined />
                                    <span>Số dư:</span>
                                    <Tag
                                        color="gold"
                                        style={{ fontWeight: 600 }}
                                    >
                                        {Number(
                                            wallet.coin ?? 0
                                        ).toLocaleString("en-US")}{" "}
                                        xu
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <MyCard className="shadow rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <HistoryOutlined className="mr-2" />
                            <span className="font-semibold text-base">
                                Lịch sử giao dịch
                            </span>
                            <Select
                                allowClear
                                placeholder="Lọc theo hình thức"
                                className="ml-4 w-52"
                                options={methodOptions}
                                value={selectedMethod}
                                onChange={setSelectedMethod}
                                style={{ marginLeft: "auto" }}
                            />
                        </div>
                        <Table
                            dataSource={filteredTransactions}
                            rowKey="id"
                            loading={txLoading}
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: <MyEmpty /> }}
                            scroll={{ x: 800 }}
                            columns={[
                                {
                                    title: "ID",
                                    dataIndex: "id",
                                    key: "id",
                                    width: 80,
                                    align: "center",
                                },
                                {
                                    title: "Loại",
                                    dataIndex: "type",
                                    key: "type",
                                    width: 120,
                                    align: "center",
                                    render: (type: string) => (
                                        <Tag
                                            color={
                                                type === "bonus"
                                                    ? "green"
                                                    : type === "order"
                                                    ? "blue"
                                                    : type === "speaking"
                                                    ? "orange"
                                                    : "purple"
                                            }
                                        >
                                            {TYPE_LABELS[type] || type}
                                        </Tag>
                                    ),
                                },
                                {
                                    title: "Hình thức",
                                    dataIndex: "method",
                                    key: "method",
                                    width: 120,
                                    align: "center",
                                    render: (method: string) => (
                                        <Tag color="purple">
                                            {getTransactionTypeLabel(method)}
                                        </Tag>
                                    ),
                                },
                                {
                                    title: "Số tiền",
                                    dataIndex: "amount",
                                    key: "amount",
                                    align: "right",
                                    render: (v) => (
                                        <span style={{ fontWeight: 500 }}>
                                            {Number(v).toLocaleString("en-US")}{" "}
                                            xu
                                        </span>
                                    ),
                                },
                                {
                                    title: "Mô tả",
                                    dataIndex: "description",
                                    key: "description",
                                    render: (desc: string) => (
                                        <span className="text-gray-700">
                                            {desc}
                                        </span>
                                    ),
                                },
                                {
                                    title: "Ngày",
                                    dataIndex: "created",
                                    key: "created",
                                    width: 160,
                                    align: "center",
                                },
                            ]}
                        />
                    </MyCard>
                </div>
            )}
        </MyCard>
    );
};

export default WalletDetailContent;
