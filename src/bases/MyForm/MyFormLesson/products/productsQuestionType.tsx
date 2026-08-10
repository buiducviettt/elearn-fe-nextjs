"use client";

import React from "react";
import { TproductsQuestionTypeGet } from "@/types/service-get";
import { productsQuestionTypeService } from "@/services/productsQuestionType";
import ProductsTreeSelector from "./ProductsTreeSelector";
import QuestionTypeRadio from "../radio/QuestionTypeRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type QuestionType = TproductsQuestionTypeGet & { children?: QuestionType[] };

const CACHE_KEY = "productsQuestionType_cache_v1";

const ProductsQuestionType: React.FC<Props> = ({
    form,
    name = "product_question_type",
}) => {
    return (
        <ProductsTreeSelector<QuestionType>
            form={form}
            name={name}
            service={productsQuestionTypeService}
            cacheKey={CACHE_KEY}
            radioComponent={QuestionTypeRadio}
            multiple
        />
    );
};

export default ProductsQuestionType;
