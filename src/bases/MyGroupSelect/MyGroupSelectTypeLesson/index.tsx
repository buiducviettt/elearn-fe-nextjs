import { OBJECT_CREATE_COURSE_TYPE, OBJECT_TYPE_LESSON } from "@/types/common";
import { TYPE_LESSON } from "@/types/enum";
import MyGroupSelect, { TMyGroupSelectProps } from "..";

type TMyGroupSelectTypeLessonProps = {
    excludeTypes?: TYPE_LESSON[];
} & Omit<TMyGroupSelectProps<TYPE_LESSON>, "children">;

const MyGroupSelectTypeLesson: React.FC<TMyGroupSelectTypeLessonProps> = (
    props,
) => {
    const { excludeTypes = [], ...rest } = props;
    const data = Object.values(OBJECT_TYPE_LESSON).filter(
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

export default MyGroupSelectTypeLesson;
