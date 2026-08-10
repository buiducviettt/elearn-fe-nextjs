import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import MyFormItem from "@/bases/MyFormItem";
import { Form } from "antd";
import GroupQuestion from "../components/GroupQuestion";
import GroupQuestionGenerator from "../components/GroupQuestionGenerator";
import OverallTest from "../components/OverallTest";
import MyUploadMultipleTypeHasApi from "@/bases/MyUploadMultipleType/MyUploadMultipleTypeHasApi";

const TestSet = ({ form }) => {
  return (
    <div className="flex gap-2 w-full p-2">
      <div className="flex gap-2 w-full p-2">
        <div className="flex-1">
          <MyCard>
            <MyFormItem label="Upload file" name="questionnaire_file">
              <MyUploadMultipleTypeHasApi />
            </MyFormItem>
          </MyCard>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-3">
          <Form.List initialValue={[]} name="questionnaire_structure">
            {(groupQuestionFields, { remove }) => (
              <div className="flex flex-col gap-3">
                {groupQuestionFields.map((field, index) => (
                  <GroupQuestion
                    key={field.key}
                    remove={() => remove(index)}
                    form={form}
                    field={field}
                  />
                ))}
                {groupQuestionFields.length === 0 && (
                  <MyCard>
                    <MyEmpty description="Vui lòng tạo câu hỏi" />
                  </MyCard>
                )}
              </div>
            )}
          </Form.List>

          <MyCard>
            <GroupQuestionGenerator form={form} />
          </MyCard>
          <OverallTest form={form} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSet;
