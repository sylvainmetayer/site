// Per page, from its language (`lang`): the data files in that language
// (src/11ty/i18n.js, `localize`), the URL prefix and the other language.
import { localize, langPrefix, otherLang } from '../11ty/i18n.js';

const LOCALIZED = [
  'site', 'navigation', 'talks', 'formations', 'certifications',
  'skills', 'languages', 'interests',
];

export default {
  ...Object.fromEntries(LOCALIZED.map(key => [key, data => localize(data[key], data.lang)])),
  // '' or '/en', for the links to the pages of the same language
  langPrefix: data => langPrefix(data.lang),
  otherLang: data => otherLang(data.lang),
  otherLangPrefix: data => langPrefix(otherLang(data.lang)),
};
