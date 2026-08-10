import MyFormItem from "@/bases/MyFormItem";
import MyGroupSelectExamStructure from "@/bases/MyGroupSelect/MyGroupSelectExamStructure";
import MyModalConfirm from "@/bases/MyModal/MyModalConfirm";
import { useWatch } from "antd/es/form/Form";

const QuestionRandomFormItem = ({ form, disableGroupQuestion }) => {
    const questions = useWatch(["question_items"], form);
    const alreadyConfigQuestion = Boolean(questions?.length > 0);

    const renderModalConfirmChangeStructure = ({
        change,
        valueSelected,
        showConfirm,
        setShowConfirm,
    }) => {
        return (
            <MyModalConfirm
                message="Khi chuyển sang loại khác, các câu hỏi đang nhập có thể sai cấu trúc. Bạn có chắc chắn muốn thay đổi loại câu hỏi không?"
                onOk={() => {
                    setShowConfirm(false);
                    // form?.setFieldValue("question_items", []);
                    change(valueSelected);
                }}
                setOpen={setShowConfirm}
                open={showConfirm}
            />
        );
    };

    return (
        <>
            <MyFormItem name="question_type" label="Loại câu hỏi">
                <MyGroupSelectExamStructure
                    modalConfirm={
                        alreadyConfigQuestion
                            ? renderModalConfirmChangeStructure
                            : undefined
                    }
                    disabledGroup={disableGroupQuestion}
                />
            </MyFormItem>
        </>
    );
};

export default QuestionRandomFormItem;
