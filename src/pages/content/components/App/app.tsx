import { ToastContainer, toast } from "react-toastify";
import useUrlChangeEffect from "@pages/content/components/hooks/useUrlChangeEffect";

export default function App() {
  const notify = () =>
    toast("PR page!", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  useUrlChangeEffect((currentUrl) => {
    if (!isPRPage(currentUrl)) {
      return;
    }
    notify();
  });

  return <ToastContainer />;
}

const PR_PAGE_REGEX = new RegExp(
  "https://github.com/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)/pull/(\\d+)"
);

const isPRPage = (url: string) => PR_PAGE_REGEX.test(url);
