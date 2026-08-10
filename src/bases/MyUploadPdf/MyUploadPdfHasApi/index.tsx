import { mediaService } from "@/services/media";
import MyUploadPdf, { TMyUploadPdfProps } from "..";

type TMyUploadPdfHasApiProps = {} & Omit<TMyUploadPdfProps, "apiUpload">;
const MyUploadPdfHasApi: React.FC<TMyUploadPdfHasApiProps> = (props) => {
    const { ...rest } = props;
    return (
        <MyUploadPdf
            apiUpload={async (file) => {
                const { source_url } = (await mediaService.post(file)).payload;
                return source_url;
            }}
            {...rest}
        />
    );
};

export default MyUploadPdfHasApi;
