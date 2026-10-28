import { readdirSync, readFileSync } from 'node:fs';
import Fetch from '@11ty/eleventy-fetch';
import matter from 'gray-matter';

// Stars and last push of the GitHub repositories of the projects (`repo` front
// matter of src/projets/), shown on their cards. GITHUB_TOKEN raises the API
// limit (60 requests an hour without it). A repository the API does not
// answer for is left out.
// { 'https://github.com/owner/name': { stars, pushedAt, archived } }
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
      const data = await Fetch(`https://api.github.com/repos/${name}`, { duration: '1d', type: 'json', fetchOptions: { headers } });
      return [repo, { stars: data.stargazers_count, pushedAt: data.pushed_at, archived: data.archived }];
    } catch (error) {
      console.warn(`[githubRepos] ${name} : ${error.message}`);
      return null;
    }
  }));
  return Object.fromEntries(entries.filter(Boolean));
}
