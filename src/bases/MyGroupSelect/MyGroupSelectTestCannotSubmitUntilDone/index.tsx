import { OBJECT_TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL } from "@/types/common";
import { TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";
type TMyGroupSelectTestCannotSubmitUntilDoneProps = {} & Omit<
  TMyGroupSelectProps<TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL>,
  "children"
>;
const MyGroupSelectTestCannotSubmitUntilDone: React.FC<
  TMyGroupSelectTestCannotSubmitUntilDoneProps
> = (props) => {
  const { ...rest } = props;
  const data = Object.values(OBJECT_TEST_CANNOT_SUBMIT_UNTIL_DONE_ALL);

  return (
    <MyGroupSelect isEmpty={data.length === 0} {...rest}>
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

export default MyGroupSelectTestCannotSubmitUntilDone;
