import { OBJECT_CREATE_COURSE_TYPE } from "@/types/common";
import { CREATE_COURSE_TYPE } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";

type TMyGroupSelectCreateCourseTypeProps = {
    excludeTypes?: CREATE_COURSE_TYPE[];
} & Omit<TMyGroupSelectProps<CREATE_COURSE_TYPE>, "children">;

const MyGroupSelectCreateCourseType: React.FC<
    TMyGroupSelectCreateCourseTypeProps
> = (props) => {
    const { excludeTypes = [], ...rest } = props;
    const data = Object.values(OBJECT_CREATE_COURSE_TYPE).filter(
        (item) => !excludeTypes.includes(item.value),
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

export default MyGroupSelectCreateCourseType;
