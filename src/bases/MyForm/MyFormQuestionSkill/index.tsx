import MyFormItem from "@/bases/MyFormItem";
import MyInput, { TMyInputProps } from "@/bases/MyInput";
import MySelectQuestionCategories from "@/bases/MySelect/MySelectQuestionCategories";
import MyTextArea from "@/bases/MyTextArea";
import { formRequired } from "@/constants/common";
import MyForm, { TMyFormProps } from "..";

type TMyFormQuestionSkillProps = {
  inputName?: TMyInputProps;
} & TMyFormProps;

const MyFormQuestionSkill: React.FC<TMyFormQuestionSkillProps> = (props) => {
  const { inputName = {}, ...rest } = props;
  return (
    <MyForm {...rest}>
      <MyFormItem rules={[formRequired]} name="taxonomy" label="Loại">
        <MySelectQuestionCategories disabled />
      </MyFormItem>
      <MyFormItem rules={[formRequired]} name="taxonomy_name" label="Tên">
        <MyInput {...inputName} />
      </MyFormItem>
      <MyFormItem name="taxonomy_description" label="Mô tả">
        <MyTextArea />
      </MyFormItem>
    </MyForm>
  );
};

export default MyFormQuestionSkill;
