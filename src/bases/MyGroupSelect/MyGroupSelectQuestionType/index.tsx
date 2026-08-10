import { OBJECT_QUESTION_TYPES } from "@/types/common";
import { QUESTION_TYPES } from "@/types/enum";
import { useMemo } from "react";
import MyGroupSelect, { TMyGroupSelectProps } from "..";

type TMyGroupSelectQuestionTypeProps = {
  modalConfirm?: (params: {
    change: (value: string) => void;
    setShowConfirm: (value: boolean) => void;
    showConfirm: boolean;
    valueCurrent: TMyGroupSelectProps["value"];
    valueSelected: TMyGroupSelectProps["value"];
    object: typeof OBJECT_QUESTION_TYPES;
  }) => React.ReactNode;
  disabledOptions?: QUESTION_TYPES[];
} & Omit<TMyGroupSelectProps, "modalConfirm">;

const MyGroupSelectQuestionType: React.FC<TMyGroupSelectQuestionTypeProps> = (
  props,
) => {
  const { onChange, modalConfirm, disabledOptions = [], ...rest } = props;
  const options = useMemo(() => 
    Object.values(OBJECT_QUESTION_TYPES).filter(
      item => !disabledOptions.includes(item.value as QUESTION_TYPES)
    ), 
    [disabledOptions]
  );

  const renderModalConfirm = ({
    change,
    setShowConfirm,
    showConfirm,
    valueCurrent,
    valueSelected,
  }) => {
    return modalConfirm?.({
      change,
      setShowConfirm,
      showConfirm,
      valueCurrent,
      valueSelected,
      object: OBJECT_QUESTION_TYPES,
    });
  };

  return (
    <>
      <MyGroupSelect
        onChange={(value) => {
          onChange?.(value);
        }}
        modalConfirm={modalConfirm ? renderModalConfirm : undefined}
        {...rest}
      >
        {options.map((item) => {
          const { label, value } = item;
          return (
            <MyGroupSelect.Item 
              className="min-w-40" 
              value={value} 
              key={value}
            >
              {label}
            </MyGroupSelect.Item>
          );
        })}
      </MyGroupSelect>
    </>
  );
};

export default MyGroupSelectQuestionType;
