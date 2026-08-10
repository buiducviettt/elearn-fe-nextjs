import { Modal, ModalProps } from "antd";
import React, { Dispatch, SetStateAction } from "react";

export type TMyModalProps = {
    setOpen?: Dispatch<SetStateAction<boolean>>;
} & ModalProps;
const MyModal: React.FC<TMyModalProps> = (props) => {
    const { setOpen, onCancel, styles, destroyOnClose, ...rest } = props;
    return (
        <Modal
            styles={{
                ...styles,
                body: {
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 200px)",
                    ...(styles?.body || {}),
                },
            }}
            centered
            onCancel={(e) => {
                if (typeof setOpen === "function") setOpen(false);
                onCancel?.(e);
            }}
            destroyOnClose={destroyOnClose ?? true}
            {...rest}
        />
    );
};

export default MyModal;
