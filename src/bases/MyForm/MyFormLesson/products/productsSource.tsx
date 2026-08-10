"use client";

import React from "react";
import { TproductsSourceGet } from "@/types/service-get";
import { productsSourceService } from "@/services/productsSource";
import ProductsTreeSelector from "./ProductsTreeSelector";
import SourceRadio from "../radio/SourceRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type Source = TproductsSourceGet & { children?: Source[] };

const CACHE_KEY = "productsSource_cache_v1";

const ProductsSource: React.FC<Props> = ({ form, name = "product_source" }) => {
    return (
        <ProductsTreeSelector<Source>
            form={form}
            name={name}
            service={productsSourceService}
            cacheKey={CACHE_KEY}
            radioComponent={SourceRadio}
            multiple
        />
    );
};

export default ProductsSource;
