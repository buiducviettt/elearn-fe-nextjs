import { TQuestionPost } from "@/types/service-post";
import { TMyAnswerConfigSingleChoiceProps } from ".";
import { QUESTION_MULTIPLE_TYPE } from "@/types/enum";
import { QUESTION_TYPES } from "@/types/enum";

export type TMyAnswerConfigSingleChoiceValue = {
    questionContent: string;
    answers: { id: number; checked: boolean; content: string }[];
    explanation: string;
    multiple: QUESTION_MULTIPLE_TYPE;
};

export const validateSingleChoice = async (
    _,
    value: TMyAnswerConfigSingleChoiceValue,
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
        throw new Error("Vui lòng chọn đáp án đúng");
    }

    return Promise.resolve();
};

export const convertToServerDataSingleChoice = (
    question_item: any = [],
): TQuestionPost["question_items"][0] => {
    const {
        answers = [],
        questionContent,
        explanation,
        type,
    } = question_item || {};

    const newAnswers = answers
        .map((answer, index) => (answer.checked ? index : -1))
        .filter((index) => index !== -1);

    return {
        type: type || QUESTION_TYPES.single_choice,
        title: questionContent,
        explanation: explanation,
        question: answers.map((item) => item.content),
        answer: newAnswers,
    };
};

export const convertToClientDataSingleChoice = (
    item,
): TMyAnswerConfigSingleChoiceValue => {
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
        multiple,
    };
};

export const INIT_DATA_SINGLE_CHOICE = {
    questionContent: "",
    explanation: "",
    answers: [],
    multiple: QUESTION_MULTIPLE_TYPE.disable,
};
