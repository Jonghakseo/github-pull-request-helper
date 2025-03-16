import { Button } from '@extension/ui';
import { copyCommitToClipboard } from '@src/utils';
import { memo, useState } from 'react';
import type { Commit } from '@src/types';
import { t } from '@extension/i18n';

type CommitCardProps = {
  commit: Commit;
};

function CommitCardPure({ commit }: CommitCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="flex justify-between p-4 border border-gray-400 rounded" key={commit.id}>
      <a
        className="w-[200px] text-[#f0f6fc] line-clamp-2 underline"
        href={commit.commitLink}
        target="_blank"
        rel="noreferrer">
        {commit.commitMessage}
      </a>
      <Button
        size="sm"
        variant={isCopied ? 'secondary' : 'default'}
        onClick={() => {
          copyCommitToClipboard(commit);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        }}>
        {isCopied ? t('CommitCard_copied') : t('CommitCard_copy')}
      </Button>
    </div>
  );
}

const CommitCard = memo(CommitCardPure, (prevProps, nextProps) => {
  if (prevProps.commit.id !== nextProps.commit.id) {
    return false;
  }
  return true;
});

export default CommitCard;
