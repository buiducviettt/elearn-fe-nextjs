"use client";

import React from "react";
import type { TproductsCategories } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Category = TproductsCategories & { children?: Category[] };

type Props = {
    node: Category;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Category | null) => void;
    renderChildren?: (children: Category[], level: number) => React.ReactNode;
};

const CategoryRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Category>
            {...props}
            radioName="product_category_single"
            hiddenPrefix="category_"
        />
    );
};

export default CategoryRadio;
