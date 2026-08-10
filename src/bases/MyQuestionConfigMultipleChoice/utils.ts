import { QUESTION_TYPES, QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import { TQuestionPost } from "@/types/service-post";
import { TMyAnswerConfigMultipleChoiceProps } from ".";

export const validateMultipleChoice = async (
    _,
    value: TMyAnswerConfigMultipleChoiceProps["value"],
) => {
    const { questionContent, answers = [] } = value || {};
    if (!questionContent) {
        throw new Error("Vui lòng nhập nội dung");
    }
    if (answers.length === 0) {
        throw new Error("Vui lòng thêm ít nhất một đáp án");
    }
    if (!answers.every((answer) => answer.content)) {
        throw new Error("Vui lòng nhập nội dung cho tất cả đáp án");
    }
    if (!answers.some((answer) => answer.checked)) {
        throw new Error("Vui lòng chọn ít nhập một đáp án đúng");
    }

    return Promise.resolve();
};

export const convertToServerDataMultipleChoice = (
    data: TMyAnswerConfigMultipleChoiceProps["value"],
): TQuestionPost["question_items"][0] => {
    const {
        answers = [],
        questionContent = "",
        explanation = "",
        multiple = QUESTION_MULTIPLE_TYPE.disable,
    } = data || {};

    return {
        type: QUESTION_TYPES.multiple_choice,
        title: questionContent,
        explanation: explanation,
        question: answers.map((answer) => answer.content),
        answer: answers
            .map((answer, index) => (answer.checked ? index : -1))
            .filter((index) => index !== -1),
        multiple: multiple,
    };
};

export const convertToClientDataMultipleChoice = (
    item,
): TMyAnswerConfigMultipleChoiceProps["value"] => {
    const {
        answer = [],
        title,
        question = [],
        explanation = "",
        multiple = QUESTION_MULTIPLE_TYPE.disable,
    } = item || {};
    return {
        questionContent: title as string,
        explanation: explanation as string,
        answers: (question as string[]).map((ques, index) => {
            return {
                id: Math.random(),
                checked: (answer as number[]).includes(index),
                content: ques,
            };
        }),
        multiple: multiple,
    };
};

export const INIT_DATA_MULTIPLE_CHOICE = {
    questionContent: "",
    explanation: "",
    answers: [], // Đã sửa từ 3 đáp án rỗng thành mảng rỗng
    multiple: QUESTION_MULTIPLE_TYPE.disable,
};
