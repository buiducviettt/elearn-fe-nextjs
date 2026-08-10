import MyRadioV1, { TMyRadioV1Props } from "@/bases/MyRadioV1";
import MyAnserGroup, { TMyAnserGroupProps } from "..";

type TMyAnswerGroupRadio = {} & Omit<
  TMyAnserGroupProps<TMyRadioV1Props["value"]>,
  "children"
>;
const MyAnswerGroupRadio: React.FC<TMyAnswerGroupRadio> = (props) => {
  return (
    <MyAnserGroup<TMyRadioV1Props["value"]> {...props}>
      {({ onChange, value }) => {
        return (
          <MyRadioV1
            value={value}
            onChange={onChange}
            className="flex mt-1 font-semibold  justify-between"
          >
            <MyRadioV1.Item offActive value={"A"}>
              A
            </MyRadioV1.Item>
            <MyRadioV1.Item offActive value={"B"}>
              B
            </MyRadioV1.Item>
            <MyRadioV1.Item offActive value={"C"}>
              C
            </MyRadioV1.Item>
            <MyRadioV1.Item offActive value={"D"}>
              D
            </MyRadioV1.Item>
          </MyRadioV1>
        );
      }}
    </MyAnserGroup>
  );
};

export default MyAnswerGroupRadio;
