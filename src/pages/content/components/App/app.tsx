import { toast, ToastContainer } from "react-toastify";
import useUrlChangeEffect from "@pages/content/hooks/useUrlChangeEffect";
import { useRef } from "react";
import isPullRequestPage from "@pages/content/utils/isPullRequestPage";
import { getCommitElements } from "@pages/content/utils/dom";
import {
  Commit,
  getCommitNameAndHref,
  getCommitsUrls,
} from "@pages/content/utils/commit";
import { clipboardCopy } from "@pages/content/utils/clipboard";
import createMarkdownLink from "@pages/content/utils/createMarkdownLink";
import { ToastConfigStorageBuilder } from "@src/shared/toast-config-storage";

export default function App() {
  const prevCommitUrls = useRef<string[]>([]);

  const notify = async (commit: Commit) => {
    const toastConfigStorage = await ToastConfigStorageBuilder.getStore();
    toast(commit.name, {
      onClick: () => {
        const link = (() => {
          switch (toastConfigStorage.get("copyStyle")) {
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
      position: toastConfigStorage.get("position"),
      type: toastConfigStorage.get("type"),
      autoClose: toastConfigStorage.get("autoClose"),
      hideProgressBar: toastConfigStorage.get("hideProgressBar"),
      closeOnClick: toastConfigStorage.get("closeOnClick"),
      pauseOnHover: toastConfigStorage.get("pauseOnHover"),
      draggable: toastConfigStorage.get("draggable"),
      theme: toastConfigStorage.get("theme"),
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
      toast.dismiss();
      clearInterval(interval);
    };
  });

  return <ToastContainer />;
}
