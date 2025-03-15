import type { BaseStorage } from '../base/index.js';
import { createStorage, StorageEnum } from '../base/index.js';

type Commit = {
  id: string;
  commitMessage: string;
  commitLink: string;
};

type CommitStore = {
  [url in string]: {
    lastUpdatedAt: number;
    commits: Commit[];
  };
};

type CommitsStorage = BaseStorage<CommitStore> & {
  deleteExpired: () => Promise<void>;
  /** return new commits */
  saveCommits: (url: string, commits: Commit[]) => Promise<Commit[]>;
};

const storage = createStorage<CommitStore>(
  'commits',
  {},
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const commitsStorage: CommitsStorage = {
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
    }, {} as CommitStore);
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
};

function checkIsExpired(lastUpdatedAt: number) {
  // 7 days
  return Date.now() - lastUpdatedAt > 1000 * 60 * 60 * 24 * 7;
}
