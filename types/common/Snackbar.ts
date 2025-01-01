import type { VSnackbar } from "vuetify/components";

export interface Snackbar {
  isShow: boolean;
  message: string;
  location: NonNullable<InstanceType<typeof VSnackbar>["$props"]["location"]>;
  color: string;
}
