import {
  Button,
  cn,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@extension/ui';
import { copyCommitToClipboard } from '@src/utils';
import { useState } from 'react';
import type { Commit } from '@src/types';

type CommitDrawerProps = {
  commits: Commit[];
  container: HTMLElement;
};

export default function CommitDrawer({ commits, container }: CommitDrawerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <>
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              commits.length > 0 ? 'block' : 'hidden',
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
            <SheetTitle className="text-amber-50">Commits</SheetTitle>
            <SheetDescription>
              <div className="flex flex-col gap-4">
                {commits.map(commit => {
                  const isCopied = copiedId === commit.id;
                  return (
                    <div className="flex justify-between p-4 border border-gray-400 rounded" key={commit.id}>
                      <span className="w-[200px] text-amber-50 line-clamp-2">{commit.commitMessage}</span>
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
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
