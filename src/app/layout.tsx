import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import RootClientLayout from "@/layouts/RootClientLayout";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "katex/dist/katex.min.css"; // style for mathematical formulas
import moment from "moment";
import "moment/locale/vi";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "REAL IELTS - KHÁM PHÁ TIỀM NĂNG CỦA BẠN",
    description: "REAL IELTS KHÁM PHÁ TIỀM NĂNG CỦA BẠN",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                {/* Favicons */}
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/wp-elearn/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/wp-elearn/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/wp-elearn/favicon-16x16.png"
                />
                <link rel="manifest" href="/wp-elearn/site.webmanifest" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen home`}
            >
                <NuqsAdapter>
                    <AntdRegistry>
                        <RootClientLayout>
                            <Toaster closeButton richColors />
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Timeline: {
                                            itemPaddingBottom: 10,
                                        },
                                    },
                                    token: {
                                        colorPrimary: `#2563eb`,
                                        controlHeight: 40,
                                    },
                                }}
                                locale={viVN}
                            >
                                {children}
                            </ConfigProvider>
                        </RootClientLayout>
                    </AntdRegistry>
                </NuqsAdapter>
            </body>
        </html>
    );
}
