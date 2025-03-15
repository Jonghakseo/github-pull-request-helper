export default function parseCommits() {
  const timelineBodies = document.querySelectorAll('.TimelineItem.TimelineItem--condensed > .TimelineItem-body');
  const commits = Array.from(timelineBodies).slice(1);

  return commits.map(commit => {
    const codes = commit.querySelectorAll('code');
    if (!codes.length) {
      throw Error('[Pull Request Commit Notify] Code not found');
    }
    const commitMessage = codes[0].textContent?.trim();
    const commitLink = codes[1].querySelector('a')?.href;
    if (!commitLink || !commitMessage) {
      throw Error('[Pull Request Commit Notify] Commit message or link not found');
    }
    return {
      commitMessage,
      commitLink,
    };
  });
}
