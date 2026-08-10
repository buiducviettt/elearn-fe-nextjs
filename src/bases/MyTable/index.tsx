import { Table } from "antd";
import { TableProps } from "antd/lib";

export type TMyTableProps<T> = {
  showStt?: {
    currentPage: number;
    pageSize: number;
  };
} & TableProps<T>;
const MyTable = <T extends object>(props: TMyTableProps<T>) => {
  const { showStt, columns = [], ...rest } = props;
  let newCol = [...columns];
  if (showStt?.currentPage && showStt?.pageSize) {
    const sttCol: any = {
      title: "STT",
      dataIndex: "stt",
      align: "center",
      key: "stt",
      render(value, record, index) {
        return index + 1 + (showStt?.currentPage - 1) * showStt?.pageSize;
      },
    };
    newCol = [sttCol, ...columns];
  }

  return <Table columns={newCol} {...rest} />;
};

export default MyTable;
