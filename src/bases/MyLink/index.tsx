import Link, { LinkProps } from "next/link";
type TMyLinkProps = {
  children?: React.ReactNode;
} & LinkProps;
const MyLink: React.FC<TMyLinkProps> = (props) => {
  const { children, ...rest } = props;

  return <Link {...rest}>{children}</Link>;
};

export default MyLink;
