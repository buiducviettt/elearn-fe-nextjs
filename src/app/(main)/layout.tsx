import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import MainLayout from "@/layouts/MainLayout";
import styles from './styles.module.scss';


type TProps = {
  children: React.ReactNode;
};
const layout = async ({ children }: TProps) => {
  return (
    <AuthenticationLayout>
      <MainLayout>{children}</MainLayout>
    </AuthenticationLayout>
  );
};

export default layout;
