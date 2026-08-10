"use client";

import MyEmpty from "@/bases/MyEmpty";
import React, { useEffect, useState } from "react";

type BaseItem = {
    id: string | number;
    name?: string;
    slug?: string | null;
    parent?: string | number | null;
    children?: BaseItem[];
};

type ServiceWithGet<T> = {
    get: (params: any) => Promise<any>;
};

type Props<T extends BaseItem> = {
    form?: any;
    name?: string | (string | number)[];
    service: ServiceWithGet<T>;
    cacheKey: string;
    radioComponent: React.ComponentType<any>;
    multiple?: boolean;
};

const ProductsTreeSelector = <T extends BaseItem>({
    form,
    name = "product_filters",
    service,
    cacheKey,
    radioComponent: RadioComp,
    multiple = false,
}: Props<T>) => {
    const [list, setList] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [raw, setRaw] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const loadCache = (): {
        list: T[];
        total?: number;
        max_page?: number;
        updatedAt?: number;
    } | null => {
        try {
            const raw = localStorage.getItem(cacheKey);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (err) {
            return null;
        }
    };

    const saveCache = (items: T[], total?: number, max_page?: number) => {
        try {
            const payload = {
                list: items,
                total: total ?? items.length,
                max_page: max_page ?? undefined,
                updatedAt: Date.now(),
            };
            localStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch (err) {
            // ignore
        }
    };

    useEffect(() => {
        const fetchJson = async (page: number, per_page: number) =>
            service.get({ page, per_page } as any);

        const MAX_PAGES = 50;
        const fetchPage = async (
            page: number,
            per_page: number,
            acc: T[],
        ): Promise<T[]> => {
            const res = await fetchJson(page, per_page);
            const data = (res as any)?.payload ?? res;
            const headers = (res as any)?.headers ?? {};

            let list: T[] = [];
            if (Array.isArray(data)) {
                list = data as T[];
                acc.push(...list);
            } else {
                list = data?.list ?? [];
                acc.push(...list);
            }

            const headerTotal =
                headers["x-wp-total"] ?? headers["x-total-count"];
            const headerMax =
                headers["x-wp-totalpages"] ?? headers["x-total-pages"];

            const total = Number(data?.total ?? headerTotal ?? acc.length ?? 0);
            const max_page = Number(
                (data?.max_page ?? headerMax ?? Math.ceil(total / per_page)) ||
                    0,
            );

            const shouldContinue =
                ((max_page && page < max_page) || list.length === per_page) &&
                page < MAX_PAGES;

            if (shouldContinue) return fetchPage(page + 1, per_page, acc);
            return acc;
        };

        const fetchAll = async () => {
            setLoading(true);
            try {
                const per_page = 5;
                const cache = loadCache();
                if (cache && Array.isArray(cache.list)) {
                    setRaw({ list: cache.list });
                    setList(buildTree(cache.list));
                }

                const firstResp = await fetchJson(1, per_page);
                const firstData = (firstResp as any)?.payload ?? firstResp;
                const headers = (firstResp as any)?.headers ?? {};

                const headerTotal =
                    headers["x-wp-total"] ?? headers["x-total-count"];
                const headerMax =
                    headers["x-wp-totalpages"] ?? headers["x-total-pages"];

                const total = Number(firstData?.total ?? headerTotal ?? 0);
                const max_page = Number(
                    (firstData?.max_page ??
                        headerMax ??
                        Math.ceil(total / per_page)) ||
                        0,
                );

                let acc: T[] = [];
                if (Array.isArray(firstData)) acc.push(...(firstData as T[]));
                else acc.push(...(firstData?.list ?? []));

                const cachedList =
                    cache && Array.isArray(cache.list) ? cache.list : [];
                if (cachedList.length > 0) {
                    const ids = new Set(acc.map((i) => String(i.id)));
                    const merged = [...acc];
                    for (const item of cachedList)
                        if (!ids.has(String(item.id))) merged.push(item);
                    acc = merged as T[];
                }

                const alreadyFetched = acc.length;
                let startPage = Math.floor(alreadyFetched / per_page) + 1;
                if (alreadyFetched % per_page === 0)
                    startPage = alreadyFetched / per_page + 1;
                if (!startPage || startPage < 2) startPage = 2;

                if (max_page && startPage <= max_page) {
                    const remaining = await fetchPage(startPage, per_page, acc);
                    acc = remaining as T[];
                }

                setRaw({ list: acc });
                saveCache(acc, total, max_page);
                const built = buildTree(acc as T[]);
                setList(built);
            } catch (err) {
                console.error(err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [service, cacheKey]);

    const buildTree = (flat: T[]): T[] => {
        const map = new Map<string, T>();
        // Create shallow copies with only primitive fields + children array
        flat.forEach((item) => {
            const copy: any = {
                id: (item as any).id,
                name: (item as any).name,
                slug: (item as any).slug ?? null,
                parent: (item as any).parent ?? null,
                children: [],
            };
            map.set(String(item.id), copy as T);
        });

        const roots: T[] = [];
        map.forEach((node) => {
            const parent = (node as any).parent ?? null;
            if (
                parent !== undefined &&
                parent !== null &&
                String(parent) !== "0" &&
                map.has(String(parent))
            ) {
                (map.get(String(parent)) as any).children!.push(node as any);
            } else {
                roots.push(node as T);
            }
        });

        return roots;
    };

    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    useEffect(() => {
        try {
            const val = form?.getFieldValue?.(name as any);
            if (Array.isArray(val) && val.length > 0) {
                if (multiple) {
                    setSelectedIds(val.map((v: any) => v?.id ?? v));
                } else {
                    setSelectedId(val[0]?.id ?? null);
                }
            }
        } catch (err) {
            // ignore
        }
    }, [form, name, multiple]);

    const setFieldValue = (value: any) => {
        if (form?.setFieldValue) {
            form.setFieldValue(name, value);
            return;
        }
        if (form?.setFieldsValue) {
            if (Array.isArray(name)) {
                const obj: any = {};
                let cur = obj;
                for (let i = 0; i < name.length - 1; i++) {
                    cur[name[i]] = cur[name[i]] ?? {};
                    cur = cur[name[i]];
                }
                cur[name[name.length - 1]] = value;
                form.setFieldsValue(obj);
            } else {
                form.setFieldsValue({ [name as string]: value });
            }
        }
    };

    const renderNode = (node: T, level = 0) => (
        <RadioComp
            key={String(node.id)}
            node={node}
            level={level}
            multiple={multiple}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={(nodeSelected: T | null) => {
                if (multiple) {
                    if (!nodeSelected) return;
                    const id = nodeSelected.id;
                    const strId = String(id);
                    setSelectedIds((prev) => {
                        const exists = prev.some((i) => String(i) === strId);
                        const next = exists
                            ? prev.filter((i) => String(i) !== strId)
                            : [...prev, id];

                        const currentVal: any[] =
                            form?.getFieldValue?.(name as any) ?? [];
                        const nextVal = exists
                            ? currentVal.filter(
                                  (v: any) => String(v?.id) !== strId,
                              )
                            : [
                                  ...currentVal,
                                  {
                                      id: (nodeSelected as any).id,
                                      name: (nodeSelected as any).name,
                                      slug: (nodeSelected as any).slug,
                                      parent: (nodeSelected as any).parent,
                                  },
                              ];

                        setFieldValue(nextVal);
                        return next;
                    });
                } else {
                    if (!nodeSelected) {
                        setSelectedId(null);
                        setFieldValue([]);
                        return;
                    }

                    setSelectedId(nodeSelected.id);
                    const value = [
                        {
                            id: (nodeSelected as any).id,
                            name: (nodeSelected as any).name,
                            slug: (nodeSelected as any).slug,
                            parent: (nodeSelected as any).parent,
                        },
                    ];
                    setFieldValue(value);
                }
            }}
            renderChildren={(children: T[], nextLevel: number) =>
                children.map((c) => renderNode(c, nextLevel))
            }
        />
    );

    return (
        <div className="bg-white border border-gray-200 rounded-md p-2 max-h-[180px] overflow-auto">
            {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
            ) : (
                list.map((c) => renderNode(c))
            )}
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
            {!loading && list.length === 0 && raw && (
                <div className="mt-3 text-sm text-gray-600">
                    <MyEmpty />
                </div>
            )}
        </div>
    );
};

export default ProductsTreeSelector;
