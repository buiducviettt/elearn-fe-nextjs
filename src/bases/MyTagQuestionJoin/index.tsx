import numberHandler from "@/utils/numberHandler";
import { tv, VariantProps } from "tailwind-variants";
import { RDOM_STRUCTURE } from "@/types/enum";

const dotStyle = tv({
  base: "w-2 h-2 font-medium rounded-full",
  variants: {
    type: {
      [RDOM_STRUCTURE.enable]: "bg-pink-500",
      [RDOM_STRUCTURE.disable]: "bg-blue-500",
    },
  },
  defaultVariants: {
    type: RDOM_STRUCTURE.enable,
  },
});

export type TMyTagQuestionPropsJoin = {
  amount?: number; // for GROUP
} & VariantProps<typeof dotStyle>;

const MyTagQuestion: React.FC<TMyTagQuestionPropsJoin> = (props) => {
  const { type = RDOM_STRUCTURE.enable, amount } = props;

  const TEXT = {
    [RDOM_STRUCTURE.enable]: "Không tham gia",
    [RDOM_STRUCTURE.disable]: "Có tham gia",
  };

  return (
    <div className="rounded-md bg-white flex-shrink-0 flex gap-1 items-center px-2 py-1.5 border">
      <div
        className={dotStyle({
          type: type,
        })}
      />
      <span className="text-xs flex-shrink-0">{TEXT?.[type]}</span>
      {Boolean(amount || amount === 0) && (
        <span className="text-xs py-0.5 px-1 bg-gray-50 rounded-md">
          {numberHandler.startPad(amount)}
        </span>
      )}
    </div>
  );
};

export default MyTagQuestion;