import type { Snackbar } from "@/types/common/Snackbar";
import type { VSnackbar } from "vuetify/components";

export const useSnackbar = () => {
  const snackbar = useState<Snackbar>("snackbar", () => {
    return {
      isShow: false,
      message: "",
      color: "",
      location: "top",
    };
  });

  const showSnackbar = (
    message: string,
    color: "success" | "primary" | "info" | "warning" | "error",
    location: NonNullable<
      InstanceType<typeof VSnackbar>["$props"]["location"]
    > = "top"
  ) => {
    snackbar.value.message = message;
    snackbar.value.color = color;
    snackbar.value.location = location;
    snackbar.value.isShow = true;
  };

  return {
    snackbar,
    showSnackbar,
  };
};
