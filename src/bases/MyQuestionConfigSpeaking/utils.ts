import { TMyAnswerConfigSpeakingProps } from ".";

export const validateSpeaking = async (
    _,
    value: TMyAnswerConfigSpeakingProps["value"]
) => {
    const { todo, title } = value || {};

    if (!title?.trim()) {
        throw new Error("Vui lòng nhập tiêu đề câu hỏi");
    }

    if (!todo) {
        throw new Error("Vui lòng điền đầy đủ thông tin thời gian");
    }

    return Promise.resolve();
};
export const convertToServerDataSpeaking = (question_item: any = {}) => {
    const {
        title,
        ready,
        todo,
        type,
        description,
        explanation,
        answer,
        file,
        category,
    } = question_item || {};
    return {
        type,
        title,
        ready,
        todo,
        description,
        explanation,
        answer,
        file,
        category,
    };
};

export const convertToClientDataSpeaking = (item: any = {}) => {
    const {
        title,
        ready,
        todo,
        type,
        description,
        explanation,
        answer,
        file,
        category,
    } = item || {};
    return {
        type,
        title,
        ready,
        todo,
        description,
        explanation,
        answer,
        file,
        category: category ?? "part-1",
    };
};
