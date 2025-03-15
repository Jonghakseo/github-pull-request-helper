import {
  Button,
  cn,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@extension/ui';
import { copyCommitToClipboard } from '@src/utils';
import { useState } from 'react';
import type { Commit, Comment } from '@src/types';

enum TabKeys {
  Commits = 'commits',
  Comments = 'comments',
}

type CommitDrawerProps = {
  commits: Commit[];
  comments: Comment[];
  container: HTMLElement;
};

export default function CommitDrawer({ commits, comments, container }: CommitDrawerProps) {
  const [tabKey, setTabKey] = useState<TabKeys>(TabKeys.Commits);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasCommitsOrComments = commits.length > 0 || comments.length > 0;

  return (
    <>
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button
            size="sm"
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
        <SheetContent container={container} className={'pointer-events-auto bg-gray-800 border-transparent'}>
          <SheetHeader>
            <SheetTitle className="text-amber-50">Timeline</SheetTitle>
            <Tabs value={tabKey}>
              <TabsList className="grid w-full grid-cols-2 mt-2 mb-4">
                <TabsTrigger onClick={() => setTabKey(TabKeys.Commits)} value={TabKeys.Commits}>
                  Commits
                </TabsTrigger>
                <TabsTrigger onClick={() => setTabKey(TabKeys.Comments)} value={TabKeys.Comments}>
                  Comments
                </TabsTrigger>
              </TabsList>
              <SheetDescription>
                <TabsContent value={TabKeys.Commits}>
                  <div className="flex flex-col gap-4">
                    {commits.map(commit => {
                      const isCopied = copiedId === commit.id;
                      return (
                        <div className="flex justify-between p-4 border border-gray-400 rounded" key={commit.id}>
                          <a
                            className="w-[200px] text-amber-50 line-clamp-2 underline"
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
                              setCopiedId(commit.id);
                            }}>
                            {isCopied ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value={TabKeys.Comments}>
                  You can see only visible comments here.
                  <div className="flex flex-col gap-4 mt-2">
                    {comments.map(comment => {
                      return (
                        <div className="flex justify-between p-4 border border-gray-400 rounded" key={comment.id}>
                          <div className="flex flex-col justify-start w-[230px] gap-2">
                            <div className="flex justify-start gap-2">
                              <img
                                alt={comment.authorName}
                                className="w-5 h-5 rounded-full"
                                src={comment.authorProfileSrc}
                              />
                              <strong>{comment.authorName}</strong>
                            </div>
                            <span className="text-amber-50 line-clamp-2">{comment.body}</span>
                          </div>
                          <Button
                            size="sm"
                            variant={'default'}
                            onClick={() => {
                              const target = document.getElementById(comment.id);
                              if (target) {
                                const top = Math.ceil(
                                  target.getBoundingClientRect().y + window.pageYOffset - window.innerHeight / 2,
                                );
                                window.scrollTo({ top, behavior: 'instant' });
                              }
                            }}>
                            Go
                          </Button>
                        </div>
                      );
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
