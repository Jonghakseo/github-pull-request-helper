import { type ToastOptions } from "react-toastify";

export type ToastConfig = {
  copyStyle: "commit-name-markdown" | "commit-hash-markdown" | "just-url";
} & Required<
  Pick<
    ToastOptions,
    | "position"
    | "type"
    | "delay"
    | "draggable"
    | "autoClose"
    | "pauseOnFocusLoss"
    | "pauseOnHover"
    | "closeOnClick"
    | "theme"
    | "hideProgressBar"
  >
>;

export const defaultToastConfig: ToastConfig = {
  position: "top-right",
  type: "info",
  delay: 0,
  draggable: true,
  autoClose: false,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "colored",
  copyStyle: "commit-name-markdown",
};
