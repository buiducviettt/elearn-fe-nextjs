import { Pagination } from "antd";
import { PaginationProps } from "antd/lib";
import React from "react";

export type TMyPaginationProps = {} & PaginationProps;

const MyPagination: React.FC<TMyPaginationProps> = (props) => {
    return (
        <Pagination
            showTotal={(total) => {
                return `Tổng cộng: ${total}`;
            }}
            {...props}
        />
    );
};

export default MyPagination;
