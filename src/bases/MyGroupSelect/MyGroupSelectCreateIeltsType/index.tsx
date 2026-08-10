import { OBJECT_CREATE_IELTS_TYPE } from "@/types/common";
import { CREATE_IELTS_TYPE } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";

type TMyGroupSelectCreateIeltsTypeProps = {
  excludeTypes?: CREATE_IELTS_TYPE[];
} & Omit<
  TMyGroupSelectProps<CREATE_IELTS_TYPE>,
  "children"
>;

const MyGroupSelectCreateIeltsType: React.FC<
  TMyGroupSelectCreateIeltsTypeProps
> = (props) => {
  const { excludeTypes = [], ...rest } = props;
  const data = Object.values(OBJECT_CREATE_IELTS_TYPE).filter(
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

export default MyGroupSelectCreateIeltsType;
