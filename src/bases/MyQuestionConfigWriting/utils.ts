import { TMyAnswerConfigWritingProps } from ".";

export const validateWriting = async (
  _,
  value: TMyAnswerConfigWritingProps["value"],
) => {
  const { ready, todo, title, description, explanation, answer, category, outline } = value || {};
  if (!title?.trim()) {
    throw new Error("Vui lòng nhập tiêu đề câu hỏi");
  }
  
  if ( !todo) {
    throw new Error("Vui lòng điền đầy đủ thông tin thời gian");
  }
  if (!answer?.trim()) {
    throw new Error("Vui lòng nhập câu trả lời mẫu");
  }
  return Promise.resolve();
}; 

export const convertToServerDataWriting = (question_item: any = {}) => {
  const { title, ready, todo, type, description, file, explanation, answer, category, outline } = question_item || {};
  return {
    type,
    title,
    ready,
    todo,
    description,
    file,
    explanation,
    answer,
    category,
    outline
  };
};

export const convertToClientDataWriting = (item: any = {}) => {
  const { title, ready, todo, type, description, file, explanation, answer, category, outline  } = item || {};
  return {
    type,
    title,
    ready,
    todo,
    description,
    file,
    explanation,
    answer,
    category: category ?? "task-1",
    outline
  };
};