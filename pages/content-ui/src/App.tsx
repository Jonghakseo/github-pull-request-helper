import { useEffect } from 'react';
import { commitsStorage } from '@extension/storage';
import CommitDrawer from '@src/CommitDrawer';
import { useStorage } from '@extension/shared';
import { toast } from '@extension/ui';
import type { Commit } from '@src/types';
import { copyCommitToClipboard, removeSystemCommits } from '@src/utils';

export default function App({ container }: { container: HTMLElement }) {
  const storage = useStorage(commitsStorage);
  const url = new URL(window.location.href);
  const urlWithoutHash = url.origin + url.pathname;
  const currentCommits = storage[urlWithoutHash];

  useEffect(() => {
    void commitsStorage.deleteExpired();

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
            console.log(payloadCommits);
            const updatedCommits = await commitsStorage.saveCommits(payload.url, payloadCommits);
            updatedCommits.forEach(showCommitCopyToast);
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

  if (!currentCommits) {
    return null;
  }
  return <CommitDrawer commits={currentCommits.commits} container={container} />;
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
