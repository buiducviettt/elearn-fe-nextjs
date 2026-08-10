import MyCheckboxLarge from "../MyCheckbox/MyCheckboxLarge";
import MyTagQuestion, { TMyTagQuestionProps } from "../MyTagQuestion";

type TMyItemQuestionGroupProps = {
  checked?: boolean;
  label: string;
  tagQuestion?: TMyTagQuestionProps;
  options?: {
    showCheckbox?: boolean;
  };
  extra?: React.ReactNode;
};

const MyItemQuestionGroup: React.FC<TMyItemQuestionGroupProps> = (props) => {
  const {
    checked = false,
    label,
    tagQuestion = {},
    options = {},
    extra,
  } = props;
  const { showCheckbox = true } = options || {};

  return (
    <div className="flex gap-2 col-span-1 bg-gray-100 p-3 rounded-xl items-center">
      <MyTagQuestion {...tagQuestion} />
      <div className="font-semibold text-left flex-1 line-clamp-1">{label}</div>
      {showCheckbox && <MyCheckboxLarge checked={checked} />}
      {extra}
    </div>
  );
};

export default MyItemQuestionGroup;
