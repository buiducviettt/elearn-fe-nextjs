"use client";

import React from "react";
import type { TproductsPartGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Part = TproductsPartGet & { children?: Part[] };

type Props = {
    node: Part;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Part | null) => void;
    renderChildren?: (children: Part[], level: number) => React.ReactNode;
};

const PartRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Part>
            {...props}
            radioName="product_part_single"
            hiddenPrefix="part_"
        />
    );
};

export default PartRadio;
