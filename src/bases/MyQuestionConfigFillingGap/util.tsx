import { TQuestionPost } from "@/types/service-post";
import { TMyQuestionConfigFillingGapProps } from ".";
import { QUESTION_MULTIPLE_TYPE } from "@/types/enum";

export const validateFillingGap = async (
    _,
    value: TMyQuestionConfigFillingGapProps["value"],
) => {
    const {
        questionContent = "",
        answers = [],
        multiple = QUESTION_MULTIPLE_TYPE.disable,
        noise_answer = [],
    } = value || {};

    if (!questionContent) {
        throw new Error("Vui lòng nhập nội dung");
    }

    if (answers.length === 0) {
        throw new Error("Vui lòng thêm ít nhất một đáp án");
    }

    const fulfilledAllContentInAnswer = answers.every((answer) => {
        return answer?.content.every(({ value }) => value);
    });

    if (!fulfilledAllContentInAnswer) {
        throw new Error("Vui lòng nhập nội dung cho tất cả đáp án");
    }

    if (!fulfilledAllContentInAnswer) {
        throw new Error("Vui lòng nhập nội dung cho tất cả đáp án");
    }
};

export const convertToServerDataFillingGap = (
    question_item,
): TQuestionPost["question_items"][0] => {
    return {
        type: question_item.type,
        title: question_item.questionContent,
        // gửi explanation dạng mảng
        explanation: question_item.explanation ?? [],
        answer: question_item.answers.map((answer) =>
            answer.content.map((item) => item.value),
        ),
        noise_answer: question_item.noise_answer, // giữ nguyên nếu server nhận mảng 2 chiều
        multiple: question_item.multiple,
    };
};

export const convertToClientDataFillingGap = (
    item,
): TMyQuestionConfigFillingGapProps["value"] => {
    const {
        answer = [],
        title,
        noise_answer = [],
        explanation = [],
        multiple = QUESTION_MULTIPLE_TYPE.disable,
    } = item || {};
    return {
        questionContent: title,
        explanation: (() => {
            if (Array.isArray(explanation)) return explanation;
            if (typeof explanation === "string" && explanation) {
                try {
                    return JSON.parse(explanation);
                } catch {
                    return [];
                }
            }
            return [];
        })(),

        answers: answer.map((itemAnswer) => ({
            id: Math.random(),
            content: itemAnswer.map((answerQues) => {
                return {
                    id: Math.random(),
                    value: answerQues,
                };
            }),
        })),
        noise_answer: Array.isArray(noise_answer) ? noise_answer : [], // đảm bảo là mảng 2 chiều
        multiple,
    };
};
