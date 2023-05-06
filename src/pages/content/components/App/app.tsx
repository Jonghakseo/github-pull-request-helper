import { toast, ToastContainer } from "react-toastify";
import useUrlChangeEffect from "@pages/content/hooks/useUrlChangeEffect";
import { useRef } from "react";

type Commit = { name: string; url: string };

export default function App() {
  const prevCommitUrls = useRef<Commit["url"][]>([]);

  const notify = (info: Commit) =>
    toast(info.name, {
      onClick: () => clipboardCopy(createMarkdownLink(info)),
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  useUrlChangeEffect((currentUrl) => {
    if (!isPRPage(currentUrl)) {
      return;
    }
    const getCommitList = () => getCommitElements().map(getCommitNameAndHref);
    const updateCommitUrls = (newCommitUrls: string[]) => {
      prevCommitUrls.current = newCommitUrls;
    };
    const getAdditionalCommits = (commitList: Commit[]) =>
      commitList.filter(({ url }) => !prevCommitUrls.current.includes(url));

    function init() {
      const commitList = getCommitList();
      updateCommitUrls(commitList.map(({ url }) => url));
    }

    init();

    const interval = setInterval(() => {
      const commitList = getCommitList();
      const additionalCommits = getAdditionalCommits(commitList);
      updateCommitUrls(commitList.map(({ url }) => url));

      if (additionalCommits.length === 0) {
        return;
      }
      additionalCommits.forEach(notify);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return <ToastContainer />;
}

const PR_PAGE_REGEX = new RegExp(
  "https://github.com/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)/pull/(\\d+)"
);

const isPRPage = (url: string) => PR_PAGE_REGEX.test(url);

const getCommitElements = (): Element[] => {
  const timelineElements = document.querySelectorAll(
    ".TimelineItem.TimelineItem--condensed"
  );
  if (timelineElements.length === 0) {
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prDescription, ...commitList] = Array.from(timelineElements);
  return commitList;
};

const getCommitNameAndHref = (
  commitElement: Element
): { name: string; url: string } => {
  const name = commitElement.querySelector("a").title;
  const url = commitElement.querySelector("a").href;
  return { name, url };
};

const createMarkdownLink = ({ name, url }: Commit) => {
  return `[${name}](${url})`;
};

const clipboardCopy = (text: string) => {
  return window.navigator.clipboard.writeText(text);
};
