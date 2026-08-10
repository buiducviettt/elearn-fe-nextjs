"use client";

import useTestCategory from "@/hooks/useTestCategory";
import MyRadioV1, { TMyRadioV1Props } from "..";

type TMyRadioV1TestCategoryProps = {} & Omit<TMyRadioV1Props, "children">;
const MyRadioV1TestCategory: React.FC<TMyRadioV1TestCategoryProps> = (
  props
) => {
  const { data = [], isLoading } = useTestCategory();

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

export default MyRadioV1TestCategory;
