"use client";

import React from "react";
import type { TproductsExamTypeGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type ExamType = TproductsExamTypeGet & { children?: ExamType[] };

type Props = {
    node: ExamType;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: ExamType | null) => void;
    renderChildren?: (children: ExamType[], level: number) => React.ReactNode;
};

const ExamTypeRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<ExamType>
            {...props}
            radioName="product_examType_single"
            hiddenPrefix="examType_"
        />
    );
};

export default ExamTypeRadio;
