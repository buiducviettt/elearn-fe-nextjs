"use client";

import React from "react";
import { TproductsSectionGet } from "@/types/service-get";
import { productsSectionService } from "@/services/productsSection";
import ProductsTreeSelector from "./ProductsTreeSelector";
import SectionRadio from "../radio/SectionRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type Section = TproductsSectionGet & { children?: Section[] };

const CACHE_KEY = "productsSection_cache_v1";

const ProductsSection: React.FC<Props> = ({
    form,
    name = "product_section",
}) => {
    return (
        <ProductsTreeSelector<Section>
            form={form}
            name={name}
            service={productsSectionService}
            cacheKey={CACHE_KEY}
            radioComponent={SectionRadio}
            multiple
        />
    );
};

export default ProductsSection;
