import MyCard from "@/bases/MyCard";
import MyFormItem from "@/bases/MyFormItem";
import MyIconButton from "@/bases/MyIconButton";
import MyInput from "@/bases/MyInput";
import MyTooltip from "@/bases/MyTooltip";
import { formRequired } from "@/constants/common";
import toastHandler from "@/utils/toastHandler";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Form } from "antd";
import { motion } from "motion/react";
import { useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { TMyFormProps } from "../..";
import FormCreate from "./FormCreate";
import ModalAddQuestionToPart from "./ModalAddQuestionToPart";
import ModalDeleteStructure from "./ModalDeleteStructure";
import QuestionSection from "./QuestionSection";
import { DownOutlined } from "@ant-design/icons";

type TProps = {
  form: TMyFormProps["form"];
};

const PartQuestionItem = (props) => {
  const {
    structureField,
    structure,
    addQuestionToStructure,
    id,
    collapsed,
    structureRemove,
    indexStructure,
    form,
    questions,
  } = props;

  const [dragging, setDragging] = useState(false);
  const [collapsedState, setCollapsedState] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (structure?.config) {
    return null;
  }

  return (
    <div className="relative" ref={setNodeRef} style={style}>
      <RxDragHandleDots2
        size={25}
        className=" cursor-pointer flex-shrink-0 rounded-md absolute top-1  z-10 left-[50%] rotate-90 text-gray-800 "
        {...attributes}
        {...listeners}
      />

      <MyCard
        title={
          <MyFormItem
            label={
              <>
                Tên nhóm bài tập{"  "}
                <DownOutlined
                  className="cursor-pointer rounded-md flex-shrink-0 ml-auto w-6 h-6 flex items-center justify-center"
                  size={14}
                  onClick={() => setCollapsedState((prev) => !prev)}
                  rotate={collapsedState ? 0 : 180}
                />
              </>
            }
            rules={[formRequired]}
            name={[structureField.name, "title"]}
            style={{ marginRight: 46, marginTop: 16 }}
          >
            <MyInput placeholder="Vui lòng nhập tên nhóm bài tập" />
          </MyFormItem>
        }
        style={{
          borderColor: "#dcdcdc",
        }}
        styles={{
          body: {
            display: !collapsedState ? (!collapsed ? "block" : "none") : "none",
          },
        }}
        extra={
          <div className="flex  gap-2" style={{ paddingTop: "19px" }}>
            <ModalAddQuestionToPart
              addQuestionToStructure={addQuestionToStructure}
            >
              {({ setOpen }) => (
                <MyTooltip title="Thêm câu hỏi">
                  <MyIconButton
                    onClick={() => setOpen(true)}
                    icon="ADD"
                    color="GREEN"
                    style={{ padding: "11px" }}
                  />
                </MyTooltip>
              )}
            </ModalAddQuestionToPart>
            <ModalDeleteStructure
              onDelete={() => structureRemove(indexStructure)}
            >
              {({ setOpen }) => {
                return (
                  <MyTooltip title="Xoá câu hỏi">
                    <MyIconButton
                      onClick={() => setOpen(true)}
                      icon="DELETE"
                      color="RED"
                      style={{ padding: "11px" }}
                    />
                  </MyTooltip>
                );
              }}
            </ModalDeleteStructure>
          </div>
        }
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-3">
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={() => {
                  setDragging(true);
                }}
                onDragEnd={(event) => {
                  setDragging(false);

                  const { active, over } = event;
                  const questionnaireStructure = form?.getFieldValue(
                    "questionnaire_structure"
                  );
                  const questionnaireStructureItem =
                    questionnaireStructure[indexStructure];

                  if (!over || active.id === over.id) return;

                  const oldIndex = questions.findIndex((f) => f === active.id);
                  const newIndex = questions.findIndex((f) => f === over.id);
                  const arrangedQuestions = arrayMove(
                    questions,
                    oldIndex,
                    newIndex
                  );
                  questionnaireStructureItem.questions = arrangedQuestions;

                  form?.setFieldValue(
                    "questionnaire_structure",
                    questionnaireStructure
                  );
                }}
              >
                <SortableContext
                  items={questions.map((ques) => ques)}
                  strategy={verticalListSortingStrategy}
                >
                  {questions.map((ques, indexQuestion) => {
                    return (
                      <QuestionSection
                        indexQuestion={indexQuestion}
                        indexStructure={indexStructure}
                        form={form}
                        id={ques}
                        collapsed={dragging}
                        key={ques}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          </motion.div>
        )}
      </MyCard>
    </div>
  );
};

const Exercise: React.FC<TProps> = ({ form }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-3">
      <Form.List name="questionnaire_structure">
        {(
          structureFields,
          { add: structureAdd, remove: structureRemove, move: structureMove }
        ) => {
          return (
            <div className="flex flex-col gap-3">
              <FormCreate
                structureAdd={structureAdd}
                structureFields={structureFields}
                form={form}
              />
          
                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={() => {
                    setDragging(true);
                  }}
                onDragEnd={(event) => {
                  setDragging(false);
                  const { active, over } = event;

                  if (!over || active.id === over.id) return;

                  const oldIndex = structureFields.findIndex(
                    (f) => f.key === active.id
                  );
                  const newIndex = structureFields.findIndex(
                    (f) => f.key === over.id
                  );
                  structureMove(oldIndex, newIndex);
                }}
              >
                <SortableContext
                  items={structureFields.map((structure) => structure.key)}
                  strategy={verticalListSortingStrategy}
                >
                  {structureFields.map((structureField, indexStructure) => {
                    const structure = form?.getFieldValue(
                      "questionnaire_structure"
                    )[indexStructure];
                    const { questions = [] } = structure || {};

                    const addQuestionToStructure = (questionIds: string[]) => {
                      try {
                        const clQuestionnaireStructure = form?.getFieldValue(
                          "questionnaire_structure"
                        );

                        clQuestionnaireStructure[indexStructure] = {
                          ...clQuestionnaireStructure[indexStructure],
                          questions: [
                            ...(clQuestionnaireStructure[indexStructure]
                              .questions || []),
                            ...questionIds,
                          ],
                        };

                        form?.setFieldValue(
                          "questionnaire_structure",
                          clQuestionnaireStructure
                        );
                        toastHandler.success(
                          `Đã thêm ${questionIds.length} câu hỏi `
                        );
                      } catch {
                        toastHandler.error("Thêm câu hỏi thất bại!");
                      }
                    };

                    return (
                      <PartQuestionItem
                        structureAdd={structureAdd}
                        key={structureField.key}
                        id={structureField.key}
                        collapsed={dragging}
                        addQuestionToStructure={addQuestionToStructure}
                        structureField={structureField}
                        structure={structure}
                        structureRemove={structureRemove}
                        indexStructure={indexStructure}
                        form={form}
                        questions={questions}
                      />
                    );
                  })}
                </SortableContext>
                
              </DndContext>
            </div>
          );
        }}
      </Form.List>
    </div>
  );
};

export default Exercise;
