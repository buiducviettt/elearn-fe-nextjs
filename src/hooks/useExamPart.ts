import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";

const useExamPart = () =>
  useQuery({
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

export default useExamPart;
