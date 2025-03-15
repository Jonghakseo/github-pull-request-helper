import type { BaseStorage } from '../base/index.js';
import { createStorage, StorageEnum } from '../base/index.js';

type Commit = {
  id: string;
  commitMessage: string;
  commitLink: string;
};

type Comment = {
  id: string;
  authorName: string;
  authorProfileSrc: string;
  body: string;
};

type TimelineStore = {
  [url in string]: {
    lastUpdatedAt: number;
    commits: Commit[];
    comments: Comment[];
  };
};

type TimelineStorage = BaseStorage<TimelineStore> & {
  deleteExpired: () => Promise<void>;
  /** return new commits */
  saveCommits: (url: string, commits: Commit[]) => Promise<Commit[]>;
  /** return new comments */
  saveComments: (url: string, comments: Comment[]) => Promise<Comment[]>;
};

const storage = createStorage<TimelineStore>(
  'commits',
  {},
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const timelineStorage: TimelineStorage = {
  ...storage,
  deleteExpired: async () => {
    const data = await storage.get();
    const newData = Object.entries(data).reduce((acc, [url, value]) => {
      if (checkIsExpired(value.lastUpdatedAt)) {
        return acc;
      }
      return {
        ...acc,
        [url]: value,
      };
    }, {} as TimelineStore);
    await storage.set(newData);
  },
  saveCommits: async (url, commits) => {
    const prev = await storage.get();
    const prevDataAtThisUrl = prev[url];

    // update
    await storage.set(prev => {
      return {
        ...prev,
        [url]: {
          ...prevDataAtThisUrl,
          lastUpdatedAt: Date.now(),
          commits,
        },
      };
    });

    if (!prevDataAtThisUrl) {
      return [];
    }
    if (checkIsExpired(prevDataAtThisUrl.lastUpdatedAt)) {
      return [];
    }
    const prevCommits = prevDataAtThisUrl.commits || [];
    const updatedCommits = commits.filter(commit => !prevCommits.some(prevCommit => prevCommit.id === commit.id));
    if (updatedCommits.length === 0) {
      return [];
    }

    return updatedCommits;
  },
  saveComments: async (url, comments) => {
    const prev = await storage.get();
    const prevDataAtThisUrl = prev[url];

    // update
    await storage.set(prev => {
      return {
        ...prev,
        [url]: {
          ...prevDataAtThisUrl,
          lastUpdatedAt: Date.now(),
          comments,
        },
      };
    });

    if (!prevDataAtThisUrl) {
      return [];
    }
    if (checkIsExpired(prevDataAtThisUrl.lastUpdatedAt)) {
      return [];
    }
    const prevComments = prevDataAtThisUrl.comments || [];
    const updatedComments = comments.filter(
      comment => !prevComments.some(prevComment => prevComment.id === comment.id),
    );
    if (updatedComments.length === 0) {
      return [];
    }

    return updatedComments;
  },
};

function checkIsExpired(lastUpdatedAt: number) {
  // 7 days
  return Date.now() - lastUpdatedAt > 1000 * 60 * 60 * 24 * 7;
}
