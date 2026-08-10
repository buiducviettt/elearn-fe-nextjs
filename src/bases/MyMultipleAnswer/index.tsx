import { PlusOutlined } from "@ant-design/icons";
import { LiaTimesSolid } from "react-icons/lia";
import MyButton from "../MyButton";
import MyFormItem from "../MyFormItem";
import MyInput from "../MyInput";
import MyRawButton from "../MyRawButton";

const InputRemove = ({
  content,
  id,
  viewMode,
  onChange,
  onClickRemove,
  showDelete,
  hideRemoveButton,
}) => {
  return (
    <div className="flex gap-1.5">
      <MyFormItem style={{ marginBottom: 0 }}>
        <MyInput
          disabled={viewMode}
          value={content}
          onChange={(e) => onChange(id, e.target.value)}
        />
      </MyFormItem>
      {showDelete && !viewMode && !hideRemoveButton && (
        <MyRawButton
          tabIndex={-1} // don't focus when tab
          onClick={onClickRemove}
          className="p-1 hover:bg-gray-50 rounded-md"
        >
          <LiaTimesSolid className="text-gray-600 " size={24} />
        </MyRawButton>
      )}
    </div>
  );
};

export type TMyMultipleAnswerProps = {
  answers: {
    id: number;
    content: string;
  }[];
  viewMode?: boolean;
  onAddAnswers: () => void;
  onRemoveAnswer: (id: number) => void;
  onChangeAnswer: (id: number, value: string) => void;
  hideAddButton?: boolean;
  hideRemoveButton?: boolean;
};

const MyMultipleAnswer: React.FC<TMyMultipleAnswerProps> = (props) => {
  const {
    answers = [],
    onAddAnswers,
    onRemoveAnswer,
    onChangeAnswer,
    viewMode = false,
    hideAddButton = false,
    hideRemoveButton = false,
  } = props;

  return (
    <div className="flex gap-2">
      {!viewMode && !hideAddButton && (
        <MyButton
          color="cyan"
          className="flex-shrink-0"
          onClick={onAddAnswers}
          icon={<PlusOutlined />}
        ></MyButton>
      )}
      <div className="flex flex-wrap gap-2">
        {answers.map((answer) => (
          <InputRemove
            key={answer.id}
            viewMode={viewMode}
            showDelete={answers.length > 1 && !hideRemoveButton}
            id={answer.id}
            content={answer.content}
            onChange={onChangeAnswer}
            onClickRemove={() => onRemoveAnswer(answer.id)}
            hideRemoveButton={hideRemoveButton}
          />
        ))}
      </div>
    </div>
  );
};

export default MyMultipleAnswer;
