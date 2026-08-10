import {
    EXAM_STRUCTURE,
    RDOM_STRUCTURE,
    QUESTION_CATEGORIES,
    QUESTION_TYPES,
} from "./enum";
import { TCoursePost } from "./service-post";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TBaseResponse<T = {}> = {
    success: boolean;
    message: string;
    data: T;
};

// API response more data than it has but i just want to get necessary information
export type TUserLoginResponsePost = TBaseResponse<{
    token: string;
    logout_url: string;
    user: {
        data: {
            ID: string;
            user_email: string;
            user_nicename: string;
        };
    };
}>;

export type TAuthResponsePost = TBaseResponse<{
    token: string;
    user: {
        data: {
            ID: string;
            user_login: string;
            user_pass: string;
            user_nicename: string;
            user_email: string;
            user_url: string;
            user_registered: string;
            user_activation_key: string;
            user_status: string;
            display_name: string;
        };
        ID: number;
        caps: Record<string, boolean>;
        cap_key: string;
        roles: string[];
        allcaps: Record<string, boolean>;
        filter: null;
    };
    logout_url: string;
}>;

export type TWPUser = {
    id: number;
    name: string;
};

export type TWPUserListResponse = TWPUser[];

export type TTaxonomyResponseGet = TBaseResponse<{
    list: {
        id: string;
        name: string;
        description?: string;
        parent: string;
        depth: string;
        readonly: string;
        tree_view: string;
        taxonomy: QUESTION_CATEGORIES;
        order_sequence: string;
    }[];
    max_page: string;
    page: number;
    total: string;
}>;

export type TMediaServiceUpload = {
    id: number;
    link: string;
    source_url: string;
    date: string;
    media_type: string;
    mime_type: string;
    title: { rendered: string };
};
export type TMediaServiceUploadGet = {
    payload: {
        id: number;
        source_url: string;
        link: string;
        date: string;
    }[];
    total: number;
};

export type TQuestionGetDetailResponse = {
    question_id?: string;
    question_title: string;
    question_description: string;
    question_file?: any;
    question_explanation: string;
    question_random: RDOM_STRUCTURE;
    question_type: EXAM_STRUCTURE;
    question_skill?: {
        id: string;
        name: string;
    };
    question_level?: {
        id: string;
        name: string;
    };
    question_category?: {
        id: string;
        name: string;
    };
    question_part?: {
        id: string;
        name: string;
    };
    question_items: {
        id: string;
        type: QUESTION_TYPES;
        title: string;
        description: string;
        file?: any;
        explanation: string;
        question: string[];
        answer: (number | string)[];
    }[];
};
export type TQuestionGetResponse = {
    request: string;
    total: string;
    max_page: number;
    per_page: number;
    page: number;
    list: any[];
};

export type THistoryGetResponse = {
    request: string;
    total: string;
    max_page: number;
    per_page: number;
    page: number;
    list: any[];
};
export type THistoryQuestion = {
    result: (number | string)[];
    status: "skip" | "incorrect" | "correct" | "halfcorrect";
    id: string;
    type: QUESTION_TYPES;
    title: string;
    description: string;
    file?: any;
    explanation: string;
    questions: string[];
    answer: (number | string)[];
};
export type TCourseListResponse = {
    total: string;
    max_page: number;
    per_page: number;
    page: number;
    list: TCoursePost[];
};
