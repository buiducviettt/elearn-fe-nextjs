import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Select } from "antd";
import {
    CaretRightOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { questionService } from "@/services/question";
import { QUESTION_TYPES } from "@/types/enum";
import styles from "./HighlightManager.module.scss";

export const HIGHLIGHT_CLASS = "tinymce-highlight-tag";
export const HIGHLIGHT_DATA_ATTR = "data-highlight-id";

/** Unique instance ID – never changes, used to target a specific span */
export const HIGHLIGHT_UID_ATTR = "data-highlight-uid";

export const HIGHLIGHT_TIME_ATTR = "data-audio-time";

type TPhase = "hidden" | "button" | "input";

type TSelectOption = { label: string; value: string };

type TProps = {
    editor: any; // TinyMCE editor instance (available after onInit)
    containerRef: React.RefObject<HTMLDivElement | null>;
    /** IDs of top-level questions whose question_items populate the select */
    questions?: (string | number)[];
    audioRef?: React.RefObject<HTMLAudioElement | null>;
};

export const formatAudioTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return "";
    const total = Math.floor(seconds);
    const mm = Math.floor(total / 60);
    const ss = total % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

export const parseAudioTime = (input: string): number | null => {
    const raw = (input || "").trim();
    if (!raw) return null;

    const parts = raw.split(":");
    if (parts.length > 3) return null;
    if (parts.some((p) => p.trim() === "" || !/^\d+(\.\d+)?$/.test(p.trim())))
        return null;

    const nums = parts.map((p) => Number(p.trim()));
    const seconds = nums.reduce((acc, n) => acc * 60 + n, 0);
    return isFinite(seconds) && seconds >= 0 ? seconds : null;
};

const HighlightManager: React.FC<TProps> = ({
    editor,
    containerRef,
    questions = [],
    audioRef,
}) => {
    const [phase, setPhase] = useState<TPhase>("hidden");
    const [position, setPosition] = useState({ x: 0, y: 0, arrowX: 14 });
    const [inputId, setInputId] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [timeError, setTimeError] = useState(false);
    const [editingHighlightId, setEditingHighlightId] = useState<
        string | undefined
    >();
    const [editingUid, setEditingUid] = useState<string | undefined>();
    const [offscreen, setOffscreen] = useState(false);
    const [confirmAll, setConfirmAll] = useState(false);
    const [allCount, setAllCount] = useState(0);
    const bookmarkRef = useRef<any>(null);
    const selectRef = useRef<any>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<
        { type: "element"; el: Element } | { type: "range"; range: Range } | null
    >(null);

    // ── Fetch question details to build select options ────────────────
    const questionQueries = useQueries({
        queries: questions.map((id) => ({
            queryKey: [questionService.keyGetDetail, id],
            queryFn: () => questionService.getDetail(id),
            select: (data: any) => data?.payload?.data,
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        })),
    });

    /** Strip HTML tags and decode basic entities to get plain text */
    const stripHtml = (html: string): string => {
        if (!html) return "";
        return html
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, " ")
            .trim();
    };

    const selectOptions = useMemo<TSelectOption[]>(() => {
        const opts: TSelectOption[] = [];
        questionQueries.forEach((q) => {
            const question = q.data as any;
            if (!question) return;
            const questionTitle = stripHtml(question.question_title ?? "");
            const items: any[] = question.question_items ?? [];
            items.forEach((item) => {
                const { id, type, title, answer } = item;
                if (
                    type === QUESTION_TYPES.fill_in_the_blank ||
                    type === QUESTION_TYPES.drag
                ) {
                    // answer is a 2-D array: answer[i] = acceptable answers for blank i
                    const answerGroups: any[] = Array.isArray(answer)
                        ? answer
                        : [];
                    answerGroups.forEach((group, index) => {
                        const answerText = Array.isArray(group)
                            ? String(group[0] ?? `Đáp án ${index + 1}`)
                            : String(group ?? `Đáp án ${index + 1}`);
                        const prefix = questionTitle || stripHtml(title);
                        const label = prefix
                            ? `${prefix} - ${answerText}`
                            : answerText;
                        opts.push({
                            label,
                            value: `${id}_${index}`,
                        });
                    });
                } else {
                    // single_choice, multiple_choice, etc. – one option per item
                    opts.push({
                        label: stripHtml(title) || questionTitle || String(id),
                        value: String(id),
                    });
                }
            });
        });
        return opts;
    }, [questionQueries]);

    /**
     * Convert a DOMRect from inside the TinyMCE iframe coordinate space
     * into absolute pixel offsets relative to the outer container div.
     *
     * Both getBoundingClientRect() calls return viewport-relative coords,
     * so subtracting containerRect cancels out any parent-page scroll and
     * gives a stable position for `position:absolute` children of the container.
     */
    const getPositionFromRect = (
        rect: DOMRect,
    ): { x: number; y: number } | null => {
        const container = containerRef.current;
        if (!container) return null;

        const iframeEl = editor.getContainer()?.querySelector("iframe");
        if (!iframeEl) return null;

        const iframeRect = iframeEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return {
            x: iframeRect.left - containerRect.left + rect.left,
            y: iframeRect.top - containerRect.top + rect.bottom + 6,
        };
    };

    const getAnchorRect = (): DOMRect | null => {
        const anchor = anchorRef.current;
        if (!anchor) return null;

        if (anchor.type === "element") {
            if (!anchor.el.isConnected) return null;
            return anchor.el.getBoundingClientRect();
        }

        let rect: DOMRect = anchor.range.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
            const rects = anchor.range.getClientRects();
            if (rects.length === 0) return null;
            rect = rects[rects.length - 1] as DOMRect;
        }
        return rect;
    };

    const syncRef = useRef<() => void>(() => {});

    const syncPositionToAnchor = () => {
        const rect = getAnchorRect();
        if (!rect) return;

        const iframeEl = editor?.getContainer()?.querySelector("iframe");
        if (!iframeEl) return;

        const iframeRect = iframeEl.getBoundingClientRect();
        const visible =
            rect.bottom > iframeRect.top && rect.top < iframeRect.bottom;
        setOffscreen(!visible);

        const pos = getPositionFromRect(rect);
        if (!pos) return;

        const container = containerRef.current;
        const barWidth = popupRef.current?.offsetWidth ?? 0;
        const maxX = Math.max(0, (container?.clientWidth ?? 0) - barWidth - 4);
        const x = Math.min(Math.max(0, pos.x), maxX);
        const arrowX = Math.min(
            Math.max(8, pos.x - x + 8),
            Math.max(8, barWidth - 16),
        );

        setPosition({ x, y: pos.y, arrowX });
    };

    syncRef.current = syncPositionToAnchor;

    useEffect(() => {
        if (!editor) return;

        // ── Selection (drag or keyboard Shift+arrow) ─────────────────────
        const handleMouseUp = () => {
            const sel = editor.selection;
            if (!sel) return;

            const selectedText = sel.getContent({ format: "text" }).trim();
            if (selectedText.length === 0) return;

            const range = sel.getRng();
            if (!range) return;

            let rect: DOMRect = range.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) {
                const rects = range.getClientRects();
                if (rects.length === 0) return;
                rect = rects[rects.length - 1] as DOMRect;
            }

            const pos = getPositionFromRect(rect);
            if (!pos) return;

            anchorRef.current = { type: "range", range: range.cloneRange() };
            setEditingHighlightId(undefined);
            setOffscreen(false);
            setPosition({ ...pos, arrowX: 14 });
            setPhase("button");
        };

        // ── Keyboard selection change ─────────────────────────────────────
        const handleKeyUp = () => {
            const sel = editor.selection;
            if (!sel) return;

            const selectedText = sel.getContent({ format: "text" }).trim();
            if (selectedText.length === 0) {
                setPhase((prev) => (prev === "button" ? "hidden" : prev));
                return;
            }

            const range = sel.getRng();
            if (!range) return;

            let rect: DOMRect = range.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) {
                const rects = range.getClientRects();
                if (rects.length === 0) return;
                rect = rects[rects.length - 1] as DOMRect;
            }

            const pos = getPositionFromRect(rect);
            if (pos) {
                anchorRef.current = { type: "range", range: range.cloneRange() };
                setOffscreen(false);
                setPosition({ ...pos, arrowX: 14 });
                setPhase("button");
            }
        };

        // ── Single-click: detect click on existing highlight ──────────────
        const handleClick = () => {
            const sel = editor.selection;
            if (!sel) return;

            // If there IS a text selection, mouseup already handled it
            const selectedText = sel.getContent({ format: "text" }).trim();
            if (selectedText.length > 0) return;

            const node = sel.getNode();
            if (!node || node.nodeName === "BODY") {
                setPhase((prev) => (prev === "button" ? "hidden" : prev));
                return;
            }

            // Walk up the DOM to find a highlight span
            let highlightSpan: Element | null = null;
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as Element;
                highlightSpan = el.classList?.contains(HIGHLIGHT_CLASS)
                    ? el
                    : (el.closest?.(`.${HIGHLIGHT_CLASS}`) ?? null);
            } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                const parent = node.parentElement;
                highlightSpan = parent.classList?.contains(HIGHLIGHT_CLASS)
                    ? parent
                    : (parent.closest?.(`.${HIGHLIGHT_CLASS}`) ?? null);
            }

            if (highlightSpan) {
                const rect = highlightSpan.getBoundingClientRect();
                const pos = getPositionFromRect(rect);
                if (!pos) return;

                const existingId =
                    highlightSpan.getAttribute(HIGHLIGHT_DATA_ATTR) || "";
                const existingUid =
                    highlightSpan.getAttribute(HIGHLIGHT_UID_ATTR) || "";
                const existingTime =
                    highlightSpan.getAttribute(HIGHLIGHT_TIME_ATTR) || "";
                anchorRef.current = { type: "element", el: highlightSpan };
                setOffscreen(false);
                setPosition({ ...pos, arrowX: 14 });
                setInputId(existingId);
                setTimeError(false);
                setInputTime(
                    existingTime !== "" && !isNaN(Number(existingTime))
                        ? formatAudioTime(Number(existingTime))
                        : "",
                );
                setEditingHighlightId(existingId);
                setEditingUid(existingUid);
                setPhase("input");
                bookmarkRef.current = editor.selection.getBookmark(2, true);
            } else {
                setPhase((prev) => (prev === "button" ? "hidden" : prev));
            }
        };

        editor.on("mouseup", handleMouseUp);
        editor.on("keyup", handleKeyUp);
        editor.on("click", handleClick);
        const onNodeChange = () => syncRef.current();
        editor.on("NodeChange", onNodeChange);

        return () => {
            editor.off("mouseup", handleMouseUp);
            editor.off("keyup", handleKeyUp);
            editor.off("click", handleClick);
            editor.off("NodeChange", onNodeChange);
        };
    }, [editor]);

    useEffect(() => {
        if (!editor || phase === "hidden") return;

        const doc: Document | undefined = editor.getDoc?.();
        const win: Window | undefined = editor.getWin?.();
        const container = containerRef.current;

        let frame = 0;
        const onViewportChange = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => syncRef.current());
        };

        doc?.addEventListener("scroll", onViewportChange, true);
        win?.addEventListener("resize", onViewportChange);
        window.addEventListener("scroll", onViewportChange, true);
        window.addEventListener("resize", onViewportChange);

        const observer =
            container && typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(onViewportChange)
                : null;
        observer?.observe(container as Element);

        syncRef.current();

        return () => {
            cancelAnimationFrame(frame);
            doc?.removeEventListener("scroll", onViewportChange, true);
            win?.removeEventListener("resize", onViewportChange);
            window.removeEventListener("scroll", onViewportChange, true);
            window.removeEventListener("resize", onViewportChange);
            observer?.disconnect();
        };
    }, [editor, phase]);

    useEffect(() => {
        if (!editor) return;

        const doc: Document | undefined = editor.getDoc?.();
        const head = doc?.head;
        if (!head) return;

        const STYLE_ID = "__highlight_editing_style";
        let styleEl = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!styleEl) {
            styleEl = doc.createElement("style");
            styleEl.id = STYLE_ID;
            head.appendChild(styleEl);
        }

        const target = phase === "input" ? editingUid : undefined;
        styleEl.textContent = target
            ? `span[${HIGHLIGHT_UID_ATTR}="${target}"]{
                   background-color: rgba(37, 99, 235, 0.28) !important;
                   border-bottom: 2px solid #2563eb !important;
                   box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.35);
                   border-radius: 2px;
               }`
            : "";
    }, [editor, phase, editingUid]);

    // Auto-focus select when the input box appears
    useEffect(() => {
        if (phase === "input") {
            const t = setTimeout(() => selectRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [phase]);

    // ── Tag button clicked: save bookmark so we can restore selection ──
    const handleTagButtonMouseDown = (e: React.MouseEvent) => {
        // preventDefault keeps TinyMCE focused (prevents selection loss)
        e.preventDefault();
        bookmarkRef.current = editor.selection.getBookmark(2, true);
        setInputId("");
        const current = audioRef?.current?.currentTime ?? 0;
        setInputTime(current > 0 ? formatAudioTime(current) : "");
        setTimeError(false);
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        setPhase("input");
    };

    const captureCurrentTime = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        setInputTime(formatAudioTime(audio.currentTime));
        setTimeError(false);
    };

    const previewTime = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        const seconds = parseAudioTime(inputTime);
        if (seconds === null) {
            setTimeError(true);
            return;
        }
        try {
            audio.currentTime = seconds;
        } catch {
            return;
        }
        audio.play().catch(() => {});
    };

    // ── Save: wrap selected text or update existing highlight ─────────
    const applyHighlight = () => {
        const bm = bookmarkRef.current;
        if (!bm) return;

        const id = inputId.trim();

        const rawTime = inputTime.trim();
        const seconds = parseAudioTime(rawTime);
        if (rawTime !== "" && seconds === null) {
            setTimeError(true);
            return;
        }
        const timeAttr =
            seconds === null ? "" : String(Math.round(seconds * 100) / 100);

        editor.focus();
        editor.selection.moveToBookmark(bm);

        if (editingUid) {
            // Target by uid to update only this specific span
            const span: Element | undefined = editor.dom.select(
                `span[${HIGHLIGHT_UID_ATTR}="${editingUid}"]`,
            )[0];
            if (span) {
                span.setAttribute(
                    HIGHLIGHT_DATA_ATTR,
                    id || editingHighlightId || "",
                );
                if (timeAttr) span.setAttribute(HIGHLIGHT_TIME_ATTR, timeAttr);
                else span.removeAttribute(HIGHLIGHT_TIME_ATTR);
            }
            editor.nodeChanged();
            editor.fire("change");
        } else {
            const range = editor.selection.getRng();
            if (!range || range.collapsed) {
                setPhase("hidden");
                return;
            }
            const highlightId = id || `h_${Date.now()}`;
            let uidCounter: number = editor.dom.select(
                `span[${HIGHLIGHT_DATA_ATTR}="${highlightId}"]`,
            ).length;

            const doc = editor.getDoc() as Document;

            // Helper: wrap a sub-range in a new highlight span
            const wrapSubRange = (sr: Range): HTMLSpanElement => {
                uidCounter++;
                const uid = `${highlightId}_${uidCounter}`;
                const span = doc.createElement("span");
                span.className = HIGHLIGHT_CLASS;
                span.setAttribute(HIGHLIGHT_DATA_ATTR, highlightId);
                span.setAttribute(HIGHLIGHT_UID_ATTR, uid);
                if (timeAttr) span.setAttribute(HIGHLIGHT_TIME_ATTR, timeAttr);
                const fragment = sr.extractContents();
                span.appendChild(fragment);
                sr.insertNode(span);
                return span;
            };

            // Tìm tất cả leaf-block (block không chứa block con) giao với selection
            // Dùng TreeWalker để tránh chọn nhầm container-div bên ngoài
            const leafBlocks: HTMLElement[] = [];
            const walker = doc.createTreeWalker(
                editor.getBody(),
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node: Node) => {
                        if (!range.intersectsNode(node))
                            return NodeFilter.FILTER_REJECT;
                        if (!editor.dom.isBlock(node))
                            return NodeFilter.FILTER_SKIP;
                        const hasBlockChild = Array.from(
                            (node as Element).children,
                        ).some((c) => !!editor.dom.isBlock(c));
                        if (hasBlockChild) return NodeFilter.FILTER_SKIP;
                        // Bỏ qua block rỗng (p>br hoặc p rỗng):
                        // Một block rỗng có textContent="" và chỉ chứa BR (hoặc không có gì)
                        const el = node as HTMLElement;
                        const text = (el.textContent ?? "")
                            .replace(/\u00a0/g, "")
                            .trim();
                        if (text === "") return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    },
                },
            );
            let wn: Node | null;
            while ((wn = walker.nextNode())) leafBlocks.push(wn as HTMLElement);

            if (leafBlocks.length === 0) {
                setPhase("hidden");
                return;
            }

            if (leafBlocks.length === 1) {
                // Selection nằm trong 1 block duy nhất — wrap toàn bộ range gốc,
                // KHÔNG tách block thành nhiều phần
                const block = leafBlocks[0];

                // Clamp range endpoints vào trong block
                const sr = doc.createRange();
                if (block.contains(range.startContainer)) {
                    sr.setStart(range.startContainer, range.startOffset);
                } else {
                    sr.setStart(block.firstChild ?? block, 0);
                }
                if (block.contains(range.endContainer)) {
                    sr.setEnd(range.endContainer, range.endOffset);
                } else {
                    const last = block.lastChild;
                    if (last?.nodeType === Node.TEXT_NODE) {
                        sr.setEnd(last, (last as Text).length);
                    } else {
                        sr.setEnd(block, block.childNodes.length);
                    }
                }

                if (!sr.collapsed) {
                    const span = wrapSubRange(sr);
                    const newRange = doc.createRange();
                    newRange.setStartAfter(span);
                    newRange.collapse(true);
                    const domSel = editor.selection.getSel();
                    if (domSel) {
                        domSel.removeAllRanges();
                        domSel.addRange(newRange);
                    }
                }
            } else {
                // Selection trải qua nhiều block.
                // Snapshot tọa độ range cho từng block TRƯỚC khi mutate DOM.
                // Sau đó xử lý theo thứ tự NGƯỢC để các DOM mutation phía sau
                // không ảnh hưởng tới tọa độ của block phía trước.
                const startBlock = leafBlocks[0];
                const endBlock = leafBlocks[leafBlocks.length - 1];

                type SnapshotRange = {
                    startContainer: Node;
                    startOffset: number;
                    endContainer: Node;
                    endOffset: number;
                };

                const snapshots: SnapshotRange[] = leafBlocks.map((block) => {
                    // Điểm bắt đầu
                    let startContainer: Node;
                    let startOffset: number;
                    if (
                        block === startBlock &&
                        block.contains(range.startContainer)
                    ) {
                        startContainer = range.startContainer;
                        startOffset = range.startOffset;
                    } else {
                        startContainer = block.firstChild ?? block;
                        startOffset = 0;
                    }

                    // Điểm kết thúc
                    let endContainer: Node;
                    let endOffset: number;
                    if (
                        block === endBlock &&
                        block.contains(range.endContainer)
                    ) {
                        endContainer = range.endContainer;
                        endOffset = range.endOffset;
                    } else {
                        // Tìm lastChild bỏ qua bogus BR của TinyMCE
                        let last: ChildNode | null = block.lastChild;
                        while (
                            last?.nodeType === Node.ELEMENT_NODE &&
                            (last as Element).getAttribute("data-mce-bogus")
                        ) {
                            last = last.previousSibling;
                        }
                        if (!last) {
                            endContainer = block;
                            endOffset = 0;
                        } else if (last.nodeType === Node.TEXT_NODE) {
                            endContainer = last;
                            endOffset = (last as Text).length;
                        } else {
                            endContainer = block;
                            endOffset = block.childNodes.length;
                        }
                    }

                    return {
                        startContainer,
                        startOffset,
                        endContainer,
                        endOffset,
                    };
                });

                // Mutate DOM từ cuối lên đầu để tọa độ snapshot đầu vẫn hợp lệ
                for (let i = snapshots.length - 1; i >= 0; i--) {
                    const snap = snapshots[i];
                    const sr = doc.createRange();
                    try {
                        sr.setStart(snap.startContainer, snap.startOffset);
                        sr.setEnd(snap.endContainer, snap.endOffset);
                    } catch {
                        continue;
                    }
                    if (!sr.collapsed) wrapSubRange(sr);
                }
            }

            editor.nodeChanged();
            editor.fire("change");
        }

        setPhase("hidden");
        setInputId("");
        setInputTime("");
        setTimeError(false);
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        setOffscreen(false);
        setConfirmAll(false);
        bookmarkRef.current = null;
        anchorRef.current = null;
    };

    // ── Delete all: unwrap every highlight span (loop để xử lý nested spans) ──
    const openConfirmAll = () => {
        const spans = editor.dom.select(`span.${HIGHLIGHT_CLASS}`);
        setAllCount(spans.length);
        setConfirmAll(true);
    };

    const removeAllHighlights = () => {
        // setOuterHTML thay thế node → ref cũ bị detach, cần lặp lại đến khi hết
        for (let i = 0; i < 10; i++) {
            const spans: HTMLElement[] = editor.dom.select(
                `span.${HIGHLIGHT_CLASS}`,
            );
            if (spans.length === 0) break;
            spans.forEach((span) => {
                editor.dom.setOuterHTML(span, span.innerHTML);
            });
        }
        editor.nodeChanged();
        editor.fire("change");
        setPhase("hidden");
        setInputId("");
        setInputTime("");
        setTimeError(false);
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        setOffscreen(false);
        setConfirmAll(false);
        bookmarkRef.current = null;
        anchorRef.current = null;
    };

    // ── Delete: unwrap the specific highlight span (by uid) ──────────
    const removeHighlight = () => {
        if (!editingUid) return;
        const span: HTMLElement | undefined = editor.dom.select(
            `span[${HIGHLIGHT_UID_ATTR}="${editingUid}"]`,
        )[0];
        if (span) {
            editor.dom.setOuterHTML(span, span.innerHTML);
            editor.nodeChanged();
            editor.fire("change");
        }
        setPhase("hidden");
        setInputId("");
        setInputTime("");
        setTimeError(false);
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        setOffscreen(false);
        setConfirmAll(false);
        bookmarkRef.current = null;
        anchorRef.current = null;
    };

    const cancel = () => {
        setPhase("hidden");
        setInputId("");
        setInputTime("");
        setTimeError(false);
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        setOffscreen(false);
        setConfirmAll(false);
        bookmarkRef.current = null;
        anchorRef.current = null;
    };

    if (phase === "hidden") return null;

    return (
        <div
            ref={popupRef}
            className={styles.popup}
            style={
                {
                    left: position.x,
                    top: position.y,
                    display: offscreen ? "none" : undefined,
                    "--arrow-x": `${position.arrowX}px`,
                } as React.CSSProperties
            }
        >
            {phase === "button" && (
                <button
                    type="button"
                    className={styles.tagButton}
                    onMouseDown={handleTagButtonMouseDown}
                >
                    Gắn ID
                </button>
            )}

            {phase === "input" && (
                <div className={styles.inputBox}>
                    <div className={styles.inputHeader}>
                        <p className={styles.inputLabel}>
                            {editingHighlightId
                                ? "Chỉnh sửa vị trí đáp án"
                                : "Gắn đáp án cho đoạn"}
                        </p>
                        <button
                            type="button"
                            className={styles.btnClose}
                            title="Đóng"
                            aria-label="Đóng"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={cancel}
                        >
                            ×
                        </button>
                    </div>

                    <Select
                        ref={selectRef}
                        className={styles.idInput}
                        style={{ width: "100%" }}
                        value={inputId || undefined}
                        onChange={(value) => setInputId(String(value))}
                        options={selectOptions}
                        placeholder="Chọn đáp án..."
                        showSearch
                        filterOption={(input, option) =>
                            String(option?.label)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Escape") cancel();
                        }}
                        getPopupContainer={(trigger) =>
                            trigger.closest(`.${styles.popup}`) || document.body
                        }
                        notFoundContent="Không có câu hỏi"
                    />

                    {audioRef && (
                        <div className={styles.timeBlock}>
                            <label className={styles.timeLabel}>
                                Mốc audio
                            </label>
                            <div
                                className={`${styles.timeGroup} ${
                                    timeError ? styles.timeGroupError : ""
                                }`}
                            >
                                <input
                                    className={styles.timeInput}
                                    value={inputTime}
                                    placeholder="mm:ss"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        setInputTime(e.target.value);
                                        setTimeError(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") cancel();
                                        if (e.key === "Enter") applyHighlight();
                                    }}
                                />
                                <button
                                    type="button"
                                    className={styles.timeIconBtn}
                                    title="Lấy mốc đang phát của audio transcript"
                                    aria-label="Lấy mốc hiện tại"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={captureCurrentTime}
                                >
                                    <ClockCircleOutlined />
                                </button>
                                <button
                                    type="button"
                                    className={styles.timeIconBtn}
                                    title="Nghe thử từ mốc này"
                                    aria-label="Nghe thử"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={previewTime}
                                    disabled={!inputTime.trim()}
                                >
                                    <CaretRightOutlined />
                                </button>
                            </div>
                        </div>
                    )}

                    {timeError && (
                        <p className={styles.timeErrorText}>
                            Mốc thời gian không hợp lệ. Nhập dạng mm:ss (vd
                            01:23), để trống nếu không gắn.
                        </p>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.btnSave}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={applyHighlight}
                            disabled={!inputId}
                        >
                            Lưu
                        </button>
                        {editingHighlightId && (
                            <button
                                type="button"
                                className={styles.btnIconDanger}
                                title="Xoá vị trí đáp án này"
                                aria-label="Xoá vị trí đáp án này"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={removeHighlight}
                            >
                                <DeleteOutlined />
                            </button>
                        )}
                    </div>

                    {editingHighlightId &&
                        (confirmAll ? (
                            <div className={styles.confirmRow}>
                                <p className={styles.confirmText}>
                                    Xoá hết <b>{allCount}</b> vị trí đáp án của
                                    phần này? Không hoàn tác được bằng nút này.
                                </p>
                                <div className={styles.confirmBtns}>
                                    <button
                                        type="button"
                                        className={styles.btnConfirmDanger}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={removeAllHighlights}
                                    >
                                        Xoá hết
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.btnConfirmCancel}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setConfirmAll(false)}
                                    >
                                        Huỷ
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className={styles.linkDanger}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={openConfirmAll}
                            >
                                Xoá toàn bộ các vị trí đáp án của phần này
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export default HighlightManager;
