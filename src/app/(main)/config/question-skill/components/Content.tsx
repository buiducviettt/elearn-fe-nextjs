"use client";

import MyButton from "@/bases/MyButton";
import MySpin from "@/bases/MySpin";
import MyTable from "@/bases/MyTable";
import { PAGE_SIZE } from "@/constants/common";
import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import { TTaxonomyResponseGet } from "@/types/response";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import ModalCreate from "./ModalCreate";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";

const Content = () => {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  const { data, isLoading } = useQuery({
    queryKey: [
      taxonomyService.keyGet,
      QUESTION_CATEGORIES.question_skill,
      currentPage,
    ],
    queryFn: async () => {
      const res = await taxonomyService.get({
        page: currentPage,
        per_page: PAGE_SIZE,
        taxonomy: QUESTION_CATEGORIES.question_skill,
      });
      if (res.payload.data.list.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      return res;
    },
  });

  const { list, total } = data?.payload?.data || {};

  const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    render(value) {
      return value || "Không có";
    },
  },
  {
    title: "",
    width: 100,
    key: "action",
    render(value, record: TTaxonomyResponseGet["data"]["list"][0]) {
      return (
        <div className="flex gap-2">
          {record.readonly !== "1" && (
            <><ModalEdit item={record}>
              {({ setOpen }) => {
                return (
                  <MyButton onClick={() => setOpen(true)} variant="solid">
                    Chỉnh sửa
                  </MyButton>
                );
              } }
            </ModalEdit><ModalDelete id={Number(record.id)} name={record.name}>
                {({ setOpen }) => {
                  return (
                    <MyButton
                      onClick={() => {
                        setOpen(true);
                      } }
                      variant="filled"
                      color="red"
                    >
                      Xoá
                    </MyButton>
                  );
                } }
              </ModalDelete></>
          )}
        </div>
      );
    },
  },
];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">Danh sách kỹ năng của câu hỏi</p>
        <ModalCreate>
          {({ setOpen }) => {
            return (
              <MyButton
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
                type="primary"
              >
                Tạo mới
              </MyButton>
            );
          }}
        </ModalCreate>
      </div>
      <MySpin spinning={isLoading}>
        <MyTable
          rowKey={"id"}
          showStt={{
            currentPage: currentPage,
            pageSize: PAGE_SIZE,
          }}
          dataSource={list}
          columns={columns}
          pagination={{
            current: Number(currentPage),
            pageSize: PAGE_SIZE,
            total: Number(total),
            onChange(page) {
              setCurrentPage(page);
            },
          }}
        />
      </MySpin>
    </div>
  );
};

export default Content;
