"use client";

import React from "react";
import { TproductsTopicGet } from "@/types/service-get";
import { productsTopicService } from "@/services/productsTopic";
import ProductsTreeSelector from "./ProductsTreeSelector";
import TopicRadio from "../radio/TopicRadio";

type Props = {
    form?: any;
    name?: string | (string | number)[];
};

type Topic = TproductsTopicGet & { children?: Topic[] };

const CACHE_KEY = "productsTopic_cache_v1";

const ProductsTopic: React.FC<Props> = ({ form, name = "product_topic" }) => {
    return (
        <ProductsTreeSelector<Topic>
            form={form}
            name={name}
            service={productsTopicService}
            cacheKey={CACHE_KEY}
            radioComponent={TopicRadio}
            multiple
        />
    );
};

export default ProductsTopic;
