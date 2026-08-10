import MyCheckbox, { TMyCheckboxProps } from "..";
import styles from "./styles.module.scss";

type TMyCheckboxLargeProps = {} & TMyCheckboxProps;

const MyCheckboxLarge: React.FC<TMyCheckboxLargeProps> = (props) => {
    const { ...rest } = props;
    return <MyCheckbox className={styles.root} {...rest} />;
};

export default MyCheckboxLarge;
