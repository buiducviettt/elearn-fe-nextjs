import { OBJECT_TEST_TYPES } from "@/types/common";
import { TEST_TYPES } from "@/types/enum";
import numberHandler from "@/utils/numberHandler";
import { tv, VariantProps } from "tailwind-variants";

const dotStyle = tv({
  base: "w-2 h-2 font-medium rounded-full",
  variants: {
    type: {
      [TEST_TYPES.exercise]: "bg-blue-500",
      [TEST_TYPES.practice_test]: "bg-orange-500",
      [TEST_TYPES.entrance_test]: "bg-pink-500",
      [TEST_TYPES.ielts]: "bg-green-500",
    },
  },
  defaultVariants: {
    type: TEST_TYPES.ielts,
  },
});

export type TMyTagTestTypeProps = {
  amount?: number;
  type?: TEST_TYPES;
} & Omit<VariantProps<typeof dotStyle>, 'type'>;

const MyTagTestType: React.FC<TMyTagTestTypeProps> = (props) => {
  const { type = TEST_TYPES.exercise, amount } = props;

  return (
    <div className="rounded-md bg-white flex-shrink-0 flex gap-1 items-center px-2 py-1.5 border">
      <div
        className={dotStyle({
          type: type,
        })}
      />
      <span className="text-xs  flex-shrink-0 ">
        {OBJECT_TEST_TYPES[type].label}
      </span>
      {Boolean(amount || amount === 0) && (
        <span className="text-xs py-0.5 px-1 bg-gray-50 rounded-md">
          {numberHandler.startPad(amount)}
        </span>
      )}
    </div>
  );
};

export default MyTagTestType;
