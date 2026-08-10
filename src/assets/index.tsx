import MyImage from "@/bases/MyImage";
import styles from "./styles.module.scss";
import Link from "next/link";

export { default as ImageCameleon } from "./images/cameleon.avif";

export const RadioIcon = () => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
                fill="#2563EB"
            />
            <circle cx="10" cy="10" r="5" fill="white" />
        </svg>
    );
};

export const UnCheckedRadioIcon = () => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5C15.2467 0.5 19.5 4.7533 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.7533 19.5 0.5 15.2467 0.5 10Z"
                stroke="#B1BAC8"
            />
        </svg>
    );
};

export const LOGO_URL = "/wp-elearn/logo/media-logo.png";

export const Logo = () => (
    <div className={`${styles["hd-logo"]}`}>
        <Link href="WP_DOMAIN" rel="noopener noreferrer">
            <MyImage
                alt="Logo bộ đề Thi"
                style={{
                    objectFit: "contain",
                }}
                width={250}
                height={120}
                src={LOGO_URL}
            />
        </Link>
    </div>
);
