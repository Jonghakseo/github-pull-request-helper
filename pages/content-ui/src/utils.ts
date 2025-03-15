import type { Commit } from '@src/types';

export function copyCommitToClipboard(commit: Commit) {
  const message = `[${commit.commitMessage}](${commit.commitLink})`;
  navigator.clipboard.writeText(message);
}

export function removeSystemCommits(commits: Commit[]) {
  return commits.filter(commit => {
    return !checkIsSystemCommit(commit.commitMessage);
  });
}

function checkIsSystemCommit(message: string) {
  return (
    message.startsWith('Merge pull request') || message.startsWith('Merge branch ') || message.startsWith('Revert ')
  );
}
