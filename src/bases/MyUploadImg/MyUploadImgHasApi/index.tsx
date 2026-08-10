import { mediaService } from "@/services/media";
import MyUploadImg, { TMyUploadImgProps } from "..";

type MyUploadImgHasApiProps = {} & Omit<TMyUploadImgProps, "apiUpload">;
const MyUploadImgHasApi: React.FC<MyUploadImgHasApiProps> = (props) => {
  const { ...rest } = props;
  return (
    <MyUploadImg
      apiUpload={async (file) => {
        const { source_url } = (await mediaService.post(file)).payload;
        return source_url;
      }}
      {...rest}
    />
  );
};

export default MyUploadImgHasApi;
