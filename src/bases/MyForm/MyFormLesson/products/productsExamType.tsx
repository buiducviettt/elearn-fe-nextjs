"use client";

import React from "react";
import { TproductsExamTypeGet } from "@/types/service-get";
import { productsExamTypeService } from "@/services/productsExamType";
import ProductsTreeSelector from "./ProductsTreeSelector";
import ExamTypeRadio from "../radio/ExamTypeRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type ExamType = TproductsExamTypeGet & { children?: ExamType[] };

const CACHE_KEY = "productsExamType_cache_v1";

const ProductsExamType: React.FC<Props> = ({
    form,
    name = "product_exam_type",
}) => {
    return (
        <ProductsTreeSelector<ExamType>
            form={form}
            name={name}
            service={productsExamTypeService}
            cacheKey={CACHE_KEY}
            radioComponent={ExamTypeRadio}
            multiple
        />
    );
};

export default ProductsExamType;
