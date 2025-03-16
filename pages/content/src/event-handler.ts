import { detectPureUrl } from '@src/detect-pure-url';

type CleanupCallback = (() => void) | undefined;

export function whenUrlChanges(callback: (url: string) => CleanupCallback) {
  let currentUrl = detectPureUrl();
  // trigger once on start
  let cleanup = callback(currentUrl);

  // check every second
  setInterval(() => {
    const newUrl = detectPureUrl();
    if (newUrl !== currentUrl) {
      cleanup?.();
      currentUrl = newUrl;
      cleanup = callback(newUrl);
    }
  }, 1000);
}

export function isGithubPullRequestPage(targetUrl: string) {
  const url = new URL(targetUrl);
  if (url.origin !== 'https://github.com') {
    return false;
  }
  if (!url.pathname.includes('/pull/')) {
    return false;
  }
  const prNumber = url.pathname.split('/').pop();
  if (!prNumber) {
    return false;
  }
  if (!/^\d+$/.test(prNumber)) {
    return false;
  }
  return true;
}
