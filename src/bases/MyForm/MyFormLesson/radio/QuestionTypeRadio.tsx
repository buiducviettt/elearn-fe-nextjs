"use client";

import React from "react";
import type { TproductsQuestionTypeGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type QuestionTypeRadio = TproductsQuestionTypeGet & {
    children?: QuestionTypeRadio[];
};

type Props = {
    node: QuestionTypeRadio;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: QuestionTypeRadio | null) => void;
    renderChildren?: (
        children: QuestionTypeRadio[],
        level: number,
    ) => React.ReactNode;
};

const QuestionTypeRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<QuestionTypeRadio>
            {...props}
            radioName="product_questionType_single"
            hiddenPrefix="questionType_"
        />
    );
};

export default QuestionTypeRadio;
