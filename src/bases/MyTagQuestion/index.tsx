import numberHandler from "@/utils/numberHandler";
import { tv, VariantProps } from "tailwind-variants";
import { EXAM_STRUCTURE } from "@/types/enum";

const dotStyle = tv({
  base: "w-2 h-2 font-medium rounded-full",
  variants: {
    type: {
      [EXAM_STRUCTURE.single]: "bg-pink-500",
      [EXAM_STRUCTURE.group]: "bg-blue-500",
    },
  },
  defaultVariants: {
    type: EXAM_STRUCTURE.single,
  },
});

export type TMyTagQuestionProps = {
  amount?: number; // for GROUP
} & VariantProps<typeof dotStyle>;

const MyTagQuestion: React.FC<TMyTagQuestionProps> = (props) => {
  const { type = EXAM_STRUCTURE.single, amount } = props;

  const TEXT = {
    [EXAM_STRUCTURE.single]: "Câu đơn",
    [EXAM_STRUCTURE.group]: "Câu nhóm",
  };

  return (
    <div className="rounded-md bg-white flex-shrink-0 flex gap-1 items-center px-2 py-1.5 border">
      <div
        className={dotStyle({
          type: type,
        })}
      />
      <span className="text-xs  flex-shrink-0 ">{TEXT?.[type]}</span>
      {Boolean(amount || amount === 0) && (
        <span className="text-xs py-0.5 px-1 bg-gray-50 rounded-md">
          {numberHandler.startPad(amount)}
        </span>
      )}
    </div>
  );
};

export default MyTagQuestion;