import {
    QUESTION_CATEGORIES,
    TEST_CATEGORIES,
    TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL,
    TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT,
    TEST_EXPLANATION,
    TEST_PRIVATE,
    TEST_TYPES,
    QUESTION_TYPES,
    QUESTIONPRAC_TYPES,
    QUESTION_MULTIPLE_TYPE,
    TEST_MODE,
    TEST_VISUAL,
    TYPE_LESSON,
} from "./enum";

export type TPostAuth = {
    token: string;
    expiredAt: Date;
};
export type TUserLoginPost = {
    userLogin: string;
    userPassword: string;
};

export type TTaxonomyPost = {
    taxonomy: QUESTION_CATEGORIES | TEST_CATEGORIES;
    taxonomy_name: string;
    taxonomy_description: string;
    parent: string;
    status: string;
};
interface Question2 {
    ready: number;
    todo: number;
}
interface Questionitem {
    selected_ids?: string;
    type: string;
    title?: string;
    category?: string;
    description?: any;
    explanation?: any;
    outline?: any;
    file?: string | any;
    question?: string[] | Question2 | null;
    answer?: string[] | string[][] | number[] | string;
    noise_answer?: string[];
    multiple?: string;
    cloneable?: any;
    draggable?: any;
}

export type TQuestionPost = {
    question_id?: string;
    question_title: string;
    question_description: string;
    question_explanation: string;
    question_optional: string;
    question_file: number;
    question_random: number;
    question_type: string;
    question_skill: number;
    question_level: number;
    question_category?: any;
    question_part?: any;
    question_items: Questionitem[];
    question_visual?: string;
};

export type TQuestionnairePost = {
    questionnaire_id?: string;
    questionnaire_title: string;
    questionnaire_description?: string;
    questionnaire_type: TEST_TYPES;
    questionnaire_category?: any;
    questionnaire_tag?: string;
    questionnaire_time: number;
    questionnaire_explanation: TEST_EXPLANATION;
    questionnaire_submit_time: TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT;
    questionnaire_submit_all: TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL;
    questionnaire_system: TEST_MODE;
    questionnaire_submit_count?: number;
    questionnaire_private: TEST_PRIVATE;
    questionnaire_private_code?: string;
    questionnaire_file?: string;
    questionnaire_structure: {
        title: string;
        transcript?: string;
        transcript_audio?: string;
        questions: {
            type: QUESTIONPRAC_TYPES;
            order: number;
            point: number;
            answer: string[] | string;
        }[];
        config?: {
            number: string;
            question_skill: number;
            question_category?: any;
            question_level: string;
            question_part?: any;
        } | null;
    }[];
};

export type TCoursePost = {
    id: string | number;
    title: string;
    description: string;
    structure: TCourseItem[];
};
export type TCourseItem = {
    chapter: string | number;
    summary: string;
    lesson: TCourseItemLessonPost["id"];
};
export type TCourseItemLessonPost = {
    id: string | number;
    questionnaire_id: "0";
    title: string;
    description?: string;
    video_type?: "external";
    video?: string;
    type?: "video";
    level?: TYPE_LESSON;
    duration: number;
    files?: string | string[];
    product_filters?: TproductsTag[];
    product_filters_link?: TproductsCategoriesPost[];
};
export type TproductsCategoriesPost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsTag = {
    product_source?: TproductsSourcePost[];
    product_passage?: TproductsPassagePost[];
    product_question_type?: TproductsQuestionTypePost[];
    product_exam_type?: TproductsExamTypePost[];
    product_topic?: TproductsTopicPost[];
    product_section?: TproductsSectionPost[];
    product_task?: TproductsTaskPost[];
    product_part?: TproductsPartPost[];
};

export type TproductsSourcePost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsPassagePost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsQuestionTypePost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsExamTypePost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsTopicPost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsSectionPost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};

export type TproductsTaskPost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};

export type TproductsPartPost = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
