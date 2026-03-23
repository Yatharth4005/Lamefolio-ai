import { Octokit } from '@octokit/rest';
import axios from 'axios';
import { env } from '../../config/env.js';

export class GitHubService {
  private octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || env.GITHUB_TOKEN,
    });
  }

  async getAccessToken(code: string) {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (response.data.error) {
      throw new Error(`GitHub Auth Error: ${response.data.error_description}`);
    }

    return response.data.access_token;
  }

  async getUserProfile(token: string) {
    const octokit = new Octokit({ auth: token });
    const [{ data: user }, { data: repos }] = await Promise.all([
      octokit.rest.users.getAuthenticated(),
      octokit.rest.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 10 })
    ]);

    return {
      username: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      repos: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        updated_at: repo.updated_at,
      }))
    };
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
