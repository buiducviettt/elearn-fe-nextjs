export enum QUESTION_CATEGORIES {
    question_skill = "question_skill",
    question_level = "question_level",
    question_structure = "question_structure",
    question_category = "question_category",
    question_part = "question_part",
}

export enum QUESTION_TYPES {
    multiple_choice = "multiple_choice",
    single_choice = "single_choice",
    single_choice_selector = "single_choice_selector",
    fill_in_the_blank = "fill_in_the_blank",
    drag = "drag",
    sort = "sort",
    spell = "spell",
    match_words_images = "match_words_images",
    speaking = "speaking",
    writing = "writing",
}
export enum QUESTIONPRAC_TYPES {
    multiple_choice = "multiple_choice",
    single_choice = "single_choice",
    fill_in_the_blank = "fill_in_the_blank",
}
export enum LAYOUT_QUESTION_TYPES {
    normal = "Mặc định", // Content trên, đáp án dưới
    answer_top = "Đáp án trên, nội dung dưới", // Content dưới, đáp án trên
    contentLeft_answerRight = "Nội dung trái, đáp án phải", // Content trái, đáp án phải
    contentRight_answerLeft = "Nội dung phải, đáp án trái", // Content phải, đáp án trái
}
export enum TEST_TYPES {
    exercise = "exercise",
    practice_test = "practice",
    entrance_test = "pretest",
    ielts = "ielts",
}
export enum TEST_CATEGORIES {
    questionnaire_category = "questionnaire_category",
}

export enum CREATE_IELTS_TYPE {
    create_from_part = "create_from_part",
    from_already_exist = "from_already_exist",
    create_new = "create_new",
}
export enum CREATE_EXERCISE_TYPE {
    random = "random",
    from_already_exist = "from_already_exist",
    create_new = "create_new",
}
export enum RDOM_STRUCTURE {
    disable = "0",
    enable = "1",
}
export enum QUESTION_MULTIPLE_TYPE {
    disable = "0",
    enable = "1",
}
export enum QUESTION_CLONEABLE_TYPE {
    disable = "0",
    enable = "1",
}
export enum QUESTION_DRAGABLE_TYPE {
    disable = "0",
    enable = "1",
}

export enum EXAM_SKILL {
    reading = "reading",
    listening = "listening",
    speaking = "speaking",
    writing = "writing",
}
export enum WALLET_TRANSACTION_TYPE {
    plus = "Nạp xu",
    minus = "Sử dụng xu",
}

export enum EXAM_STRUCTURE {
    single = "single",
    group = "group",
}
export enum TEST_VISUAL {
    default = "default",
    table = "table",
}
export enum TEST_EXPLANATION {
    yes = "1",
    no = "0",
}
export enum TEST_MODE {
    yes = "1",
    no = "0",
}
export enum TEST_CANNOT_SUMMIT_UNTIL_TIMEOUT {
    yes = "1",
    no = "0",
}
export enum TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL {
    yes = "1",
    no = "0",
}

export enum TEST_PRIVATE {
    yes = "1",
    no = "0",
}
export enum CREATE_COURSE_TYPE {
    from_already_exist = "from_already_exist",
    create_new = "create_new",
}

export enum TYPE_LESSON {
    free = "free",
    pro = "pro",
}
