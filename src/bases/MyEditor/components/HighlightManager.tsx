import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Select } from "antd";
import { questionService } from "@/services/question";
import { QUESTION_TYPES } from "@/types/enum";
import styles from "./HighlightManager.module.scss";

export const HIGHLIGHT_CLASS = "tinymce-highlight-tag";
export const HIGHLIGHT_DATA_ATTR = "data-highlight-id";

/** Unique instance ID – never changes, used to target a specific span */
export const HIGHLIGHT_UID_ATTR = "data-highlight-uid";

type TPhase = "hidden" | "button" | "input";

type TSelectOption = { label: string; value: string };

type TProps = {
    editor: any; // TinyMCE editor instance (available after onInit)
    containerRef: React.RefObject<HTMLDivElement | null>;
    /** IDs of top-level questions whose question_items populate the select */
    questions?: (string | number)[];
};

const HighlightManager: React.FC<TProps> = ({
    editor,
    containerRef,
    questions = [],
}) => {
    const [phase, setPhase] = useState<TPhase>("hidden");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [inputId, setInputId] = useState("");
    const [editingHighlightId, setEditingHighlightId] = useState<
        string | undefined
    >();
    const [editingUid, setEditingUid] = useState<string | undefined>();
    const bookmarkRef = useRef<any>(null);
    const selectRef = useRef<any>(null);

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

            setEditingHighlightId(undefined);
            setPosition(pos);
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
                setPosition(pos);
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
                setPosition(pos);
                setInputId(existingId);
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

        return () => {
            editor.off("mouseup", handleMouseUp);
            editor.off("keyup", handleKeyUp);
            editor.off("click", handleClick);
        };
    }, [editor]);

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
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        setPhase("input");
    };

    // ── Save: wrap selected text or update existing highlight ─────────
    const applyHighlight = () => {
        const bm = bookmarkRef.current;
        if (!bm) return;

        editor.focus();
        editor.selection.moveToBookmark(bm);

        const id = inputId.trim();

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
            }
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
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        bookmarkRef.current = null;
    };

    // ── Delete all: unwrap every highlight span (loop để xử lý nested spans) ──
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
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        bookmarkRef.current = null;
    };

    // ── Delete: unwrap the specific highlight span (by uid) ──────────
    const removeHighlight = () => {
        if (!editingUid) return;
        const span: HTMLElement | undefined = editor.dom.select(
            `span[${HIGHLIGHT_UID_ATTR}="${editingUid}"]`,
        )[0];
        if (span) {
            editor.dom.setOuterHTML(span, span.innerHTML);
        }
        setPhase("hidden");
        setInputId("");
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        bookmarkRef.current = null;
    };

    const cancel = () => {
        setPhase("hidden");
        setInputId("");
        setEditingHighlightId(undefined);
        setEditingUid(undefined);
        bookmarkRef.current = null;
    };

    if (phase === "hidden") return null;

    return (
        <div
            className={styles.popup}
            style={{ left: position.x, top: position.y }}
        >
            {phase === "button" && (
                <button
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
                                ? "Chỉnh sửa ID"
                                : "Gắn ID cho đoạn"}
                        </p>
                        <button
                            className={styles.btnClose}
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
                        placeholder="Chọn câu hỏi chi tiết..."
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
                    <div className={styles.btnGroup}>
                        <button
                            className={styles.btnSave}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={applyHighlight}
                            disabled={!inputId}
                        >
                            Lưu
                        </button>
                        {editingHighlightId && (
                            <>
                                <button
                                    className={styles.btnDelete}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={removeHighlight}
                                >
                                    Xóa
                                </button>
                                <button
                                    className={styles.btnDeleteAll}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={removeAllHighlights}
                                >
                                    Xóa tất cả
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HighlightManager;
