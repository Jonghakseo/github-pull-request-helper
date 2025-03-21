import parseCommits from '@src/parse-commits';
import { isGithubPullRequestPage, whenUrlChanges } from '@src/event-handler';
import parseComments from '@src/parse-comments';
import loadCollapsedComments from '@src/load-collapsed-comments';

whenUrlChanges(url => {
  sendMessage({ type: 'url-changed', payload: { url } });
  if (!isGithubPullRequestPage(url)) {
    return;
  }

  let isLoaded = false;

  const initTimeout = setTimeout(() => {
    loadCollapsedComments();
    const commits = parseCommits();
    const comments = parseComments();
    if (!comments.length && !commits.length) {
      return;
    }
    sendMessage({ type: 'timeline', payload: { url, commits: parseCommits(), comments: parseComments() } });
    isLoaded = true;
    find();
  }, 500);

  let findInterval: ReturnType<typeof window.setTimeout>;

  function find() {
    findInterval = setTimeout(() => {
      if (!isLoaded) {
        return;
      }
      loadCollapsedComments();
      sendMessage({ type: 'timeline', payload: { url, commits: parseCommits(), comments: parseComments() } });
      find();
    }, 5000);
  }

  return () => {
    if (!isLoaded) {
      window.clearTimeout(initTimeout);
    }
    window.clearTimeout(findInterval);
  };
});

type Message =
  | {
      type: 'timeline';
      payload: {
        url: string;
        commits: Array<{
          id: string;
          commitMessage: string;
          commitLink: string;
        }>;
        comments: Array<{
          id: string;
          authorName: string;
          authorProfileSrc: string;
          body: string;
        }>;
      };
    }
  | {
      type: 'url-changed';
      payload: {
        url: string;
      };
    };

function sendMessage(message: Message) {
  const stringifyMessage = JSON.stringify(message);
  window.postMessage(stringifyMessage, '*');
}
