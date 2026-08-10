import MyRadioV1, { TMyRadioV1Props } from "@/bases/MyRadioV1";
import MyAnserGroup, { TMyAnserGroupProps } from "..";

type MyAnswerGroupRadioV2 = {} & Omit<
  TMyAnserGroupProps<TMyRadioV1Props["value"]>,
  "children"
>;

const MyAnswerGroupRadioV2: React.FC<MyAnswerGroupRadioV2> = (props) => {
  return (
    <MyAnserGroup<TMyRadioV1Props["value"]> {...props}>
      {({ onChange, value }) => {
        // ⚠️ Nếu `value` là mảng (do cách xử lý chung), ta lấy phần tử đầu tiên
        const fixedValue = Array.isArray(value) ? value[0] || "" : value;

        return (
          <MyRadioV1
            value={fixedValue} // Đảm bảo là string
            onChange={(newValue) => onChange?.(newValue)} // Trả về string
            className="flex mt-1 font-semibold justify-between"
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

export default MyAnswerGroupRadioV2;
