"use client";

import React from "react";
import type { TproductsPassageGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Passage = TproductsPassageGet & { children?: Passage[] };

type Props = {
    node: Passage;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Passage | null) => void;
    renderChildren?: (children: Passage[], level: number) => React.ReactNode;
};

const PassageRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Passage>
            {...props}
            radioName="product_passage_single"
            hiddenPrefix="passage_"
        />
    );
};

export default PassageRadio;
