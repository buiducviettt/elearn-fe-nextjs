"use client";

import React from "react";
import type { TproductsSourceGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Source = TproductsSourceGet & { children?: Source[] };

type Props = {
    node: Source;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Source | null) => void;
    renderChildren?: (children: Source[], level: number) => React.ReactNode;
};

const SourceRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Source>
            {...props}
            radioName="product_source_single"
            hiddenPrefix="source_"
        />
    );
};

export default SourceRadio;
