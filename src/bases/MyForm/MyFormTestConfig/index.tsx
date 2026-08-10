import MyCard from "@/bases/MyCard";
import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectTestCannotSubmitUntilDone from "@/bases/MyGroupSelect/MyGroupSelectTestCannotSubmitUntilDone";
import MyGroupSelectTestCannotSubmitUntilTimeout from "@/bases/MyGroupSelect/MyGroupSelectTestCannotSubmitUntilTimeout";
import MyGroupSelectTestExplanation from "@/bases/MyGroupSelect/MyGroupSelectTestExplanation";
import MyGroupSelectTestPrivateHasInput from "@/bases/MyGroupSelect/MyGroupSelectTestPrivate/MyGroupSelectTestPrivateHasInput";
import { validTestPrivateHasInput } from "@/bases/MyGroupSelect/MyGroupSelectTestPrivate/MyGroupSelectTestPrivateHasInput/utils";
import MyGroupSelectTestType from "@/bases/MyGroupSelect/MyGroupSelectTestType";
import MyInput from "@/bases/MyInput";
import MyInputNumber from "@/bases/MyInputNumber";
// import { PiSmileySad } from "react-icons/pi";
import TestSet from "./TestSet";
import MyTextArea from "@/bases/MyTextArea";

import { formRequired } from "@/constants/common";
import { EXAM_SKILL, TEST_TYPES } from "@/types/enum";
import { useWatch } from "antd/es/form/Form";
import MyForm, { TMyFormProps } from "..";
import Exercise from "./Exercise";
import MyRadioV1TestCategory from "@/bases/MyRadioV1/MyRadioV1TestCategory";
import styles from "./style.module.scss";
import Ielts from "./Ielts";
import MyUploadAudioHasApi from "@/bases/MyUploadAudio/MyUploadAudioHasApi";
import { OBJECT_TEST_MODE } from "@/types/common";
import MyGroupSelectTestSkill from "@/bases/MyGroupSelect/MyGroupSelectTestSkill";
import MyGroupSelectTestMode from "@/bases/MyGroupSelect/MyGroupSelectTestMode";

type TMyFormTestConfigProps = {
  form: TMyFormProps["form"];
} & TMyFormProps;
const MyFormTestConfig: React.FC<TMyFormTestConfigProps> = (props) => {
  const { form, className = "", ...rest } = props;
  const questionnaireSkill = useWatch(["questionnaire_type"], form);
  const questionnaireSkillType = useWatch(["questionnaire_skill"], form) || EXAM_SKILL.reading; 
  const defaultMode = Object.values(OBJECT_TEST_MODE)[0]?.value;
  const structures = useWatch(["questionnaire_structure"], form) || [];

  return (
    <MyForm
      initialValues={{
        questionnaire_type: TEST_TYPES.ielts,
        questionnaire_system: defaultMode,
        questionnaire_skill: EXAM_SKILL.reading, 
      }}
      form={form}
      className={`${className}`}
      {...rest}
    >
      <div className="grid gap-4 grid-cols-12">
        <div className="col-span-12 2xl:col-span-4">
          <MyCard title="Tạo đề thi">
            <MyFormItem
              rules={[formRequired]}
              name="questionnaire_title"
              label="Tên đề thi"
            >
              <MyInput placeholder="Nhập tên đề thi" />
            </MyFormItem>
            <MyFormItem name="questionnaire_type" label="Loại đề thi">
              <MyGroupSelectTestType />
            </MyFormItem>
            {questionnaireSkill === TEST_TYPES.ielts && (
              <MyFormItem
                name="questionnaire_skill"
                rules={[formRequired]}
                label="Phân loại Kỹ năng"
              >
              <MyGroupSelectTestSkill />
              </MyFormItem>
            )}
            <MyFormItem
              name="questionnaire_time"
              rules={[formRequired]}
              label="Thời gian làm bài"
            >
              <MyInputNumber
                suffix="Phút"
                className="!w-full"
                step={1}
                min={1}
                placeholder="Nhập vào số phút"
              />
            </MyFormItem>
            <MyFormItem
              name="questionnaire_category"
              rules={[formRequired]}
              label="Chuyên mục đề"
            >
              <MyRadioV1TestCategory />
            </MyFormItem>
            <MyFormItem name="questionnaire_tag" rules={[]} label="Tag">
              <MyInput placeholder="Nhập tag" />
            </MyFormItem>
            <MyFormItem name="questionnaire_description" label="Mô tả">
              <MyTextArea rows={5} placeholder="Nhập mô tả" />
            </MyFormItem>
            <MyFormItem
              name="questionnaire_system"
              rules={[formRequired]}
              label="Chế độ làm bài"
            >
              <MyGroupSelectTestMode/>
            </MyFormItem>
            <MyFormItem
              rules={[formRequired]}
              name="questionnaire_explanation"
              label="Hiển thị lời giải"
            >
              <MyGroupSelectTestExplanation />
            </MyFormItem>
            <MyFormItem
              rules={[formRequired]}
              name="questionnaire_submit_time"
              label="Hết thời gian mới được nộp bài"
            >
              <MyGroupSelectTestCannotSubmitUntilTimeout />
            </MyFormItem>
            <MyFormItem
              rules={[formRequired]}
              name="questionnaire_submit_all"
              label="Làm hết câu hỏi mới được nộp bài"
            >
              <MyGroupSelectTestCannotSubmitUntilDone />
            </MyFormItem>
            <MyFormItem
              name="questionnaire_private"
              rules={[formRequired, { validator: validTestPrivateHasInput }]}
              label="Riêng tư"
            >
              <MyGroupSelectTestPrivateHasInput />
            </MyFormItem>
            <MyFormItem
              name="questionnaire_submit_count"
              label="Giới hạn số lần làm bài"
            >
              <MyInputNumber
                className="!w-full"
                step={1}
                min={0}
                placeholder="Không nhập nếu không giới hạn"
              />
            </MyFormItem>
            {questionnaireSkill === TEST_TYPES.ielts && questionnaireSkillType === EXAM_SKILL.listening && (
              <MyFormItem label="Upload file" name="questionnaire_file">
                <MyUploadAudioHasApi />
              </MyFormItem>
            )}
          </MyCard>
        </div>
        <div className="col-span-12 2xl:col-span-8">
          {/* {questionnaireSkill === TEST_TYPES.exercise && (
            <div className={`col-span-12 ${styles['psticky']} `}>
              <Exercise form={form} />
            </div>
          )} */}
        {questionnaireSkill === TEST_TYPES.ielts && (
            <div className={`col-span-12 ${styles['psticky']} `}>
              <Ielts form={form} questionnaireSkillType={questionnaireSkillType} />
            </div>
          )}
          {/* {questionnaireSkill === TEST_TYPES.practice_test && (
            <div className="bg-white min-h-[500px] h-full gap-5 text-gray-600 rounded-lg border flex justify-center ">
              <TestSet form={form} />
            </div>
          )} */}
          {/* {questionnaireSkill === TEST_TYPES.entrance_test && (
            // <div className="bg-white min-h-[500px] h-full  gap-5 text-gray-600 rounded-lg border flex items-center justify-center">
            //   <TestSet form={form} />
            // </div>
            <div className={`col-span-12 ${styles['psticky']} `}>
            <Exercise form={form} />
            </div>
          )} */}
          {/* {questionnaireSkill === TEST_TYPES.practice_test && (
            <TestSet form={form} />
          )} */}
        </div>
      </div>
    </MyForm>
  );
};

export default MyFormTestConfig;
