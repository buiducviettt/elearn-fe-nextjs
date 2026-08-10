"use client";

import useExamCategory from "@/hooks/useExamCategory";
import MyRadioV1, { TMyRadioV1Props } from "..";

type TMyRadioV1ExamCategoryProps = {} & Omit<TMyRadioV1Props, "children">;
const MyRadioV1ExamCategory: React.FC<TMyRadioV1ExamCategoryProps> = (
  props,
) => {
  const { data = [], isLoading } = useExamCategory();

  return (
    <MyRadioV1
      isEmpty={data.length === 0}
      loading={isLoading}
      className="flex-col"
      {...props}
    >
      {data?.map((item) => {
        const { id, name } = item;
        return (
          <MyRadioV1.Item key={id} value={id}>
            {name}
          </MyRadioV1.Item>
        );
      })}
    </MyRadioV1>
  );
};

export default MyRadioV1ExamCategory;
