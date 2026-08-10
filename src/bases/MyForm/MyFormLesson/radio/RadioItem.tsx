"use client";

import React, { useRef } from "react";

type BaseNode = {
    id: string | number;
    name?: string;
    slug?: string | null;
    parent?: string | number | null;
    children?: BaseNode[];
};

type Props<T extends BaseNode> = {
    node: T;
    level?: number;
    selectedId?: string | number | null;
    selectedIds?: (string | number)[];
    multiple?: boolean;
    onSelect: (node: T | null) => void;
    renderChildren?: (children: T[], level: number) => React.ReactNode;
    radioName?: string;
    hiddenPrefix?: string;
};

const RadioItem = <T extends BaseNode>({
    node,
    level = 0,
    selectedId,
    selectedIds,
    multiple = false,
    onSelect,
    renderChildren,
    radioName = "radio_single",
    hiddenPrefix = "",
}: Props<T>) => {
    const isSelected = multiple
        ? (selectedIds ?? []).some((id) => String(id) === String(node.id))
        : String(selectedId) === String(node.id);
    const isChild =
        node.parent !== undefined &&
        node.parent !== null &&
        String(node.parent) !== "0";

    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div style={{ paddingLeft: level * 16 }}>
            <label
                className="flex items-start gap-2 cursor-pointer py-1"
                onMouseDown={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (multiple) {
                        onSelect(node);
                    } else {
                        if (isSelected) {
                            inputRef.current?.blur();
                            onSelect(null);
                        } else {
                            try {
                                (inputRef.current as any)?.focus?.({
                                    preventScroll: true,
                                });
                            } catch (err) {
                                inputRef.current?.focus();
                            }
                            onSelect(node);
                        }
                    }
                }}
            >
                <input
                    type={multiple ? "checkbox" : "radio"}
                    name={radioName}
                    className="sr-only"
                    ref={inputRef}
                    checked={isSelected}
                    readOnly
                    onChange={() => {}}
                    onMouseDown={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (!multiple) {
                            if (isSelected) {
                                inputRef.current?.blur();
                            } else {
                                try {
                                    (inputRef.current as any)?.focus?.({
                                        preventScroll: true,
                                    });
                                } catch (err) {
                                    inputRef.current?.focus();
                                }
                            }
                        }
                    }}
                />

                <div
                    onClick={(e: React.MouseEvent) => {
                        if (multiple) {
                            onSelect(node);
                        } else {
                            if (isSelected) {
                                inputRef.current?.blur();
                                onSelect(null);
                            } else {
                                try {
                                    (inputRef.current as any)?.focus?.({
                                        preventScroll: true,
                                    });
                                } catch (err) {
                                    inputRef.current?.focus();
                                }
                                onSelect(node);
                            }
                        }
                    }}
                    className={`flex items-center justify-center w-4 h-4 border shrink-0 transition-colors ${
                        multiple ? "rounded-sm" : "rounded-sm"
                    } ${
                        isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                    }`}
                    aria-hidden
                >
                    {multiple && isSelected && (
                        <svg
                            className="w-3 h-3 text-white"
                            viewBox="0 0 12 12"
                            fill="none"
                        >
                            <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>

                <div className="flex flex-col">
                    <span
                        className={`${isChild ? "text-sm text-gray-600" : "text-sm font-medium text-gray-800"}`}
                    >
                        {node.name}
                    </span>
                    {node.slug && (
                        <small className="text-xs text-gray-400 hidden">
                            {node.slug}
                        </small>
                    )}
                </div>

                <input
                    type="hidden"
                    name={`${hiddenPrefix}${node.id}_id`}
                    value={String(node.id)}
                />
                <input
                    type="hidden"
                    name={`${hiddenPrefix}${node.id}_slug`}
                    value={node.slug ?? ""}
                />
            </label>

            {renderChildren && node.children && node.children.length > 0 && (
                <div className="mt-0">
                    {renderChildren(node.children as T[], level + 1)}
                </div>
            )}
        </div>
    );
};

export default RadioItem;
