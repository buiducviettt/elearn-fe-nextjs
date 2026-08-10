export const dynamic = "error"; // Ép trang phải static

import { taxonomyService } from "@/services/taxonomy";
import { QUESTION_CATEGORIES } from "@/types/enum";

import { PAGE_SIZE } from "@/constants/common";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Content from "./components/Content";
export const revalidate = 60; // Cập nhật trang mỗi 60 giây (ISR)

const ConfigQuestionStructurePage = async () => {
  const page = 1; // Không lấy từ `searchParams`, mặc định là trang đầu tiên

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [taxonomyService.keyGet, QUESTION_CATEGORIES.question_part, page],
    queryFn: async () => {
      return await taxonomyService.get({
        page: page,
        per_page: PAGE_SIZE,
        taxonomy: QUESTION_CATEGORIES.question_part,
      });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content />
    </HydrationBoundary>
  );
};

export default ConfigQuestionStructurePage;
