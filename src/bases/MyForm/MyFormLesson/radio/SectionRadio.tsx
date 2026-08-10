"use client";

import React from "react";
import type { TproductsSectionGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Section = TproductsSectionGet & { children?: Section[] };

type Props = {
    node: Section;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Section | null) => void;
    renderChildren?: (children: Section[], level: number) => React.ReactNode;
};

const SectionRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Section>
            {...props}
            radioName="product_section_single"
            hiddenPrefix="section_"
        />
    );
};

export default SectionRadio;
