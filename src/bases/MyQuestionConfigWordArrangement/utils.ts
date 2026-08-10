import { TQuestionPost } from "@/types/service-post";
import { TMyQuestionConfigWordArrangementProps } from "./index";

export const validateWordArrangement = async (
  _,
  value: TMyQuestionConfigWordArrangementProps["value"]
) => {
  const { correctSentence } = value || {};
  if (!correctSentence || correctSentence.length === 0) {
    throw new Error("Vui lòng nhập nội dung");
  }

  return Promise.resolve();
};
export const convertToServerDataWordArrangement = (
  question_item: any = []
): TQuestionPost["question_items"][0] => {
  const { correctSentence = [], showSentence, type } = question_item || {};

  return {
    type: type,
    question: showSentence.map((item) => item.content),
    answer: correctSentence,
  };
};

export const convertToClientDataWordArrangement = (
  item
): TMyQuestionConfigWordArrangementProps["value"] => {
  const { answer = [], question = [] } = item || {};
  return {
    correctSentence: answer,
    showSentence: question.map((itemAnswer) => ({
      id: Math.random(),
      content: itemAnswer,
    })),
  };
};
