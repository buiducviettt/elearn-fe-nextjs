import { mediaService } from "@/services/media";
import MyUploadAudioVideo, { TMyUploadAudioVideoProps } from "..";

type TMyUploadAudioVideoHasApiProps = {} & Omit<TMyUploadAudioVideoProps, "apiUpload">;
const MyUploadAudioVideoHasApi: React.FC<TMyUploadAudioVideoHasApiProps> = (props) => {
  const { ...rest } = props;
  return (
    <MyUploadAudioVideo
      apiUpload={async (file) => {
        const { source_url } = (await mediaService.post(file)).payload;
        return source_url;
      }}
      {...rest}
    />
  );
};

export default MyUploadAudioVideoHasApi;
