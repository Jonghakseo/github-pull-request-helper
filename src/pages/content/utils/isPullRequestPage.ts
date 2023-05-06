const GITHUB_PULL_REQUEST_PAGE_REGEX = new RegExp(
  "https://github.com/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)/pull/(\\d+)"
);

export default function isPullRequestPage(url: string) {
  return GITHUB_PULL_REQUEST_PAGE_REGEX.test(url);
}
