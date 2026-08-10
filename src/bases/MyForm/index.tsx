import { Form, FormProps } from "antd";

export type TMyFormProps<T extends object = any> = FormProps<T>;

const MyForm = <T extends object>(props: TMyFormProps<T>) => {
    const { children, ...rest } = props;
    return (
        <Form<T> scrollToFirstError layout="vertical" size="middle" {...rest}>
            {children as any}
        </Form>
    );
};

export default MyForm;
