import Image, { ImageProps } from "next/image";

type TMyImageProps = {} & ImageProps;
const MyImage: React.FC<TMyImageProps> = (props) => {
  const { alt, ...rest } = props;

  return <Image alt={alt || `insert_meaningful_content_later `} {...rest} />;
};

export default MyImage;
