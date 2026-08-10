import MyQuestionConfigDrag from "@/bases/MyQuestionConfigDrag";
import { convertToClientDataDrag } from "@/bases/MyQuestionConfigDrag/utils";
import { convertToServerDataDrag } from "@/bases/MyQuestionConfigDrag/utils";
import MyQuestionConfigFillingGapNoSSR from "@/bases/MyQuestionConfigFillingGap/MyQuestionConfigFillingGapNoSSR";
import {
  convertToClientDataFillingGap,
  convertToServerDataFillingGap,
} from "@/bases/MyQuestionConfigFillingGap/util";

import MyQuestionConfigMultipleChoice from "@/bases/MyQuestionConfigMultipleChoice";
import {
  convertToClientDataMultipleChoice,
  convertToServerDataMultipleChoice,
} from "@/bases/MyQuestionConfigMultipleChoice/utils";
import MyQuestionConfigSingleChoice from "@/bases/MyQuestionConfigSingleChoice";
import {
  convertToClientDataSingleChoice,
  convertToServerDataSingleChoice,
} from "@/bases/MyQuestionConfigSingleChoice/utils";
import MyQuestionConfigSpeaking from "@/bases/MyQuestionConfigSpeaking";
import { convertToClientDataSpeaking, convertToServerDataSpeaking } from "@/bases/MyQuestionConfigSpeaking/utils";
import MyQuestionConfigWriting from "@/bases/MyQuestionConfigWriting";
import { convertToClientDataWriting, convertToServerDataWriting } from "@/bases/MyQuestionConfigWriting/utils";
import { QUESTION_TYPES } from "@/types/enum";

// receive data from form => use this func to covert it into the data that BE needs
export const getExamConfigConverterToServer = (type: QUESTION_TYPES) => {
  const obj = {
    [QUESTION_TYPES.fill_in_the_blank]: convertToServerDataFillingGap,
    [QUESTION_TYPES.multiple_choice]: convertToServerDataMultipleChoice,
    [QUESTION_TYPES.single_choice]: convertToServerDataSingleChoice,
    [QUESTION_TYPES.single_choice_selector]: convertToServerDataSingleChoice,
    [QUESTION_TYPES.drag]: convertToServerDataDrag,
    [QUESTION_TYPES.speaking]: convertToServerDataSpeaking,
    [QUESTION_TYPES.writing]: convertToServerDataWriting,
  };
  return obj[type];
};

// receive data from BE => use this func to covert it into the data that FE needs
export const getExamConfigConverterToClient = (type: QUESTION_TYPES) => {
  const obj = {
    [QUESTION_TYPES.fill_in_the_blank]: convertToClientDataFillingGap,
    [QUESTION_TYPES.multiple_choice]: convertToClientDataMultipleChoice,
    [QUESTION_TYPES.single_choice]: convertToClientDataSingleChoice,
    [QUESTION_TYPES.single_choice_selector]: convertToClientDataSingleChoice,
    [QUESTION_TYPES.drag]: convertToClientDataDrag,
    [QUESTION_TYPES.speaking]: convertToClientDataSpeaking,
    [QUESTION_TYPES.writing]: convertToClientDataWriting, 
  };
  return obj[type];
};

export const getQuestionConfigComponent = (type: QUESTION_TYPES) => {
  const obj = {
    [QUESTION_TYPES.multiple_choice]: MyQuestionConfigMultipleChoice,
    [QUESTION_TYPES.single_choice]: MyQuestionConfigSingleChoice,
    [QUESTION_TYPES.single_choice_selector]: MyQuestionConfigSingleChoice,
    [QUESTION_TYPES.fill_in_the_blank]: MyQuestionConfigFillingGapNoSSR,
    [QUESTION_TYPES.drag]: MyQuestionConfigDrag,
    [QUESTION_TYPES.speaking]: MyQuestionConfigSpeaking,
    [QUESTION_TYPES.writing]: MyQuestionConfigWriting,
  };
  return obj[type];
};
