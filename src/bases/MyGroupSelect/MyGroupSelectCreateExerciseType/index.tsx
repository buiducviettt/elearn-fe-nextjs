import { OBJECT_CREATE_EXERCISE_TYPE } from "@/types/common";
import { CREATE_EXERCISE_TYPE } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";

type TMyGroupSelectCreateExerciseTypeProps = {
  excludeTypes?: CREATE_EXERCISE_TYPE[];
} & Omit<
  TMyGroupSelectProps<CREATE_EXERCISE_TYPE>,
  "children"
>;

const MyGroupSelectCreateExerciseType: React.FC<
  TMyGroupSelectCreateExerciseTypeProps
> = (props) => {
  const { excludeTypes = [], ...rest } = props;
  const data = Object.values(OBJECT_CREATE_EXERCISE_TYPE).filter(
    (item) => !excludeTypes.includes(item.value)
  );

  return (
    <MyGroupSelect color="primary" isEmpty={data.length === 0} {...rest}>
      {data.map((item) => {
        const { value, label } = item;
        return (
          <MyGroupSelect.Item key={value} value={value}>
            {label}
          </MyGroupSelect.Item>
        );
      })}
    </MyGroupSelect>
  );
};

export default MyGroupSelectCreateExerciseType;
