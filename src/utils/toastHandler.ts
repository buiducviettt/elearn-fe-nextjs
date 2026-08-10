import { toast } from "sonner";

const toastHandler = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
};

export default toastHandler;
