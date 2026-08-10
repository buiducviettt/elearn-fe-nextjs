import {
    CREATE_EXERCISE_TYPE,
    RDOM_STRUCTURE,
    EXAM_STRUCTURE,
    QUESTION_CATEGORIES,
    QUESTION_TYPES,
    TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL,
    TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT,
    TEST_EXPLANATION,
    TEST_PRIVATE,
    TEST_TYPES,
    TEST_VISUAL,
    EXAM_SKILL,
    CREATE_IELTS_TYPE,
    TEST_MODE,
    CREATE_COURSE_TYPE,
    TYPE_LESSON,
} from "./enum";

export const OBJECT_QUESTION_CATEGORIES = {
    [RDOM_STRUCTURE.enable]: {
        value: RDOM_STRUCTURE.enable,
        label: "Ngân hàng ngẫu nhiên",
    },
    [QUESTION_CATEGORIES.question_structure]: {
        value: QUESTION_CATEGORIES.question_structure,
        label: "Loại câu hỏi",
    },
    [QUESTION_CATEGORIES.question_skill]: {
        value: QUESTION_CATEGORIES.question_skill,
        label: "Loại kỹ năng",
    },
    [QUESTION_CATEGORIES.question_level]: {
        value: QUESTION_CATEGORIES.question_level,
        label: "Độ khó",
    },
    [QUESTION_CATEGORIES.question_category]: {
        value: QUESTION_CATEGORIES.question_category,
        label: "Danh mục câu hỏi",
    },
    [QUESTION_CATEGORIES.question_part]: {
        value: QUESTION_CATEGORIES.question_part,
        label: "Phần câu hỏi",
    },
};

export const OBJECT_QUESTION_TYPES = {
    [QUESTION_TYPES.single_choice]: {
        value: QUESTION_TYPES.single_choice,
        label: "Chọn 1 câu đúng/sai",
    },
    [QUESTION_TYPES.single_choice_selector]: {
        value: QUESTION_TYPES.single_choice_selector,
        label: "Chọn 1 câu đúng/sai dạng select",
    },
    [QUESTION_TYPES.multiple_choice]: {
        value: QUESTION_TYPES.multiple_choice,
        label: "Chọn nhiều câu đúng/sai",
    },
    [QUESTION_TYPES.fill_in_the_blank]: {
        value: QUESTION_TYPES.fill_in_the_blank,
        label: "Điền vào chỗ trống",
    },
    // [QUESTION_TYPES.sort]: {
    //   value: QUESTION_TYPES.sort,
    //   label: "Sắp xếp từ",
    // },
    // [QUESTION_TYPES.match_words_images]: {
    //   value: QUESTION_TYPES.match_words_images,
    //   label: "Nối từ, hình ảnh",
    // },
    // [QUESTION_TYPES.spell]: {
    //   value: QUESTION_TYPES.spell,
    //   label: "Nghe chép chính tả",
    // },
    [QUESTION_TYPES.speaking]: {
        value: QUESTION_TYPES.speaking,
        label: "Nói",
    },
    [QUESTION_TYPES.writing]: {
        value: QUESTION_TYPES.writing,
        label: "Viết",
    },
    [QUESTION_TYPES.drag]: {
        value: QUESTION_TYPES.drag,
        label: "Kéo thả",
    },
};

export const OBJECT_TEST_TYPES = {
    [TEST_TYPES.ielts]: {
        value: TEST_TYPES.ielts,
        label: "IELTS",
    },
    // [TEST_TYPES.exercise]: {
    //   value: TEST_TYPES.exercise,
    //   label: "Mặc định",
    // },
    // [TEST_TYPES.practice_test]: {
    //   value: TEST_TYPES.practice_test,
    //   label: "Luyện đề",
    // },
    // [TEST_TYPES.entrance_test]: {
    //   value: TEST_TYPES.entrance_test,
    //   label: "Test đầu vào",
    // },
};

export const OBJECT_CREATE_IELTS_TYPE = {
    [CREATE_IELTS_TYPE.create_from_part]: {
        value: CREATE_IELTS_TYPE.create_from_part,
        label: "Thêm mới từ danh sách đề lẻ",
    },
    [CREATE_IELTS_TYPE.create_new]: {
        value: CREATE_IELTS_TYPE.create_new,
        label: "Thêm mới",
    },
    [CREATE_IELTS_TYPE.from_already_exist]: {
        value: CREATE_IELTS_TYPE.from_already_exist,
        label: "Thêm mới từ danh sách",
    },
};

export const OBJECT_CREATE_EXERCISE_TYPE = {
    [CREATE_EXERCISE_TYPE.create_new]: {
        value: CREATE_EXERCISE_TYPE.create_new,
        label: "Thêm mới",
    },
    [CREATE_EXERCISE_TYPE.random]: {
        value: CREATE_EXERCISE_TYPE.random,
        label: "Random từ thư viện",
    },
    [CREATE_EXERCISE_TYPE.from_already_exist]: {
        value: CREATE_EXERCISE_TYPE.from_already_exist,
        label: "Thêm mới từ danh sách",
    },
};

export const OBJECT_RDOM_STRUCTURE = {
    [RDOM_STRUCTURE.enable]: {
        label: "Không tham gia",
        value: RDOM_STRUCTURE.enable,
    },
    [RDOM_STRUCTURE.disable]: {
        label: "Có tham gia",
        value: RDOM_STRUCTURE.disable,
    },
};
export const OBJECT_SKILL = {
    [EXAM_SKILL.reading]: {
        label: "Đọc",
        value: EXAM_SKILL.reading,
    },
    [EXAM_SKILL.listening]: {
        label: "Nghe",
        value: EXAM_SKILL.listening,
    },
    [EXAM_SKILL.speaking]: {
        label: "Nói",
        value: EXAM_SKILL.speaking,
    },
    [EXAM_SKILL.writing]: {
        label: "Viết",
        value: EXAM_SKILL.writing,
    },
};

export const OBJECT_EXAM_STRUCTURE = {
    [EXAM_STRUCTURE.single]: {
        label: "Câu hỏi đơn",
        value: EXAM_STRUCTURE.single,
    },
    [EXAM_STRUCTURE.group]: {
        label: "Câu hỏi nhóm",
        value: EXAM_STRUCTURE.group,
    },
};

export const TEST_VISUAL_STRUCTURE = {
    [TEST_VISUAL.default]: {
        label: "Giao diện mặc định",
        value: TEST_VISUAL.default,
    },
    [TEST_VISUAL.table]: {
        label: "Giao diện bảng",
        value: TEST_VISUAL.table,
    },
};

export const OBJECT_TEST_EXPLANATION = {
    [TEST_EXPLANATION.yes]: {
        label: "Có",
        value: TEST_EXPLANATION.yes,
    },
    [TEST_EXPLANATION.no]: {
        label: "Không",
        value: TEST_EXPLANATION.no,
    },
};

export const OBJECT_TEST_MODE = {
    [TEST_MODE.no]: {
        label: "Đề Full",
        value: TEST_MODE.no,
    },
    [TEST_MODE.yes]: {
        label: "Đề Part",
        value: TEST_MODE.yes,
    },
};

export const OBJECT_TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT = {
    [TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT.yes]: {
        label: "Có",
        value: TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT.yes,
    },
    [TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT.no]: {
        label: "Không",
        value: TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT.no,
    },
};

export const OBJECT_TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL = {
    [TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL.yes]: {
        label: "Có",
        value: TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL.yes,
    },
    [TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL.no]: {
        label: "Không",
        value: TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL.no,
    },
};

export const OBJECT_TEST_PRIVATE = {
    [TEST_PRIVATE.no]: {
        label: "Không",
        value: TEST_PRIVATE.no,
    },
    [TEST_PRIVATE.yes]: {
        label: "Riêng tư",
        value: TEST_PRIVATE.yes,
    },
};
export const OBJECT_TYPE_LESSON = {
    [TYPE_LESSON.free]: {
        value: TYPE_LESSON.free,
        label: "Free",
    },
    [TYPE_LESSON.pro]: {
        value: TYPE_LESSON.pro,
        label: "Pro",
    },
};

export const OBJECT_CREATE_COURSE_TYPE = {
    [CREATE_COURSE_TYPE.create_new]: {
        value: CREATE_COURSE_TYPE.create_new,
        label: "Thêm mới",
    },
    [CREATE_COURSE_TYPE.from_already_exist]: {
        value: CREATE_COURSE_TYPE.from_already_exist,
        label: "Thêm mới từ danh sách",
    },
};
