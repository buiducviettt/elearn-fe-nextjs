import { QUESTION_TYPES } from "@/types/enum";
import { TQuestionPost } from "@/types/service-post";
import { TMyQuestionConfigEssayProps } from ".";

export const validateEssay = async (
  _,
  value: TMyQuestionConfigEssayProps["value"],
) => {
  const isFulfilledContent = value?.content;

  if (!isFulfilledContent) {
    throw new Error("Vui lòng nhập nội dung");
  }
};

export const convertToServerDataEssay = (
  question_item: any = [],
): TQuestionPost["question_items"][0] => {
  const { type, content } = question_item || {};

  return {
    type: type,
    answer: content,
  };
};

export const convertToClientDataEssay = (
  item,
): TMyQuestionConfigEssayProps["value"] => {
  const { answer } = item || {};
  return {
    type: QUESTION_TYPES.spell,
    content: answer as string,
  };
};
