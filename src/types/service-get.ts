import {
    QUESTION_CATEGORIES,
    TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL,
    TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT,
    TEST_EXPLANATION,
    TEST_TYPES,
    TEST_CATEGORIES,
    RDOM_STRUCTURE,
    EXAM_STRUCTURE,
    TEST_MODE,
    TYPE_LESSON,
} from "./enum";

export type TPagination = {
    page?: number;
    per_page?: number;
};

export type TTaxonomyGet = {
    taxonomy: QUESTION_CATEGORIES | TEST_CATEGORIES;
} & TPagination;

export type TQuestionGet = {
    question_id?: string;
    keyword?: string;
    optional?: string | number;
    skill?: number | string;
    level?: string | number;
    category?: string | number;
    random?: RDOM_STRUCTURE;
    type?: EXAM_STRUCTURE;
    part?: string | number;
} & TPagination;

export type TQuestionnaireGet = {
    keyword?: string;
    type?: TEST_TYPES | null;
    system?: TEST_MODE | null;
    skill?: string | null;
    explanation?: TEST_EXPLANATION;
    submit_all?: TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL;
    submit_time?: TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT;
} & TPagination;
export type THistoryAnswer = {
    // type: string;
    title: string;
    questions: {
        order: number;
        point: number;
        answer: string[];
        result: string[];
        status: "skip" | "incorrect" | "correct";
    }[];
};
export type TQuestionnaireHistory = Record<
    "id" | "questionnaire_id" | "type" | "score" | "user_id",
    string
> & { structure: THistoryAnswer[] };

export type TQuestionnaireGetResponse = {
    list: {
        questionnaire_id: string;
        questionnaire_title: string;
        questionnaire_description: string;
        questionnaire_explanation: string;
        questionnaire_type: TEST_TYPES;
        questionnaire_created: string;
        questionnaire_updated: string;
        questionnaire_status: string;
        questionnaire_file: string;
        questionnaire_private: string;
        questionnaire_private_code: string;
        questionnaire_submit_all: string;
        questionnaire_submit_count: string;
        questionnaire_submit_time: string;
        questionnaire_system: any;
        questionnaire_skill: string;
        questionnaire_time: string;
        questionnaire_category?: any;
        questionnaire_structure: {
            transcript: string;
            transcript_audio?: string;
            title: string;
            content: string;
            questions: string[];
            config: {
                number: string;
                question_skill: number;
                question_category?: any;
                question_level: string;
                question_part?: any;
            };
        }[];
    }[];
    max_page: number;
    per_page: number;
    total: string;
    page: number;
};

// --- Wallet types (updated) ---
export type TWalletItem = {
    id: string | number;
    user_id: string | number;
    coin: string;
    status: string;
    created: string;
    updated?: string;
    user_name?: string;
    user_display_name?: string;
};

export type TWalletGetResponse = {
    user_id: string | number;
    coin: string;
    id: string | number;
    list: TWalletItem[];
    total: number | string;
    page: number;
    per_page: number;
    max_page?: number;
};

export type TWalletGetParams = {
    id?: string | number;
    user_id?: string | number;
    keyword?: string;
} & TPagination;

export type TCourseGetResponse = {
    list: TCourse[];
    total: number | string;
    page: number;
    per_page: number;
    max_page?: number;
};
export type TCourse = {
    id: string | number;
    title: string;
    description: string;
    structure: TCourseItem[];
};
export type TCourseItem = {
    chapter: string | number;
    summary: string;
    lesson: TCourseLessonGetResponse[];
};
export type TCourseLessonGetResponse = {
    list: TCourseItemLesson[];
    total: number | string;
    page: number;
    per_page: number;
    max_page?: number;
};
export type TproductsCategoriesGetResponse =
    | TproductsCategories[]
    | {
          list: TproductsCategories[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };

export type TproductsCategories = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsSourceGetResponse =
    | TproductsSourceGet[]
    | {
          list: TproductsSourceGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };

export type TproductsSourceGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsPassageGetResponse =
    | TproductsPassageGet[]
    | {
          list: TproductsPassageGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsPassageGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsQuestionTypeGetResponse =
    | TproductsQuestionTypeGet[]
    | {
          list: TproductsQuestionTypeGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsQuestionTypeGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsExamTypeGetResponse =
    | TproductsExamTypeGet[]
    | {
          list: TproductsExamTypeGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsExamTypeGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsTopicGetResponse =
    | TproductsTopicGet[]
    | {
          list: TproductsTopicGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsTopicGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsSectionGetResponse =
    | TproductsSectionGet[]
    | {
          list: TproductsSectionGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsSectionGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsTaskGetResponse =
    | TproductsTaskGet[]
    | {
          list: TproductsTaskGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsTaskGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsPartGetResponse =
    | TproductsPartGet[]
    | {
          list: TproductsPartGet[];
          total?: number | string;
          page?: number;
          per_page?: number;
          max_page?: number;
      };
export type TproductsPartGet = {
    id: string | number;
    name: string;
    slug: string;
    parent?: string | number;
};
export type TproductsTagGet = {
    product_source?: TproductsSourceGet[];
    product_passage?: TproductsPassageGet[];
    product_question_type?: TproductsQuestionTypeGet[];
    product_exam_type?: TproductsExamTypeGet[];
    product_topic?: TproductsTopicGet[];
    product_section?: TproductsSectionGet[];
    product_task?: TproductsTaskGet[];
    product_part?: TproductsPartGet[];
};
export type TCourseItemLesson = {
    id: string | number;
    course_id: string | number;
    questionnaire_id: string | number;
    title: string;
    description: string;
    video?: string;
    video_type?: string;
    type?: string;
    level?: TYPE_LESSON;
    duration: number | string;
    files?: string | string[];
    product_filters_link?: TproductsCategories[];
    product_filters?: TproductsTagGet[];
};

// --- Transactions types (added) ---
export type TWalletTransactionItem = {
    id: string | number;
    wallet_id: string | number;
    type: string;
    method?: string;
    amount: string;
    before_coin?: string;
    after_coin?: string;
    description?: string;
    extra?: Record<string, any>;
    status?: string;
    created?: string;
    updated?: string;
};

export type TWalletTransactionsResponse = {
    list: TWalletTransactionItem[];
    total?: number | string;
    page?: number;
    per_page?: number;
};
export type examplesItem = {
    example: number | string;
    example_vietnamese: string;
    definition?: string;
};
export type WordItem = {
    id: number | string;
    sentence_id: number | string;
    content: string;
    explanation?: string;
    phonetic?: string;
    examples?: examplesItem[];
    related_words?: string[];
    part_of_speech?: string;
};

export type sentencesItem = {
    id: number | string;
    translation_id: number | string;
    content: string;
    explanation?: string;
    words?: WordItem[];
};
export type TTranslation = {
    id: number | string;
    content: string;
    questionnaire_id?: string | number;
    sentences: sentencesItem[];
};
