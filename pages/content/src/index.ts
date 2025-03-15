import parseCommits from '@src/parse-commits';
import { isGithubPullRequestPage, whenUrlChanges } from '@src/event-handler';

whenUrlChanges(url => {
  if (!isGithubPullRequestPage(url)) {
    return;
  }
  const interval = setInterval(() => {
    const commits = parseCommits();
  }, 2000);

  return () => {
    window.clearInterval(interval);
  };
});
