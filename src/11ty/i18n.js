// French / English, shared by the Eleventy config, the data files and the
// scripts (check-cv-ats.mjs): one place for the conventions of the README,
// section « Version anglaise ».

export const LANGS = ['fr', 'en'];
export const DEFAULT_LANG = 'fr';

// `slug.md` is French, `slug.en.md` its English translation (Sveltia CMS i18n,
// structure multiple_files)
export const isEnglishFile = path => path.endsWith('.en.md');

// The slug shared by an entry and its translation: "ansible" for ansible.en.md
export const baseSlug = fileSlug => fileSlug.replace(/\.en$/, '');

// URL prefix of a language: '' for French, '/en' for English
export const langPrefix = lang => (lang === DEFAULT_LANG ? '' : `/${lang}`);

export const otherLang = lang => (lang === 'en' ? 'fr' : 'en');

// Data of an entry collection (posts, projets, work): its language and the key
// that links it to its translation
export const entryData = (data, prefix) => ({
  lang: isEnglishFile(data.page.inputPath) ? 'en' : DEFAULT_LANG,
  translationKey: `${prefix}:${baseSlug(data.page.fileSlug)}`,
});

// A data file in the language of the page. Two conventions:
// - files edited in Sveltia CMS (structure single_file_default_root): the
//   French text at the root, the English version under the `en` key;
// - other files (talks, languages, interests): a `field_en` next to each
//   translated `field`, so that a new item needs no copy in the other language.
const localizeFields = (value, lang) => {
  if (Array.isArray(value)) return value.map(item => localizeFields(item, lang));
  if (!value || typeof value !== 'object') return value;
  const suffix = `_${lang}`;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !LANGS.some(language => key.endsWith(`_${language}`)))
    .map(([key, field]) => [key, lang !== DEFAULT_LANG && `${key}${suffix}` in value
      ? value[`${key}${suffix}`]
      : localizeFields(field, lang)]));
};

export const localize = (data, lang) => {
  if (!data || typeof data !== 'object') return data;
  const { [lang]: translation, ...rest } = data;
  const base = lang !== DEFAULT_LANG && translation ? { ...rest, ...translation } : data;
  return localizeFields(base, lang);
};

// URL → item, built once per collection array
const byUrl = new WeakMap();
export const urlIndex = all => {
  if (!byUrl.has(all)) byUrl.set(all, new Map(all.filter(item => item.url).map(item => [item.url, item])));
  return byUrl.get(all);
};

// translationKey → { fr: item, en: item }, built once per collection array
const indexes = new WeakMap();
export const translationIndex = all => {
  if (!indexes.has(all)) {
    const index = new Map();
    all.forEach(item => {
      const { translationKey: key, lang } = item.data;
      if (!key || !item.url && item.data.permalink !== false) return;
      if (!index.has(key)) index.set(key, {});
      // First one wins: page 1 of a paginated listing
      index.get(key)[lang] ??= item;
    });
    indexes.set(all, index);
  }
  return indexes.get(all);
};
