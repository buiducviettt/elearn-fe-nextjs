"use client";

import React from "react";
import { TproductsCategories } from "@/types/service-get";
import { productsCategoriesService } from "@/services/productsCategories";
import ProductsTreeSelector from "./ProductsTreeSelector";
import CategoryRadio from "../radio/CategoryRadio";

type Props = {
    form?: any;
    name?: string;
};

type Category = TproductsCategories & { children?: Category[] };

const CACHE_KEY = "productsCategories_cache_v1";

const ProductsCategories: React.FC<Props> = ({
    form,
    name = "product_filters_link",
}) => {
    return (
        <ProductsTreeSelector<Category>
            form={form}
            name={name}
            service={productsCategoriesService}
            cacheKey={CACHE_KEY}
            radioComponent={CategoryRadio}
        />
    );
};

export default ProductsCategories;
