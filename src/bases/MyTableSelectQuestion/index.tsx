import { PAGE_SIZE } from "@/constants/common";
import { questionService } from "@/services/question";
import { EXAM_SKILL, EXAM_STRUCTURE } from "@/types/enum";
import { TQuestionGetResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "antd/es/form/Form";
import { useState, useEffect } from "react";
import MyButton from "../MyButton";
import MyCard from "../MyCard";
import MyEmpty from "../MyEmpty";
import MyForm from "../MyForm";
import ModalSelectedQuestion, {
  TModalSelectedQuestionProps,
} from "../MyForm/MyFormTestConfig/Exercise/ModalSelectedQuestion";
import MyFormItem from "../MyFormItem";
import MyInput from "../MyInput";
import MyItemQuestionGroup from "../MyItemQuestionGroup";
import MyPagination from "../MyPanination";
import MyRawButton from "../MyRawButton";
import MySelectExamCategory from "../MySelect/MySelectExamCategory";
import MySelectExamLevel from "../MySelect/MySelectExamLevel";
import MySelectExamPart from "../MySelect/MySelectExamPart";
import MySelectExamSkill from "../MySelect/MySelectExamSkill";
import MySpin from "../MySpin";

type TMyTableSelectQuestionProps = {
  existingQuestionIds?: string[]; 
  questionnaireSkillType?: string;
    disableSkill?: boolean; 
} & Pick<
  TModalSelectedQuestionProps,
  "onConfirm" | "confirmLoading"
>;
const getSkillIdByType = (type?: string) => {
  switch (type) {
    case EXAM_SKILL.listening:
      return "4";
    case EXAM_SKILL.reading:
      return "5";
    case EXAM_SKILL.speaking:
      return "6";
    case EXAM_SKILL.writing:
      return "7";
    default:
      return undefined;
  }
};
const MyTableSelectQuestion: React.FC<TMyTableSelectQuestionProps> = (
  props,
) => {
  const { confirmLoading, onConfirm, existingQuestionIds = [], questionnaireSkillType, disableSkill } = props;

  const [form] = useForm();
  const [searchDebounced, setSearchDebounced] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<
    TQuestionGetResponse["list"][0][]
  >([]);
  const [page, setPage] = useState(1);
  const level = useWatch(["level"], form);
  const category = useWatch(["category"], form);
  const part = useWatch(["part"], form);
  const skill = useWatch(["skill"], form);

  // Reset về trang 1 khi thay đổi filter hoặc search
  useEffect(() => {
    setPage(1);
  }, [searchDebounced, level, category, part, skill]);
  useEffect(() => {
    if (questionnaireSkillType) {
      const skillId = getSkillIdByType(questionnaireSkillType);
      form.setFieldValue("skill", skillId);
    }
  }, [questionnaireSkillType, form]);
  const addSelectedQuestion = (question: TQuestionGetResponse["list"][0]) => {
    setSelectedQuestion([...selectedQuestion, question]);
  };
  const removeSelectedQuestion = (
    question: TQuestionGetResponse["list"][0],
  ) => {
    setSelectedQuestion(selectedQuestion.filter((id) => id !== question));
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      questionService.keyGet,
      {
        page: page,
        per_page: PAGE_SIZE,
        keyword: searchDebounced,
        level,
        category,
        part,
        skill,
      },
    ],
    queryFn: () => {
      return questionService.get({
        page: page,
        per_page: PAGE_SIZE,
        keyword: searchDebounced,
        level,
        category,
        part,
        skill,
      });
    },
    select: (data) => data.payload.data,
  });
  const { list = [], total = 0, page: current = 0 } = data || {};

  return (
    <MyForm form={form}>
      <div className="grid gap-4 grid-cols-12">
        <MyCard className="col-span-12 lg:col-span-5 ">
          <div className=" flex flex-col">
            <MyFormItem name="level" label="Độ khó ">
              <MySelectExamLevel />
            </MyFormItem>
            <MyFormItem name="category" label="Danh mục ">
              <MySelectExamCategory />
            </MyFormItem>
            <MyFormItem name="part" label="Phần ">
              <MySelectExamPart />
            </MyFormItem>
            <MyFormItem name="skill" label="Kỹ năng">
              <MySelectExamSkill disabled={!!questionnaireSkillType || disableSkill} />
            </MyFormItem>
          </div>
        </MyCard>
        <MyCard className="col-span-12 lg:col-span-7 ">
          <div className="flex flex-col gap-3">
            <MyFormItem name="search" label="Tìm kiếm câu hỏi">
              <MyInput
                allowClear
                onChangeDebounced={(event) => {
                  setSearchDebounced(event.target.value);
                  // setPage(1) sẽ được gọi trong useEffect
                }}
                placeholder="Nhập câu hỏi"
              />
            </MyFormItem>
            <MySpin spinning={isLoading}>
              <div className="flex flex-col min-h-[300px] gap-3">
                {list.map((item) => {
                  const {
                    question_id,
                    question_title,
                    question_type,
                    question_items = [],
                  } = item || {};
                  const checked = selectedQuestion
                    .map((item) => item.question_id)
                    .includes(question_id);
                  
                  // Kiểm tra câu hỏi đã tồn tại trong nhóm bài tập
                  const isExisting = existingQuestionIds.includes(question_id);

                  return (
                    <MyRawButton
                      onClick={() => {
                        if (isExisting) return; // Không cho phép click nếu đã tồn tại
                        if (checked) {
                          removeSelectedQuestion(item);
                        } else {
                          addSelectedQuestion(item);
                        }
                      }}
                      key={question_id}
                      disabled={isExisting} // Disable nếu đã tồn tại
                      style={{ 
                        opacity: isExisting ? 0.5 : 1,
                        cursor: isExisting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <MyItemQuestionGroup
                        checked={checked}
                        tagQuestion={{
                          amount: question_items.length,
                          type: question_type,
                        }}
                        label={`${question_title}${isExisting ? ' (Đã có trong nhóm)' : ''}`}
                      />
                    </MyRawButton>
                  );
                })}
                {list.length !== 0 && (
                  <div className="flex mt-2 items-center justify-end">
                    <MyPagination
                      size="small"
                      pageSize={PAGE_SIZE}
                      current={current}
                      total={Number(total)}
                      onChange={(page) => {
                        setPage(page);
                      }}
                    />
                  </div>
                )}
                {list.length === 0 && (
                  <div className="flex-1">
                    <MyEmpty />
                  </div>
                )}
              </div>
            
            </MySpin>
            <div className="flex gap-3">
              <ModalSelectedQuestion
                setSelectedQuestion={setSelectedQuestion}
                confirmLoading={confirmLoading}
                onConfirm={onConfirm}
                selectedQuestion={selectedQuestion}
                removeSelectedQuestion={removeSelectedQuestion}
                addSelectedQuestion={addSelectedQuestion}
              >
                {({ setOpen }) => {
                  return (
                    <MyButton
                      disabled={selectedQuestion.length === 0}
                      onClick={() => setOpen(true)}
                      type="primary"
                    >
                      Đã chọn ({selectedQuestion.length})
                    </MyButton>
                  );
                }}
              </ModalSelectedQuestion>

              <MyButton
                onClick={() => {
                  setSelectedQuestion([]);
                }}
              >
                Bỏ chọn
              </MyButton>
            </div>
          </div>
        </MyCard>
      </div>
    </MyForm>
  );
};

export default MyTableSelectQuestion;