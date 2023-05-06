export const getCommitElements = (): Element[] => {
  const timelineElements = document.querySelectorAll(
    ".TimelineItem.TimelineItem--condensed"
  );
  if (timelineElements.length === 0) {
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prDescription, ...commitList] = Array.from(timelineElements);
  return commitList;
};
