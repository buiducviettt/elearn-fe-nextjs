"use client";
import MyButton from "@/bases/MyButton";
import MyForm from "@/bases/MyForm";
import MyFormItem from "@/bases/MyFormItem";
import MyInput from "@/bases/MyInput";
import MyPassword from "@/bases/MyPassword";
import { formRequired, URL_HOME } from "@/constants/common";
import useUser from "@/global-state/useUser";
import { setToken } from "@/services/http";
import { userLoginService } from "@/services/login";
import toastHandler from "@/utils/toastHandler";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginForm = () => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // login to get token
            const res = (await userLoginService.post(values)).payload;

            const { token, user, logout_url } = res.data;
            setUser({
                token: token,
                id: Number(user.data.ID),
                urlLogout: logout_url,
                user_email: user.data.user_email,
                user_nicename: user.data.user_nicename,
            });
            setToken(token);
            toastHandler.success("Đăng nhập thành công");
            router.replace(URL_HOME);
        } catch (error: any) {
            toastHandler.error(error?.payload?.message || "Đăng nhập thất bại");
        }
        setLoading(false);
    };

    // useEffect(() => {
    //     form.setFieldsValue({
    //         userLogin: "monamedia",
    //         userPassword: "realdev@123",
    //     });
    // }, [form]);

    return (
        <div className="flex flex-col gap-4">
            <MyForm form={form} onFinish={onFinish}>
                <MyFormItem
                    name="userLogin"
                    rules={[formRequired]}
                    label="Tài khoản"
                >
                    <MyInput size="large" placeholder="Nhập tài khoản" />
                </MyFormItem>

                <MyFormItem
                    name="userPassword"
                    rules={[formRequired]}
                    label="Mật khẩu"
                >
                    <MyPassword size="large" placeholder="Nhập mật khẩu" />
                </MyFormItem>

                <MyButton
                    loading={loading}
                    onClick={form.submit}
                    block
                    type="primary"
                >
                    Đăng nhập
                </MyButton>
            </MyForm>
        </div>
    );
};

export default LoginForm;
