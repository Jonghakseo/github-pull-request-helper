import type { Comment } from '@src/types';
import { memo, useMemo } from 'react';
import { checkIsResolvedComment, clickClosestToggleSummary } from '@src/utils';
import { Button, cn } from '@extension/ui';
import { t } from '@extension/i18n';

function CommentCardPure({ comment }: { comment: Comment }) {
  const isResolved = useMemo(() => checkIsResolvedComment(comment.id), [comment.id]);
  return (
    <div className={cn('flex justify-between p-4 border rounded', isResolved ? 'border-green-500' : 'border-gray-400')}>
      <div className="flex flex-col justify-start w-[230px] gap-2">
        <div className="flex justify-start gap-2">
          <img alt={comment.authorName} className="w-5 h-5 rounded-full" src={comment.authorProfileSrc} />
          <strong>{comment.authorName}</strong>
        </div>
        <span className="text-[#f0f6fc] line-clamp-2">{comment.body}</span>
      </div>
      <Button
        size="sm"
        variant={'default'}
        onClick={() => {
          const target = document.getElementById(comment.id);
          if (target) {
            clickClosestToggleSummary(target);
            const top = Math.ceil(target.getBoundingClientRect().y + window.pageYOffset - window.innerHeight / 3);
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }}>
        {t('CommentCard_go')}
      </Button>
    </div>
  );
}

const CommentCard = memo(CommentCardPure, (prevProps, nextProps) => {
  return prevProps.comment.id === nextProps.comment.id;
});

export default CommentCard;
