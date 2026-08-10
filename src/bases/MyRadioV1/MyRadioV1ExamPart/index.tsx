"use client";

import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";
import MyRadioV1, { TMyRadioV1Props } from "..";

type TMyRadioV1ExamPartProps = {} & Omit<TMyRadioV1Props, "children">;
const MyRadioV1ExamPart: React.FC<TMyRadioV1ExamPartProps> = (props) => {
  const { data = [], isLoading } = useQuery({
    queryKey: [
      taxonomyService.keyGet,
      QUESTION_CATEGORIES.question_part,
      {
        page: 1,
        per_page: 9999,
        taxonomy: QUESTION_CATEGORIES.question_part,
      },
    ],
    queryFn: () =>
      taxonomyService.get({
        page: 1,
        per_page: 9999,
        taxonomy: QUESTION_CATEGORIES.question_part,
      }),
    select: (data) => data.payload.data.list,
  });

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

export default MyRadioV1ExamPart;
