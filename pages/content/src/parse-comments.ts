export default function parseComments() {
  const comments = Array.from(document.querySelectorAll('.js-comments-holder'));

  const commentIds: string[] = [];

  comments.forEach(comment => {
    const commentChildren = Array.from(comment.children);
    commentChildren.forEach(element => {
      if (element.id.startsWith('discussion_r')) {
        commentIds.push(element.id);
      }
    });
  });

  return commentIds.map(commentId => {
    const comment = document.getElementById(commentId);

    const authorProfileSrc = Array.from(comment?.querySelectorAll('img') ?? [])?.find(img =>
      img.src.startsWith('https://avatars'),
    )?.src;
    const authorName = comment?.querySelector('strong')?.textContent?.trim();
    const body = comment?.querySelector('.comment-body')?.textContent?.trim().slice(0, 100) ?? '-';
    if (!authorName || !authorProfileSrc) {
      throw Error('[Pull Request Commit Notify] Comment is not valid');
    }

    return {
      id: commentId,
      authorName,
      authorProfileSrc,
      body,
    };
  });
}
