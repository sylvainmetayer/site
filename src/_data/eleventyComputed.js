// The data files hold the French text at their root and the English one under
// an `en` key (Sveltia CMS i18n, structure single_file_default_root): on an
// English page, each of them is replaced by its English version.
const LOCALIZED = [
  'site', 'navigation', 'talks', 'formations', 'certifications',
  'skills', 'languages', 'interests',
];

const localize = (data, lang) => {
  if (!data || lang === 'fr' || !data[lang]) return data;
  return { ...data, ...data[lang] };
};

export default Object.fromEntries(
  LOCALIZED.map(key => [key, data => localize(data[key], data.lang)]),
);
