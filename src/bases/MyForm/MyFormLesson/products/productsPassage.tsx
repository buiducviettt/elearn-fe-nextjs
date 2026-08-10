"use client";

import React from "react";
import { TproductsPassageGet } from "@/types/service-get";
import { productsPassageService } from "@/services/productsPassage";
import ProductsTreeSelector from "./ProductsTreeSelector";
import PassageRadio from "../radio/PassageRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type Passage = TproductsPassageGet & { children?: Passage[] };

const CACHE_KEY = "productsPassage_cache_v1";

const ProductsPassage: React.FC<Props> = ({
    form,
    name = "product_passage",
}) => {
    return (
        <ProductsTreeSelector<Passage>
            form={form}
            name={name}
            service={productsPassageService}
            cacheKey={CACHE_KEY}
            radioComponent={PassageRadio}
            multiple
        />
    );
};

export default ProductsPassage;
