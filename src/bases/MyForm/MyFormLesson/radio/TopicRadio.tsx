"use client";

import React from "react";
import type { TproductsTopicGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Topic = TproductsTopicGet & { children?: Topic[] };

type Props = {
    node: Topic;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Topic | null) => void;
    renderChildren?: (children: Topic[], level: number) => React.ReactNode;
};

const TopicRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Topic>
            {...props}
            radioName="product_topic_single"
            hiddenPrefix="topic_"
        />
    );
};

export default TopicRadio;
