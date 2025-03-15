import { describe, it, expect } from 'vitest';
import { isGithubPullRequestPage } from './event-handler';

describe('isGithubPullRequestPage', () => {
  it('should return true for a valid GitHub PR URL', () => {
    const url = 'https://github.com/user/repo/pull/123';
    expect(isGithubPullRequestPage(url)).toBe(true);
  });

  it('should return false for a non-GitHub URL', () => {
    const url = 'https://example.com/user/repo/pull/123';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });

  it('should return false for a GitHub URL without /pull/', () => {
    const url = 'https://github.com/user/repo/issues/123';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });

  it('should return false for a GitHub URL with an invalid PR number', () => {
    const url = 'https://github.com/user/repo/pull/abc';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });

  it('should return false for a GitHub URL with no PR number', () => {
    const url = 'https://github.com/user/repo/pull/';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });

  it('should return false for a GitHub URL with extra path segments', () => {
    const url = 'https://github.com/user/repo/pull/123/extra';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });

  it('should return true for a GitHub URL with query parameters', () => {
    const url = 'https://github.com/user/repo/pull/123?param=value';
    expect(isGithubPullRequestPage(url)).toBe(true);
  });

  it('should return true for a GitHub URL with a fragment', () => {
    const url = 'https://github.com/user/repo/pull/123#section';
    expect(isGithubPullRequestPage(url)).toBe(true);
  });

  it('should return false for a GitHub URL with a different subdomain', () => {
    const url = 'https://subdomain.github.com/user/repo/pull/123';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });

  it('should return false for a GitHub URL with a different protocol', () => {
    const url = 'http://github.com/user/repo/pull/123';
    expect(isGithubPullRequestPage(url)).toBe(false);
  });
});
