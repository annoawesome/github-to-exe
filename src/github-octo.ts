import { Octokit } from "octokit";

const octokit = new Octokit();

export function getGitHubUrlInfo(url: string) {
  const urlObject = new URL(url);
  const path = urlObject.pathname.split("/");

  return {
    owner: path[1],
    repo: path[2],
  };
}

/**
 * Checks if a given GitHub repository url is semantically correct. Does NOT check if the repository actually exists!
 * @param url A URL to a GitHub repository
 */
export function isValidGitHubRepoUrl(url: string) {
  const urlObject = new URL(url);
  const path = urlObject.pathname.split("/");

  return urlObject.host === "github.com" && path.length === 3;
}

export async function getRepoHomepage(githubUrl: string) {
  const repoInfo = getGitHubUrlInfo(githubUrl);

  const res = await octokit.rest.repos.get({
    owner: repoInfo.owner,
    repo: repoInfo.repo,
  });

  if (res.data.homepage) {
    return res.data.homepage;
  }
}
