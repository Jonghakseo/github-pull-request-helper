import { toast, ToastContainer } from "react-toastify";
import useUrlChangeEffect from "@pages/content/hooks/useUrlChangeEffect";
import { useRef } from "react";
import { ToastConfigStorageBuilder } from "@src/shared/toast-config-storage";
import isPullRequestPage from "@pages/content/utils/isPullRequestPage";
import { getCommitElements } from "@pages/content/utils/dom";
import {
  Commit,
  getCommitNameAndHref,
  getCommitsUrls,
} from "@pages/content/utils/commit";
import { clipboardCopy } from "@pages/content/utils/clipboard";
import createMarkdownLink from "@pages/content/utils/createMarkdownLink";

export default function App() {
  const prevCommitUrls = useRef<string[]>([]);

  const notify = (commit: Commit) => {
    const toastConfigConfigStorage = ToastConfigStorageBuilder.getStore();
    toast(commit.name, {
      onClick: () => {
        const link = (() => {
          switch (toastConfigConfigStorage.get("copyStyle")) {
            case "commit-name-markdown":
              return createMarkdownLink(commit.name, commit.url);
            case "commit-hash-markdown":
              return createMarkdownLink(commit.hash, commit.url);
            case "just-url":
              return commit.url;
          }
        })();
        void clipboardCopy(link);
      },
      position: toastConfigConfigStorage.get("position"),
      type: toastConfigConfigStorage.get("type"),
      autoClose: toastConfigConfigStorage.get("autoClose"),
      hideProgressBar: toastConfigConfigStorage.get("hideProgressBar"),
      closeOnClick: toastConfigConfigStorage.get("closeOnClick"),
      pauseOnHover: toastConfigConfigStorage.get("pauseOnHover"),
      draggable: toastConfigConfigStorage.get("draggable"),
      theme: toastConfigConfigStorage.get("theme"),
    });
  };

  useUrlChangeEffect((currentUrl) => {
    if (!isPullRequestPage(currentUrl)) {
      return;
    }
    function getCommitList(): Commit[] {
      return getCommitElements().map(getCommitNameAndHref);
    }

    function updateCommitUrls(newCommitUrls: string[]): void {
      prevCommitUrls.current = newCommitUrls;
    }
    function getAdditionalCommits(commitList: Commit[]): Commit[] {
      if (prevCommitUrls.current.length === 0) {
        return [];
      }
      return commitList.filter(
        (commit) => !prevCommitUrls.current.includes(commit.url)
      );
    }

    function init() {
      const commitList: Commit[] = getCommitList();
      updateCommitUrls(getCommitsUrls(commitList));
    }

    // ! initial commit setting
    init();

    const interval = setInterval(() => {
      const commitList: Commit[] = getCommitList();
      const additionalCommits: Commit[] = getAdditionalCommits(commitList);
      updateCommitUrls(getCommitsUrls(commitList));

      if (additionalCommits.length === 0) {
        return;
      }
      additionalCommits.forEach(notify);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  return <ToastContainer />;
}
