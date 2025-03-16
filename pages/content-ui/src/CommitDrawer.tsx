import {
  Button,
  cn,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@extension/ui';
import { checkIsResolvedComment } from '@src/utils';
import { memo, useEffect, useMemo, useState } from 'react';
import type { Commit, Comment } from '@src/types';
import CommentCard from '@src/CommentCard';
import CommitCard from '@src/CommitCard';
import { t } from '@extension/i18n';

enum TabKeys {
  Commits = 'commits',
  Comments = 'comments',
}

type CommitDrawerProps = {
  commits: Commit[];
  comments: Comment[];
  container: HTMLElement;
};

function CommitDrawerPure({ commits, comments, container }: CommitDrawerProps) {
  const [open, setOpen] = useState(false);
  const [showOnlyUnResolved, setShowOnlyUnResolved] = useState(false);
  const [tabKey, setTabKey] = useState<TabKeys>(TabKeys.Commits);

  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);
  const toggleSheet = () => setOpen(prev => !prev);

  const hasCommitsOrComments = commits.length > 0 || comments.length > 0;

  useEffect(() => {
    function openSheetByKeyEvent(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection()?.toString()) {
        toggleSheet();
      }
    }

    window.addEventListener('keydown', openSheetByKeyEvent);

    return () => {
      window.removeEventListener('keydown', openSheetByKeyEvent);
    };
  }, []);

  const shownComments = useMemo(() => {
    return showOnlyUnResolved ? comments.filter(comment => !checkIsResolvedComment(comment.id)) : comments;
  }, [showOnlyUnResolved, comments]);

  return (
    <>
      <Sheet modal={false} open={open}>
        <SheetTrigger asChild>
          <Button
            onClick={openSheet}
            size="default"
            variant="secondary"
            className={cn(
              hasCommitsOrComments ? 'block' : 'hidden',
              'pointer-events-auto absolute right-[-4px] top-1/2 transform -translate-y-1/2 pl-2',
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent
          onEscapeKeyDown={closeSheet}
          onClickClose={closeSheet}
          container={container}
          className={'pointer-events-auto bg-[#0d1117] border-[#3d444db3]'}>
          <SheetHeader>
            <SheetTitle className="text-amber-50">{t('CommitDrawer_title')}</SheetTitle>
            <span>
              <kbd>Cmd(Ctrl) + c</kbd> {t('CommitDrawer_toToggleDrawer')}
            </span>
            <Tabs value={tabKey}>
              <TabsList className="grid w-full grid-cols-2 mt-2 mb-4">
                <TabsTrigger
                  disabled={!commits.length}
                  onClick={() => setTabKey(TabKeys.Commits)}
                  value={TabKeys.Commits}>
                  {t('CommitDrawer_userCommits')} ({commits.length})
                </TabsTrigger>
                <TabsTrigger
                  disabled={!comments.length}
                  onClick={() => setTabKey(TabKeys.Comments)}
                  value={TabKeys.Comments}>
                  {t('CommitDrawer_comments')} ({comments.length})
                </TabsTrigger>
              </TabsList>
              <SheetDescription>
                <TabsContent value={TabKeys.Commits}>
                  <span>{t('CommitDrawer_cantSeeHiddenCommits')}</span>
                  <div className="flex flex-col gap-4 mt-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                    {commits.map(commit => {
                      return <CommitCard key={commit.id} commit={commit} />;
                    })}
                  </div>
                </TabsContent>
                <TabsContent value={TabKeys.Comments}>
                  <div className="flex flex-col items-start gap-2 mb-4">
                    <span>{t('CommitDrawer_cantSeeHiddenComment')}</span>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="comment-filter">{t('CommitDrawer_onlyUnresolved')}</Label>
                      <Switch id="comment-filter" onCheckedChange={setShowOnlyUnResolved} />
                    </div>
                  </div>
                  <div className={cn('flex flex-col gap-4 overflow-y-auto', 'max-h-[calc(100vh-260px)]')}>
                    {shownComments.map((comment, index) => {
                      return <CommentCard key={`${comment.id}${index}`} comment={comment} />;
                    })}
                  </div>
                </TabsContent>
              </SheetDescription>
            </Tabs>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

const CommitDrawer = memo(CommitDrawerPure);

export default CommitDrawer;
