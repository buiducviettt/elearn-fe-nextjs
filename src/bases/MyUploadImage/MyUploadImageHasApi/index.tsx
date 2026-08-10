import { mediaService } from "@/services/media";
import MyUploadImage, { TMyUploadImageProps } from "..";

type TMyUploadImageHasApiProps = {} & Omit<TMyUploadImageProps, "apiUpload">;
const MyUploadImageHasApi: React.FC<TMyUploadImageHasApiProps> = (props) => {
  const { ...rest } = props;
  return (
    <MyUploadImage
      apiUpload={async (file) => {
        const { source_url } = (await mediaService.post(file)).payload;
        return source_url;
      }}
      {...rest}
    />
  );
};

export default MyUploadImageHasApi;
