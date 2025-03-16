import parseCommits from '@src/parse-commits';
import { isGithubPullRequestPage, whenUrlChanges } from '@src/event-handler';
import parseComments from '@src/parse-comments';

whenUrlChanges(url => {
  sendMessage({ type: 'not-in-pull-request', payload: { url } });
  if (!isGithubPullRequestPage(url)) {
    return;
  }

  const timeout = setTimeout(() => {
    sendMessage({ type: 'commits', payload: { url, commits: parseCommits() } });
  }, 1000);

  const interval = setInterval(() => {
    sendMessage({ type: 'commits', payload: { url, commits: parseCommits() } });
    sendMessage({ type: 'comments', payload: { url, comments: parseComments() } });
  }, 3000);

  return () => {
    window.clearTimeout(timeout);
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
      type: 'comments';
      payload: {
        url: string;
        comments: Array<{
          id: string;
          authorName: string;
          authorProfileSrc: string;
          body: string;
        }>;
      };
    }
  | {
      type: 'not-in-pull-request';
      payload: {
        url: string;
      };
    };

function sendMessage(message: Message) {
  const stringifyMessage = JSON.stringify(message);
  window.postMessage(stringifyMessage, '*');
}
