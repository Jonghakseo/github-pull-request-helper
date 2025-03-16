export default function parseCommits() {
  const timelineBodies = document.querySelectorAll('.TimelineItem.TimelineItem--condensed > .TimelineItem-body');
  const commits = Array.from(timelineBodies).slice(1);

  return commits.map(commit => {
    const codes = Array.from(commit.querySelectorAll('code'));
    if (!codes.length) {
      throw Error('[Pull Request Commit Notify] Code not found');
      // return;
    }
    const commitMessage = codes.at(0)?.textContent?.trim();
    const commitLink = codes.at(-1)?.querySelector('a')?.href;
    const commitSha = commitLink?.split('/').pop();
    if (!commitLink || !commitMessage || !commitSha) {
      throw Error('[Pull Request Commit Notify] Commit message is not valid');
      // return;
    }
    return {
      id: commitSha,
      commitMessage,
      commitLink,
    };
  });
}
