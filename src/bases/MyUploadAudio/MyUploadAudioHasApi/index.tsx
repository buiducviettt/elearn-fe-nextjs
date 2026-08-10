import { mediaService } from "@/services/media";
import MyUploadAudio, { TMyUploadAudioProps } from "..";

type TMyUploadAudioHasApiProps = {} & Omit<TMyUploadAudioProps, "apiUpload">;
const MyUploadAudioHasApi: React.FC<TMyUploadAudioHasApiProps> = (props) => {
  const { ...rest } = props;
  return (
    <MyUploadAudio
      apiUpload={async (file) => {
        const { source_url } = (await mediaService.post(file)).payload;
        return source_url;
      }}
      {...rest}
    />
  );
};

export default MyUploadAudioHasApi;
