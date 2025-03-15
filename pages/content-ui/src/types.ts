export type Commit = {
  id: string;
  commitMessage: string;
  commitLink: string;
};

export type Comment = {
  id: string;
  authorName: string;
  authorProfileSrc: string;
  body: string;
};
