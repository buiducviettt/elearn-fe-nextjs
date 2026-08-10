"use client";

import React from "react";
import type { TproductsTaskGet } from "@/types/service-get";
import RadioItem from "./RadioItem";

type Task = TproductsTaskGet & { children?: Task[] };

type Props = {
    node: Task;
    level?: number;
    selectedId?: string | number | null;
    onSelect: (node: Task | null) => void;
    renderChildren?: (children: Task[], level: number) => React.ReactNode;
};

const TaskRadio: React.FC<Props> = (props) => {
    return (
        <RadioItem<Task>
            {...props}
            radioName="product_task_single"
            hiddenPrefix="task_"
        />
    );
};

export default TaskRadio;
