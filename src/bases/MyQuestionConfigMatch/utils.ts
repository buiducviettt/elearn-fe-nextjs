import { QUESTION_TYPES } from "@/types/enum";
import { TQuestionPost } from "@/types/service-post";
import { TMyQuestionConfigMatchProps, TType } from "./index";

type TMatchItem = {
  type: TType;
  content: string;
};

export const validateMatch = async (
  _,
  value: TMyQuestionConfigMatchProps["value"],
) => {
  const isFulfilledContent = value?.values?.every(
    (item) => item[0][0].content && item[1][0].content,
  );
  if (!isFulfilledContent) {
    throw new Error("Vui lòng điền đầy đủ nội dung");
  }
};

export const INIT_DATA_MATCH: TMyQuestionConfigMatchProps["value"] = {
  type: QUESTION_TYPES.match_words_images,
  values: [
    [
      [{ type: "text", content: "" }],
      [{ type: "text", content: "" }]
    ]
  ]
};

export const convertToServerDataMatch = (
  question_item: any = [],
): TQuestionPost["question_items"][0] => {
  const { values, type } = question_item || {};

  const questions: string[] = [];
  const answers: string[] = [];
  values.forEach((item) => {
    questions.push(item[0][0].content);
    answers.push(item[1][0].content);
  });

  return {
    type: type,
    question: questions,
    answer: answers,
  };
};

export const convertToClientDataMatch = (
  item,
): TMyQuestionConfigMatchProps["value"] => {
  const { question = [], answer = [] } = item || {};
  return {
    type: QUESTION_TYPES.match_words_images,
    values: question.map((ques, index) => {
      return [
        [{
          type: ques.startsWith("http") ? "image" : "text",
          content: ques,
        }],
        [{
          type: answer[index].startsWith("http") ? "image" : "text",
          content: answer[index],
        }]
      ];
    }),
  };
};
