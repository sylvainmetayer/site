import { readFileSync } from 'node:fs';

const eleventyPackage = JSON.parse(
  readFileSync(new URL('../../node_modules/@11ty/eleventy/package.json', import.meta.url), 'utf8')
);

export default {
  random() {
    const segment = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${segment()}-${segment()}-${segment()}`;
  },
  now: Date.now(),
  // Unset means a local or CI build: no analytics beacon, robots.txt disallows all.
  environment: process.env.ELEVENTY_ENV || 'development',
  eleventyVersion: eleventyPackage.version
};
