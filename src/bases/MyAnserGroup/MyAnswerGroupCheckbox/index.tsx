import MyCheckboxGroup, {
  TMyCheckboxGroupProps,
} from "@/bases/MyCheckboxGroup";
import MyAnserGroup, { TMyAnserGroupProps } from "..";

type TMyAnswerGroupCheckbox = {} & Omit<
  TMyAnserGroupProps<TMyCheckboxGroupProps["value"]>,
  "children"
>;
const MyAnswerGroupCheckbox: React.FC<TMyAnswerGroupCheckbox> = (props) => {
  return (
    <MyAnserGroup<TMyCheckboxGroupProps["value"]> {...props}>
      {({ onChange, value }) => {
        return (
          <MyCheckboxGroup
            // displayDynamic
            value={value}
            onChange={onChange}
            className="flex mt-1 font-semibold  justify-between"
          >
            <MyCheckboxGroup.Item offActive value={"A"}>
              A
            </MyCheckboxGroup.Item>
            <MyCheckboxGroup.Item offActive value={"B"}>
              B
            </MyCheckboxGroup.Item>
            <MyCheckboxGroup.Item offActive value={"C"}>
              C
            </MyCheckboxGroup.Item>
            <MyCheckboxGroup.Item offActive value={"D"}>
              D
            </MyCheckboxGroup.Item>
          </MyCheckboxGroup>
        );
      }}
    </MyAnserGroup>
  );
};

export default MyAnswerGroupCheckbox;
