export type Commit = { name: string; url: string; hash: string };
export const getCommitNameAndHref = (commitElement: Element): Commit => {
  const name = commitElement.querySelector("a")?.title ?? "";
  const url = commitElement.querySelector("a")?.href ?? "";
  const hash = commitElement.querySelectorAll("a")[1].textContent ?? "";
  return { name, hash, url };
};

export const getCommitsUrls = (commits: Commit[]): string[] => {
  return commits.map((commit) => commit.url);
};
