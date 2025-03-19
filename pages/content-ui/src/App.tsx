import { useEffect, useRef, useState } from 'react';
import { timelineStorage } from '@extension/storage';
import CommitDrawer from '@src/CommitDrawer';
import { useStorage } from '@extension/shared';
import { toast } from '@extension/ui';
import type { Comment, Commit } from '@src/types';
import { copyCommitToClipboard, getCommentPageYOffset, getCommitPageYOffset, removeSystemCommits } from '@src/utils';
import { t } from '@extension/i18n';

export default function App({ container }: { container: HTMLElement }) {
  const storage = useStorage(timelineStorage);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>();
  const currentTimeline = currentUrl ? storage[currentUrl] : null;
  const sortedCommitsByPositionRef = useRef<Array<Commit & { pageY: number }>>([]);
  const sortedCommentsByPositionRef = useRef<Array<Comment & { pageY: number }>>([]);

  useEffect(() => {
    sortedCommentsByPositionRef.current = makeSortedArrayByPageY(
      (currentTimeline?.comments ?? []).map(addPageYIntoComment),
    );
    sortedCommitsByPositionRef.current = makeSortedArrayByPageY(
      (currentTimeline?.commits ?? []).map(addPageYIntoCommit),
    );
  }, [currentTimeline?.lastUpdatedAt]);

  useEffect(() => {
    async function commitHandler(event: MessageEvent) {
      const message = event.data;
      if (typeof message !== 'string') {
        return;
      }
      try {
        const { type, payload } = JSON.parse(message);
        setCurrentUrl(payload.url);
        switch (type) {
          case 'url-changed': {
            toast.dismiss();
            return;
          }
          case 'timeline': {
            const payloadComments = payload.comments as Comment[];
            const payloadCommits = removeSystemCommits(payload.commits as Commit[]);
            const updatedCommits = await timelineStorage.saveCommits(payload.url, payloadCommits);
            await timelineStorage.saveComments(payload.url, payloadComments);
            const lastCommitPageY = sortedCommitsByPositionRef.current.at(-1)?.pageY ?? 0;
            const updatedCommitsWithPageY = updatedCommits.map(addPageYIntoCommit);
            const updatedCommitsOnlyNew = updatedCommitsWithPageY.filter(
              updatedCommit => lastCommitPageY <= updatedCommit.pageY,
            );
            updatedCommitsOnlyNew.forEach(showCommitCopyToast);
            return;
          }
        }
      } catch {
        // do nothing
      }
    }

    window.addEventListener('message', commitHandler);
    return () => {
      window.removeEventListener('message', commitHandler);
    };
  }, [currentTimeline?.lastUpdatedAt]);

  if (!currentTimeline) {
    return null;
  }

  return (
    <CommitDrawer
      commits={sortedCommitsByPositionRef.current}
      comments={sortedCommentsByPositionRef.current}
      container={container}
    />
  );
}
function showCommitCopyToast(commit: Commit) {
  toast(commit.commitMessage, {
    duration: 1000000,
    action: {
      label: t('toast_copy'),
      onClick: () => copyCommitToClipboard(commit),
    },
    closeButton: true,
  });
}

function addPageYIntoComment(comment: Comment) {
  return {
    ...comment,
    pageY: getCommentPageYOffset(comment),
  };
}

function addPageYIntoCommit(commit: Commit) {
  return {
    ...commit,
    pageY: getCommitPageYOffset(commit),
  };
}

function makeSortedArrayByPageY<T extends { pageY: number }>(array: T[]) {
  return [...array].sort(byPageY);
}

function byPageY(a: { pageY: number }, b: { pageY: number }) {
  return a.pageY - b.pageY;
}
