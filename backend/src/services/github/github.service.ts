import { Octokit } from '@octokit/rest';
import { env } from '../../config/env.js';

export class GitHubService {
  private octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
    });
  }

  async getRepoMetadata(username: string) {
    const { data: repos } = await this.octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 5,
    });

    return repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      updated_at: repo.updated_at,
    }));
  }

  async getRepoReadme(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.rest.repos.getReadme({
         owner,
         repo,
         mediaType: { format: 'raw' }
      });
      return data;
    } catch (e) {
      return 'No README found.';
    }
  }

  async fetchProjectDeepData(owner: string, repoNames: string[]) {
    const projects = [];
    for (const repo of repoNames) {
      const readme = await this.getRepoReadme(owner, repo);
      const { data: languages } = await this.octokit.rest.repos.listLanguages({
        owner,
        repo,
      });
      projects.push({ name: repo, readme, languages: Object.keys(languages) });
    }
    return projects;
  }
}
