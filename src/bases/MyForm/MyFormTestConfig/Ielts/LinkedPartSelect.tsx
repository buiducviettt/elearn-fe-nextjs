"use client";

import { Select } from "antd";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LinkOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { questionnaireService } from "@/services/questionnaire";
import { EXAM_SKILL, TEST_TYPES } from "@/types/enum";
import toastHandler from "@/utils/toastHandler";
import MyTooltip from "@/bases/MyTooltip";

type TProps = {
    value?: number | null;
    onChange: (value: number | null) => void;
    fullTitle?: string;
    sectionNumber: number;
    currentId?: number | string;
    usedIds?: (number | null | undefined)[];
};

const normalizeTitle = (title: string) =>
    (title || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

export const buildExpectedPartTitles = (
    fullTitle: string,
    sectionNumber: number,
) => {
    const base = normalizeTitle(fullTitle);
    return ["section", "part"].map((kw) => `${base} - ${kw} ${sectionNumber}`);
};

const LinkedPartSelect: React.FC<TProps> = ({
    value,
    onChange,
    fullTitle = "",
    sectionNumber,
    currentId,
    usedIds = [],
}) => {
    const [keyword, setKeyword] = useState("");

    const { data, isFetching } = useQuery({
        queryKey: [questionnaireService.keyGet, "linked-part", keyword],
        queryFn: () =>
            questionnaireService.get({
                type: TEST_TYPES.ielts,
                skill: EXAM_SKILL.listening,
                keyword: keyword || undefined,
                per_page: 50,
            }),
        select: (res: any) => res?.payload?.data?.list ?? [],
        staleTime: 60 * 1000,
    });

    const options = useMemo(() => {
        const list: any[] = Array.isArray(data) ? data : [];
        return list
            .filter((q) => String(q.questionnaire_id) !== String(currentId))
            .map((q) => {
                const id = Number(q.questionnaire_id);
                const duplicated =
                    usedIds.filter((u) => Number(u) === id).length > 0 &&
                    Number(value) !== id;
                return {
                    value: id,
                    label: duplicated
                        ? `${q.questionnaire_title} — (đã liên kết ở phần khác)`
                        : q.questionnaire_title,
                    title: q.questionnaire_title,
                };
            });
    }, [data, currentId, usedIds, value]);

    const autoDetect = async () => {
        if (!fullTitle.trim()) {
            toastHandler.error("Đề chưa có tiêu đề để dò");
            return;
        }

        const expected = buildExpectedPartTitles(fullTitle, sectionNumber);

        try {
            const res: any = await questionnaireService.get({
                type: TEST_TYPES.ielts,
                skill: EXAM_SKILL.listening,
                keyword: fullTitle.trim(),
                per_page: 100,
            });
            const list: any[] = res?.payload?.data?.list ?? [];

            const hit = list.find((q) =>
                expected.includes(normalizeTitle(q.questionnaire_title)),
            );

            if (!hit) {
                toastHandler.error(
                    `Không tìm thấy đề khớp "${fullTitle.trim()} - SECTION ${sectionNumber}"`,
                );
                return;
            }

            onChange(Number(hit.questionnaire_id));
            toastHandler.success(`Đã liên kết: ${hit.questionnaire_title}`);
        } catch {
            toastHandler.error("Dò đề liên kết thất bại");
        }
    };

    const isMissing =
        !!value &&
        !isFetching &&
        options.length > 0 &&
        !options.some((o) => o.value === Number(value));

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Select
                    className="flex-1"
                    allowClear
                    showSearch
                    loading={isFetching}
                    value={value ? Number(value) : undefined}
                    options={options}
                    placeholder={`Chọn đề PART cho SECTION ${sectionNumber}...`}
                    filterOption={false}
                    onSearch={setKeyword}
                    onChange={(v) => onChange(v ?? null)}
                    notFoundContent={
                        isFetching ? "Đang tải..." : "Không có đề phù hợp"
                    }
                    status={isMissing ? "warning" : undefined}
                />
                <MyTooltip title={`Dò đề có tên "... - SECTION ${sectionNumber}"`}>
                    <button
                        type="button"
                        onClick={autoDetect}
                        className="flex items-center gap-1 whitespace-nowrap rounded-md border border-slate-300 bg-slate-50 px-3 py-[6px] text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                    >
                        <ThunderboltOutlined />
                        Tự dò
                    </button>
                </MyTooltip>
            </div>

            {isMissing && (
                <p className="m-0 text-[12px] text-amber-600">
                    Đề liên kết (ID {String(value)}) không còn trong danh sách —
                    có thể đã bị xoá. Transcript sẽ không được đẩy xuống.
                </p>
            )}

            {!value && (
                <p className="m-0 flex items-center gap-1 text-[12px] text-slate-500">
                    <LinkOutlined />
                    Để trống nếu không muốn đẩy transcript của phần này sang đề
                    lẻ.
                </p>
            )}
        </div>
    );
};

export default LinkedPartSelect;
