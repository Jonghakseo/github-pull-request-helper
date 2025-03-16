import { useEffect, useRef, useState } from 'react';
import { timelineStorage } from '@extension/storage';
import CommitDrawer from '@src/CommitDrawer';
import { useStorage } from '@extension/shared';
import { toast } from '@extension/ui';
import type { Comment, Commit } from '@src/types';
import { copyCommitToClipboard, removeSystemCommits } from '@src/utils';

export default function App({ container }: { container: HTMLElement }) {
  const storage = useStorage(timelineStorage);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>();
  const currentTimeline = currentUrl ? storage[currentUrl] : null;
  const lastCommitPositionRef = useRef<number>(0);

  useEffect(() => {
    if (!currentTimeline?.commits?.length) {
      lastCommitPositionRef.current = 0;
      return;
    }
    if (currentTimeline.commits.length > 0) {
      lastCommitPositionRef.current = Math.max(...currentTimeline.commits.map(getCommitPageYOffset));
    }
  }, [currentTimeline?.commits?.length]);

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
            const updatedCommitsOnlyNew = updatedCommits.filter(
              updatedCommit => lastCommitPositionRef.current < getCommitPageYOffset(updatedCommit),
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
      commits={currentTimeline.commits ?? []}
      comments={currentTimeline.comments ?? []}
      container={container}
    />
  );
}
function showCommitCopyToast(commit: Commit) {
  toast(commit.commitMessage, {
    duration: 1000000,
    action: {
      label: 'Copy',
      onClick: () => copyCommitToClipboard(commit),
    },
    closeButton: true,
  });
}
function getCommitPageYOffset({ commitLink }: { commitLink: string }) {
  const origin = window.location.origin;
  const relativeCommitLink = commitLink.replace(origin, '');
  const commit = document.querySelector(`code > a[href*="${relativeCommitLink}"]`);
  if (!commit) {
    return 0;
  }
  return commit.getBoundingClientRect().top + window.pageYOffset;
}
