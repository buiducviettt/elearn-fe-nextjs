import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectExamLevelProps = {} & Omit<TMyGroupSelectProps, "children">;
const MyGroupSelectExamLevel: React.FC<TMyGroupSelectExamLevelProps> = (
  props,
) => {
  const { ...rest } = props;

  const { data = [], isLoading } = useQuery({
    queryKey: [
      taxonomyService.keyGet,
      QUESTION_CATEGORIES.question_level,
      {
        page: 1,
        per_page: 9999,
        taxonomy: QUESTION_CATEGORIES.question_level,
      },
    ],
    queryFn: () =>
      taxonomyService.get({
        page: 1,
        per_page: 9999,
        taxonomy: QUESTION_CATEGORIES.question_level,
      }),
    select: (data) => data.payload.data.list,
  });

  return (
    <MyGroupSelect isEmpty={data.length === 0} loading={isLoading} {...rest}>
      {data.map((item) => {
        const { id, name } = item;
        return (
          <MyGroupSelect.Item key={id} value={id}>
            {name}
          </MyGroupSelect.Item>
        );
      })}
    </MyGroupSelect>
  );
};

export default MyGroupSelectExamLevel;
