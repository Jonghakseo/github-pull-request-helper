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

export function checkIsResolvedComment(id: string) {
  const commentElement = document.getElementById(id);
  const closestDetails = commentElement?.closest('details');
  // data-resolved
  return closestDetails?.dataset['resolved'] === 'true';
}

export function clickClosestToggleSummary(startElement: HTMLElement) {
  const closestDetails = startElement.closest('details');
  const summary = closestDetails?.querySelector('summary');
  if (!summary || summary.ariaExpanded === 'true') {
    return;
  }
  summary?.click();
}

export function getCommitPageYOffset({ commitLink }: { commitLink: string }) {
  const origin = window.location.origin;
  const relativeCommitLink = commitLink.replace(origin, '');
  const commit = document.querySelector(`code > a[href*="${relativeCommitLink}"]`);
  if (!commit) {
    return 0;
  }
  return commit.getBoundingClientRect().top + window.pageYOffset;
}

export function getCommentPageYOffset({ id }: { id: string }) {
  const comment = document.getElementById(id);
  if (!comment) {
    return 0;
  }
  return comment.getBoundingClientRect().top + window.pageYOffset;
}
