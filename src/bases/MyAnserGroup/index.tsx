// import { QUESTIONPRAC_TYPES } from "@/types/enum";
// import numberHandler from "@/utils/numberHandler";
// import React from "react";

// type TValue<T> = {
//   order: number;
//   point: number;
//   answer: T;
//   type: QUESTIONPRAC_TYPES; // ✅ Đảm bảo luôn có type
// };

// export type TMyAnserGroupProps<T> = {
//   value?: TValue<T>;
//   onChange?: (value: TValue<T>) => void;
//   children: (props: {
//     value: T | undefined;
//     onChange: (answer: T) => void;
//   }) => React.ReactNode;
// };

// const MyAnserGroup = <T,>({ value, onChange, children }: TMyAnserGroupProps<T>) => {
//   const { order = 0, point = 0, answer = undefined, type = QUESTIONPRAC_TYPES.multiple_choice } = value ?? {};

//   const onChangeChildren = (newAnswer: T) => {
//     const updatedValue: TValue<T> = {
//       order,
//       point,
//       answer: newAnswer,
//       type, // ✅ Giữ nguyên type
//     };

//     onChange?.(updatedValue);
//   };

//   return (
//     <div className="border flex rounded-base p-3">
//       <div className="flex-1">
//         <div className="flex justify-between">
//           <p className="font-semibold">Câu {order}</p>
//         </div>
//         {children({ value: answer, onChange: onChangeChildren })}
//       </div>
//       <p className="text-gray-500">
//         [
//         <span className="text-pink-500 font-semibold">
//           {numberHandler.limitDigit(point || 0, 3)}
//         </span>
//         ]
//       </p>
//     </div>
//   );
// };

// export default MyAnserGroup;


import { QUESTIONPRAC_TYPES } from "@/types/enum";
import numberHandler from "@/utils/numberHandler";
import React from "react";
import { Select } from "antd";

type TValue<T> = {
  order: number;
  point: number;
  answer: T;
  type: QUESTIONPRAC_TYPES;
};

export type TMyAnserGroupProps<T> = {
  value?: TValue<T>;
  onChange?: (value: TValue<T>) => void;
  children: (props: {
    value: T | undefined;
    onChange: (answer: T) => void;
  }) => React.ReactNode;
};

const MyAnserGroup = <T,>({ value, onChange, children }: TMyAnserGroupProps<T>) => {
  const { order = 0, point = 0, answer = undefined, type = QUESTIONPRAC_TYPES.multiple_choice } = value ?? {};

  // ✅ Xử lý thay đổi loại câu hỏi
  const onChangeType = (newType: QUESTIONPRAC_TYPES) => {
    onChange?.({ order, point, answer: answer as T, type: newType });
  };

  // const onChangeChildren = (newAnswer: T) => {
  //   onChange?.({ order, point, answer: newAnswer, type });
  // };
  const onChangeChildren = (newAnswer: T) => {
    const formattedAnswer: T =
      type === QUESTIONPRAC_TYPES.fill_in_the_blank ? (newAnswer as unknown as T) : (Array.isArray(newAnswer) ? (newAnswer as unknown as T) : ([newAnswer] as unknown as T));
  
    onChange?.({ order, point, answer: formattedAnswer, type });
  };
  return (
    <div className="border flex rounded-base p-3 flex-col">
      <div className="flex justify-between mb-4">
        <p className="font-semibold">Câu {order}</p>
        {/* ✅ Thêm Select ngay đây */}
        <p className="text-gray-500">
        [
        <span className="text-pink-500 font-semibold">
          {numberHandler.limitDigit(point || 0, 3)}
        </span>
        ]
      </p>
      </div>
      <div className="w-full mb-2">
      <Select
          value={type}
          onChange={onChangeType}
          options={[
            { value: QUESTIONPRAC_TYPES.multiple_choice, label: "Chọn nhiều đáp án" },
            { value: QUESTIONPRAC_TYPES.single_choice, label: "Chọn một đáp án" },
            { value: QUESTIONPRAC_TYPES.fill_in_the_blank, label: "Điền vào chỗ trống" },
          ]}
        />
      </div>
      {children({ value: answer, onChange: onChangeChildren })}
    </div>
  );
};

export default MyAnserGroup;
