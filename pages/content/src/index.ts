import parseCommits from '@src/parse-commits';
import { isGithubPullRequestPage, whenUrlChanges } from '@src/event-handler';

whenUrlChanges(url => {
  sendMessage({ type: 'remove-all-commit-toasts' });
  if (!isGithubPullRequestPage(url)) {
    return;
  }
  const interval = setInterval(() => {
    const commits = parseCommits();
    sendMessage({ type: 'commits', payload: { url, commits } });
  }, 2000);

  return () => {
    window.clearInterval(interval);
  };
});

type Message =
  | {
      type: 'commits';
      payload: {
        url: string;
        commits: Array<{
          id: string;
          commitMessage: string;
          commitLink: string;
        }>;
      };
    }
  | {
      type: 'remove-all-commit-toasts';
    };

function sendMessage(message: Message) {
  const stringifyMessage = JSON.stringify(message);
  window.postMessage(stringifyMessage, '*');
}
