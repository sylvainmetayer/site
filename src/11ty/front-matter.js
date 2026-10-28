// Front matter checks of the articles (eleventyDataSchema, src/posts/posts.11tydata.js):
// a typo in the CMS or in a file fails the build with the field and the reason,
// instead of a silently broken page.
const isUrl = value => /^https?:\/\/\S+$/.test(value);
const isPath = value => typeof value === 'string' && value.startsWith('/');

const RULES = {
  title: value => (typeof value === 'string' && value.trim() !== '') || 'texte obligatoire',
  page: value => !Number.isNaN(value.date.getTime()) || 'date invalide',
  tags: value => value === undefined || (Array.isArray(value) && value.every(tag => /^[\p{Ll}\p{N}-]+$/u.test(tag))) || 'liste de mots en minuscules, sans espace',
  excerpt: value => value === undefined || typeof value === 'string' || 'texte',
  draft: value => value === undefined || typeof value === 'boolean' || 'true ou false',
  star: value => value === undefined || typeof value === 'boolean' || 'true ou false',
  series: value => value === undefined || (typeof value === 'string' && value.trim() !== '') || 'texte',
  short: value => value === undefined || /^[a-z0-9-]+$/.test(value) || 'minuscules, chiffres et tirets',
  redirect_from: value => value === undefined || [value].flat().every(isPath) || 'chemin(s) commençant par /',
  // false: no generated image (unpublished article, posts.11tydata.js)
  socialImage: value => value === undefined || value === false || isPath(value) || 'chemin commençant par /',
  canonical: value => value === undefined || isUrl(value) || 'URL complète',
  original: value => value === undefined || isUrl(value) || 'URL complète',
};

export default function checkPostFrontMatter(data) {
  const errors = Object.entries(RULES)
    .map(([field, rule]) => [field, rule(data[field])])
    .filter(([, result]) => result !== true)
    .map(([field, reason]) => `${field === 'page' ? 'date' : field} : ${reason}`);
  if (errors.length) throw new Error(`Front matter invalide (${errors.join(' ; ')})`);
}
