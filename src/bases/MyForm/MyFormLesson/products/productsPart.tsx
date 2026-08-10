"use client";

import React from "react";
import { TproductsPartGet } from "@/types/service-get";
import { productsPartService } from "@/services/productsPart";
import ProductsTreeSelector from "./ProductsTreeSelector";
import PartRadio from "../radio/PartRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type Part = TproductsPartGet & { children?: Part[] };

const CACHE_KEY = "productsPart_cache_v1";

const ProductsPart: React.FC<Props> = ({ form, name = "product_part" }) => {
    return (
        <ProductsTreeSelector<Part>
            form={form}
            name={name}
            service={productsPartService}
            cacheKey={CACHE_KEY}
            radioComponent={PartRadio}
            multiple
        />
    );
};

export default ProductsPart;
