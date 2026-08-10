import { taxonomyService } from "@/services/taxonomy";
import { TEST_CATEGORIES } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";

const useTestCategory = () =>
  useQuery({
    queryKey: [
      taxonomyService.keyGet,
      TEST_CATEGORIES.questionnaire_category,
      {
        page: 1,
        per_page: 9999,
        taxonomy: TEST_CATEGORIES.questionnaire_category,
      },
    ],
    queryFn: () =>
      taxonomyService.get({
        page: 1,
        per_page: 9999,
        taxonomy: TEST_CATEGORIES.questionnaire_category,
      }),
    select: (data) => data.payload.data.list,
  });

export default useTestCategory;
