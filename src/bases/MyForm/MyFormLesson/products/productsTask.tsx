"use client";

import React from "react";
import { TproductsTaskGet } from "@/types/service-get";
import { productsTaskService } from "@/services/productsTask";
import ProductsTreeSelector from "./ProductsTreeSelector";
import TaskRadio from "../radio/TaskRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type Task = TproductsTaskGet & { children?: Task[] };

const CACHE_KEY = "productsTask_cache_v1";

const ProductsTask: React.FC<Props> = ({ form, name = "product_task" }) => {
    return (
        <ProductsTreeSelector<Task>
            form={form}
            name={name}
            service={productsTaskService}
            cacheKey={CACHE_KEY}
            radioComponent={TaskRadio}
            multiple
        />
    );
};

export default ProductsTask;
