import { mediaService } from "@/services/media";
import MyUploadMultipleType, { TMyUploadMultipleTypeProps } from "..";

type TMyUploadMultipleTypeHasApiProps = {} & Omit<
  TMyUploadMultipleTypeProps,
  "apiUpload"
>;
const MyUploadMultipleTypeHasApi: React.FC<TMyUploadMultipleTypeHasApiProps> = (
  props,
) => {
  const { ...rest } = props;
  return (
    <MyUploadMultipleType
      apiUpload={async (file) => {
        const { source_url } = (await mediaService.post(file)).payload;
        return source_url;
      }}
      {...rest}
    />
  );
};

export default MyUploadMultipleTypeHasApi;
