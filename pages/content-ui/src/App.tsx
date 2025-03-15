import { useEffect } from 'react';
import { timelineStorage } from '@extension/storage';
import CommitDrawer from '@src/CommitDrawer';
import { useStorage } from '@extension/shared';
import { toast } from '@extension/ui';
import type { Commit, Comment } from '@src/types';
import { copyCommitToClipboard, removeSystemCommits } from '@src/utils';

export default function App({ container }: { container: HTMLElement }) {
  const storage = useStorage(timelineStorage);
  const url = new URL(window.location.href);
  const urlWithoutHash = url.origin + url.pathname;
  const currentTimeline = storage[urlWithoutHash];

  useEffect(() => {
    void timelineStorage.deleteExpired();

    async function commitHandler(event: MessageEvent) {
      const message = event.data;
      if (typeof message !== 'string') {
        return;
      }
      try {
        const { type, payload } = JSON.parse(message);
        switch (type) {
          case 'remove-all-commit-toasts': {
            toast.dismiss();
            return;
          }
          case 'commits': {
            const payloadCommits = removeSystemCommits(payload.commits as Commit[]);
            const updatedCommits = await timelineStorage.saveCommits(payload.url, payloadCommits);
            updatedCommits.forEach(showCommitCopyToast);
            return;
          }
          case 'comments': {
            const payloadComments = payload.comments as Comment[];
            await timelineStorage.saveComments(payload.url, payloadComments);
            // do nothing
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
  }, []);

  if (!currentTimeline) {
    return null;
  }
  return (
    <CommitDrawer commits={currentTimeline.commits} comments={currentTimeline.comments ?? []} container={container} />
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
