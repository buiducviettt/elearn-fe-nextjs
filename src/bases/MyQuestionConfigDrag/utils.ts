import { TQuestionPost } from "@/types/service-post";
import { TMyQuestionConfigDragProps } from ".";
import {
    QUESTION_MULTIPLE_TYPE,
    QUESTION_CLONEABLE_TYPE,
    QUESTION_DRAGABLE_TYPE,
} from "@/types/enum";

export const INIT_DATA_DRAG = {
    type: "drag",
    questionContent: "",
    explanation: [],
    answers: [],
    noise_answer: [],
    selected_ids: "",
    multiple: QUESTION_MULTIPLE_TYPE.disable,
};

export const validateDrag = async (
    _,
    value: TMyQuestionConfigDragProps["value"],
) => {
    const {
        questionContent = "",
        answers = [],
        multiple = QUESTION_MULTIPLE_TYPE.disable,
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
};

export const convertToServerDataDrag = (
    question_item,
): TQuestionPost["question_items"][0] => {
    return {
        type: question_item.type,
        title: question_item.questionContent,
        explanation: question_item.explanation ?? [],
        answer: question_item.answers.map((answer) =>
            answer.content.map((item) => item.value),
        ),
        noise_answer: question_item.noise_answer.map(
            (item) => item.content[0].value,
        ),
        selected_ids: question_item.selected_ids,
        multiple: question_item.multiple,
        cloneable: question_item.cloneable,
        draggable: question_item.draggable,
    };
};

export const convertToClientDataDrag = (
    item,
): TMyQuestionConfigDragProps["value"] => {
    const {
        answer = [],
        title,
        explanation = [],
        multiple = QUESTION_MULTIPLE_TYPE.disable,
        noise_answer: serverNoiseAnswer = [],
        selected_ids = "",
        cloneable = QUESTION_CLONEABLE_TYPE.disable,
        draggable = QUESTION_DRAGABLE_TYPE.disable,
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
        noise_answer: (serverNoiseAnswer || []).map((itemAnswer) => ({
            id: Math.random(),
            content: [
                {
                    id: Math.random(),
                    value: itemAnswer,
                },
            ],
        })),
        selected_ids,
        multiple,
        cloneable,
        draggable,
    };
};
