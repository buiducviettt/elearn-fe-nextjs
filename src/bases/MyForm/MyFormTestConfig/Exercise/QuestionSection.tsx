import MyCard from "@/bases/MyCard";
import MyEmpty from "@/bases/MyEmpty";
import { TMyFormProps } from "@/bases/MyForm";
import MyRawButton from "@/bases/MyRawButton";
import MySpin from "@/bases/MySpin";
import MyTooltip from "@/bases/MyTooltip";
import { questionService } from "@/services/question";
import {
  getExamConfigConverterToClient,
  getQuestionConfigComponent,
} from "@/utils/common";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { RxDragHandleDots2 } from "react-icons/rx";
import ModalDeleteQuestionItem from "./ModalDeleteQuestionItem";
import ModalEditQuestionItem from "./ModalEditQuestionItem";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";

type TProps = {
  form: TMyFormProps["form"];
  id: number;
  indexStructure: number;
  indexQuestion: number;
  collapsed: boolean;
};

const QuestionSection: React.FC<TProps> = ({
  id,
  form,
  indexStructure,
  indexQuestion,
  collapsed,
}) => {
  const [collapsedState, setCollapsedState] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { data: question, isLoading } = useQuery({
    queryKey: [questionService.keyGetDetail, id],
    queryFn: () => questionService.getDetail(id),
    select: (data) => data.payload.data,
  });

  const { question_title, question_items = [] } = question || {};

  const removeQuestion = () => {
    const questionnaireStructure = form?.getFieldValue(
      "questionnaire_structure",
    );

    // Ensure `questionnaireStructure` exists
    if (!questionnaireStructure || !questionnaireStructure[indexStructure])
      return;

    // Create a new updated structure
    const updatedStructure = [...questionnaireStructure];

    // Remove the question at `indexQuestion`
    updatedStructure[indexStructure] = {
      ...updatedStructure[indexStructure],
      questions: updatedStructure[indexStructure].questions.filter(
        (_, index) => index !== indexQuestion,
      ),
    };

    // If the `questions` array is empty, remove this structure item
    const finalStructure = updatedStructure.filter(
      (structure) => structure.questions.length > 0,
    );

    // Update the form value
    form?.setFieldValue("questionnaire_structure", finalStructure);
  };

  return (
    <div ref={setNodeRef} className="relative" style={style}>
      <MySpin spinning={isLoading}>
        <MyCard
          title={
            <div className="flex gap-2 items-center">
              <RxDragHandleDots2
                size={22}
                className=" cursor-pointer flex-shrink-0 rotate-90 text-gray-800 "
                {...attributes}
                {...listeners}
              />
              <p className="text-sm font-medium truncate">
                {question_title}
              </p>
              <DownOutlined
                className="cursor-pointer rounded-md flex-shrink-0 ml-auto w-6 h-6 flex items-center justify-center"
                onClick={() => setCollapsedState((prev) => !prev)}
                style={{fontSize: '12px' }}
                rotate={collapsedState ? 0 : 180}
                spin={collapsedState}
              />
            </div>
          }
          styles={{
            body: {
              display: !collapsedState ? (!collapsed ? "block" : "none") : "none",
            },
          }}
          extra={
            <div className="flex gap-2">
              <ModalEditQuestionItem question={question}>
                {({ setOpen }) => {
                  return (
                    <MyTooltip title="Chỉnh sửa">
                      <MyRawButton
                        onClick={() => {
                          setOpen(true);
                        }}
                        className=" bg-blue-50 text-blue-500 p-1 rounded-md"
                      >
                        <CiEdit className="" size={18} />
                      </MyRawButton>
                    </MyTooltip>
                  );
                }}
              </ModalEditQuestionItem>
              <ModalDeleteQuestionItem
                onDelete={() => removeQuestion()}
                title={question_title}
              >
                {({ setOpen }) => {
                  return (
                    <MyTooltip title="Xoá">
                      <MyRawButton
                        onClick={() => {
                          setOpen(true);
                        }}
                        className="text-red-500 bg-red-50 p-1 rounded-md"
                      >
                        <RiDeleteBin7Line size={18} />
                      </MyRawButton>
                    </MyTooltip>
                  );
                }}
              </ModalDeleteQuestionItem>
            </div>
          }
        >
          {!collapsedState && !collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }} // Expands dynamically
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="flex flex-col gap-3">
                {question_items.length === 0 && <MyEmpty />}
                {question_items.map((item, index) => {
                  const { id, type } = item || {};
                  const converter = getExamConfigConverterToClient(type);
                  const QuestionConfigComponent =
                    getQuestionConfigComponent(type);
                  if (QuestionConfigComponent) {
                    return (
                      <QuestionConfigComponent
                        viewMode
                        value={converter(item)}
                        order={index + 1}
                        key={id}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </motion.div>
          )}
        </MyCard>
      </MySpin>
    </div>
  );
};

export default QuestionSection;
