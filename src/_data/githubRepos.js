import { readdirSync, readFileSync } from 'node:fs';
import Fetch from '@11ty/eleventy-fetch';
import matter from 'gray-matter';

// Stars and last push of the GitHub repositories of the projects (`repo` front
// matter of src/projets/), shown on their cards. GITHUB_TOKEN raises the API
// limit (60 requests an hour without it). A repository the API does not
// answer for is left out.
// Last commit: the latest of the default branch, not pushed_at, which moves
// with any branch (Renovate). { 'https://github.com/owner/name': { stars, lastCommit, archived } }
const dir = new URL('../projets/', import.meta.url);
const repos = [...new Set(readdirSync(dir)
  .filter(file => file.endsWith('.md'))
  .map(file => matter(readFileSync(new URL(file, dir), 'utf8')).data.repo)
  .filter(repo => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(repo || '')))];

export default async function githubRepos() {
  const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const entries = await Promise.all(repos.map(async repo => {
    const name = repo.replace('https://github.com/', '').replace(/\/$/, '');
    try {
      const get = path => Fetch(`https://api.github.com/repos/${name}${path}`, { duration: '1d', type: 'json', fetchOptions: { headers } });
      const data = await get('');
      const [commit] = await get(`/commits?sha=${encodeURIComponent(data.default_branch)}&per_page=1`);
      return [repo, { stars: data.stargazers_count, lastCommit: commit.commit.committer.date, archived: data.archived }];
    } catch (error) {
      console.warn(`[githubRepos] ${name} : ${error.message}`);
      return null;
    }
  }));
  return Object.fromEntries(entries.filter(Boolean));
}
