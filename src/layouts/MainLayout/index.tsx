"use client";

import { Logo } from "@/assets";
import MyButton from "@/bases/MyButton";
import MyLink from "@/bases/MyLink";
import { URL_WP_HOME_PAGE, WP_DOMAIN } from "@/constants/common";
import useUser from "@/global-state/useUser";
import themeHandler from "@/utils/themeHandler";

import {
    AppstoreOutlined,
    RollbackOutlined,
    SettingOutlined,
    SearchOutlined,
    BellOutlined,
    LineChartOutlined,
    HeartOutlined,
    TeamOutlined,
    LogoutOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Logout from "./components/Logout";
import styles from "./styles.module.scss";
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "question-test",
        label: "Câu hỏi",
        icon: <AppstoreOutlined />,
        children: [
            {
                key: "/",
                label: <MyLink href="/">Danh sách câu hỏi</MyLink>,
            },
            {
                key: "/exam-config/",
                label: <MyLink href="/exam-config">Tạo câu hỏi</MyLink>,
            },
        ],
    },
    {
        key: "exercise-test",
        label: "Đề thi",
        icon: <AppstoreOutlined />,
        children: [
            {
                key: "/list-test/",
                label: <MyLink href="/list-test">Danh sách đề thi</MyLink>,
            },
            {
                key: "/test-config/",
                label: <MyLink href="/test-config">Tạo đề thi</MyLink>,
            },
        ],
    },
    {
        key: "course",
        label: "Khóa học",
        icon: <TeamOutlined />,
        children: [
            {
                key: "/course-list/",
                label: (
                    <MyLink href="/course/course-list">
                        Danh sách khóa học
                    </MyLink>
                ),
            },
            {
                key: "/course-create/",
                label: (
                    <MyLink href="/course/course-create">Tạo khóa học</MyLink>
                ),
            },
            {
                key: "/lesson-list/",
                label: (
                    <MyLink href="/course/lesson-list">Quản lý bài học</MyLink>
                ),
            },
            {
                key: "/lesson-create/",
                label: (
                    <MyLink href="/course/lesson-create">Tạo bài học</MyLink>
                ),
            },
        ],
    },
    {
        key: "wallet",
        label: "Giao dịch ví xu",
        icon: <LineChartOutlined />,
        children: [
            {
                key: "/wallet/wallet-list/",
                label: (
                    <MyLink href="/wallet/wallet-list">Danh sách Ví xu</MyLink>
                ),
            },
        ],
    },
    {
        key: "config",
        label: "Cấu hình",
        icon: <SettingOutlined />,
        children: [
            {
                key: "/config/test-category/",
                label: (
                    <MyLink href="/config/test-category">Danh mục đề</MyLink>
                ),
            },
            {
                key: "/config/question-skill/",
                label: (
                    <MyLink href="/config/question-skill">
                        Kỹ năng câu hỏi
                    </MyLink>
                ),
            },
            {
                key: "/config/question-level/",
                label: (
                    <MyLink href="/config/question-level">
                        Độ khó câu hỏi
                    </MyLink>
                ),
            },
            {
                key: "/config/question-category/",
                label: (
                    <MyLink href="/config/question-category">
                        Danh mục câu hỏi
                    </MyLink>
                ),
            },
            {
                key: "/config/question-part/",
                label: (
                    <MyLink href="/config/question-part">Phần câu hỏi</MyLink>
                ),
            },
        ],
    },
];

const MainLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { user } = useUser();
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const getPath = (pathname: string, items, parentItem): MenuItem[] => {
        for (const item of items) {
            if (item?.key === pathname) {
                return parentItem ? [parentItem, item] : [item];
            }

            if (item?.children) {
                const childPath = getPath(pathname, item.children, item);
                if (childPath.length) {
                    return childPath;
                }
            }
        }

        return [];
    };

    const paths = getPath(pathname, items, undefined).map((item) => item?.key);

    const onClick: MenuProps["onClick"] = (e) => {};

    return (
        <div className="flex flex-col h-full">
            <div className="h-h-header px-4 items-center flex gap-2 flex-shrink-0 border-b border-gray-200">
                <div className="flex items-center h-full gap-4">
                    <MyButton
                        type="link"
                        onClick={() => {
                            window.location.href = `${WP_DOMAIN}${URL_WP_HOME_PAGE}`;
                        }}
                        icon={<RollbackOutlined />}
                    >
                        Trở về
                    </MyButton>
                    <Logo />
                </div>
                <div className="flex-1"></div>
                <div className="flex gap-3 items-center">
                    <span className="px-2 py-1.5 rounded-lg bg-blue-50">
                        {user?.user_nicename || "--"}
                    </span>
                    <Logout />
                </div>
            </div>
            <div className="flex flex-1 min-h-0">
                <div className="flex-shrink-0 relative">
                    <div className="h-[calc(100vh-var(--h-header))] overflow-y-auto border-r border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        <Menu
                            onClick={onClick}
                            style={{
                                width: collapsed ? "64px" : "240px",
                                transition: "width 0.2s",
                                borderRight: "none",
                            }}
                            defaultSelectedKeys={[
                                paths[paths.length - 1] as string,
                            ]}
                            defaultOpenKeys={paths as string[]}
                            mode="inline"
                            items={items}
                            inlineCollapsed={collapsed}
                            className="[&_.ant-menu-item]:!m-0 [&_.ant-menu-submenu]:!m-0"
                        />
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-4 top-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full shadow-md border border-gray-200 transition-colors z-10"
                    >
                        {collapsed ? (
                            <DoubleRightOutlined />
                        ) : (
                            <DoubleLeftOutlined />
                        )}
                    </button>
                </div>
                <main className="flex-1 min-h-0 overflow-hidden">
                    <div className="max-h-[90vh] my-auto overflow-y-auto bg-white">
                        <div
                            className={`container px-4 mx-auto py-4 ${styles["frm-create-quest"]}`}
                        >
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
