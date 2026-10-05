// Checks that the CV PDF reads well in applicant tracking systems (ATS), which parse the
// text of the PDF in content order, without layout:
//
//   node scripts/check-cv-ats.mjs <cv.pdf> [--lang fr|en] [--compare <other.pdf>]
//
// --lang en checks the English CV (src/uploads/CV-en.pdf) against the English
// data: `en` keys of src/_data, src/work/*.en.md, English section headings.
//
// - one page, real embedded fonts (no Type 3 fonts, which many parsers cannot read);
// - the text starts with the name, contains the e-mail and the profile URLs;
// - standard section headings, every experience, role, mission, skill, certification
//   and education of src/_data and src/work, in reading order for the experiences;
// - no unreadable characters (replacement or private use) nor letter-spaced words.
// With --compare, the two PDFs must hold the same text: CI uses it to fail when
// src/uploads/CV.pdf was not regenerated (mise run cv) after a content change.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { getDocument, OPS } from 'pdfjs-dist/legacy/build/pdf.mjs';

const args = process.argv.slice(2);
const file = args[0];
const compareIndex = args.indexOf('--compare');
const compareFile = compareIndex === -1 ? null : args[compareIndex + 1];
const langIndex = args.indexOf('--lang');
const lang = langIndex === -1 ? 'fr' : args[langIndex + 1];
if (!file || (compareIndex !== -1 && !compareFile) || !['fr', 'en'].includes(lang)) {
  console.error('Usage : node scripts/check-cv-ats.mjs <cv.pdf> [--lang fr|en] [--compare <other.pdf>]');
  process.exit(2);
}

const HEADINGS = {
  fr: ['Expérience', 'Formation', 'Compétences', 'Certifications', 'Langues'],
  en: ['Experience', 'Education', 'Skills', 'Certifications', 'Languages'],
};

// Data files hold the English text under an `en` key (src/_data/eleventyComputed.js)
const localize = data => (lang === 'fr' || !data[lang] ? data : { ...data, ...data[lang] });
const readJson = name => localize(JSON.parse(readFileSync(join('src/_data', name), 'utf8')));
const site = readJson('site.json');
const social = readJson('social.json');
const skills = readJson('skills.json');
const certifications = readJson('certifications.json');
const formations = readJson('formations.json');
// slug.md in French, slug.en.md its English translation (French when missing)
const workFiles = readdirSync('src/work').filter(name => name.endsWith('.md'));
const work = workFiles
  .filter(name => !name.endsWith('.en.md'))
  .map(name => (lang === 'en' && workFiles.includes(name.replace(/\.md$/, '.en.md')) ? name.replace(/\.md$/, '.en.md') : name))
  .map(name => matter(readFileSync(join('src/work', name), 'utf8')).data)
  .filter(entry => entry.print !== false)
  .sort((a, b) => new Date(b.start) - new Date(a.start));

// Whitespace and line breaks differ between layouts: compare on collapsed text
const flatten = text => text.replace(/\s+/g, ' ').trim();

async function read(path) {
  const pdf = await getDocument({ data: new Uint8Array(readFileSync(path)), verbosity: 0 }).promise;
  const fonts = new Map();
  const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
    const page = await pdf.getPage(index + 1);
    // Fonts used by the page are loaded by getOperatorList
    const [content, operators] = await Promise.all([page.getTextContent(), page.getOperatorList()]);
    operators.fnArray.forEach((fn, position) => {
      if (fn !== OPS.setFont) return;
      const id = operators.argsArray[position][0];
      if (!fonts.has(id) && page.commonObjs.has(id)) {
        const font = page.commonObjs.get(id);
        fonts.set(id, { name: font.name || font.loadedName || id, type3: Boolean(font.isType3Font) });
      }
    });
    return content.items.map(item => item.str + (item.hasEOL ? '\n' : '')).join('');
  }));
  return { pages: pdf.numPages, text: pages.join('\n'), fonts: [...fonts.values()] };
}

const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const cv = await read(file);
const text = flatten(cv.text);
const lower = text.toLowerCase();
const indexOf = needle => text.indexOf(flatten(needle));

check(cv.pages === 1, `${cv.pages} pages au lieu d'une`);
check(text.length > 1500, `trop peu de texte extrait (${text.length} caractères) : texte vectorisé ou en image ?`);

const type3 = cv.fonts.filter(font => font.type3).map(font => font.name);
check(type3.length === 0, `polices Type 3, mal lues par les ATS : ${type3.join(', ')}`);

const firstLine = cv.text.split('\n').map(line => line.trim()).find(Boolean);
check(firstLine === site.authorName, `le texte doit commencer par le nom « ${site.authorName} », pas par « ${firstLine} »`);

check(indexOf(site.authorEmail) !== -1, `e-mail ${site.authorEmail} absent`);
for (const link of social.links.filter(link => ['github', 'linkedin'].includes(link.label))) {
  const url = link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  check(indexOf(url) !== -1, `profil ${link.label} absent (${url})`);
}

for (const heading of HEADINGS[lang]) {
  check(lower.includes(heading.toLowerCase()), `section « ${heading} » absente`);
}

// Experiences in order: company, then its roles and missions, before the next company
let cursor = Math.max(0, lower.indexOf(HEADINGS[lang][0].toLowerCase()));
for (const entry of work) {
  const position = text.indexOf(entry.title, cursor);
  check(position !== -1, `expérience « ${entry.title} » absente ou hors de l'ordre de lecture`);
  if (position === -1) continue;
  cursor = position;
  for (const role of entry.roles || []) {
    const rolePosition = text.indexOf(flatten(role.title), cursor);
    check(rolePosition !== -1, `poste « ${role.title} » (${entry.title}) absent ou hors de l'ordre de lecture`);
    if (rolePosition !== -1) cursor = rolePosition;
    for (const mission of role.missions || []) {
      const missionPosition = text.indexOf(flatten(mission), cursor);
      check(missionPosition !== -1, `mission absente ou hors de l'ordre de lecture (${entry.title}) : « ${mission.slice(0, 60)}… »`);
      if (missionPosition !== -1) cursor = missionPosition;
    }
  }
  check(text.includes(new Date(entry.start).getFullYear().toString()), `année de début de « ${entry.title} » absente`);
}

for (const group of skills.groups) {
  for (const skill of group.skills) check(indexOf(skill) !== -1, `compétence « ${skill} » absente`);
}
for (const cert of certifications.certifications.filter(cert => cert.print !== false)) {
  check(indexOf(cert.title) !== -1, `certification « ${cert.title} » absente`);
}
for (const formation of formations.formations.filter(formation => formation.print !== false)) {
  const title = formation.shortTitle || formation.title;
  check(indexOf(title) !== -1, `formation « ${title} » absente`);
}

check(!/[�-]/.test(cv.text), 'caractères illisibles (U+FFFD ou zone privée) dans le texte extrait');
const spaced = /(?:^|\s)(?:\p{L} ){4,}\p{L}(?=\s|$)/u.exec(cv.text);
check(!spaced, `mot aux lettres espacées, illisible pour un ATS : « ${spaced?.[0].trim()} »`);

if (compareFile) {
  const other = await read(compareFile);
  check(
    flatten(other.text) === text,
    `${compareFile} ne correspond pas au CV généré depuis les sources : lancer « mise run cv » et commiter le PDF`,
  );
}

if (errors.length) {
  console.error(`CV non conforme ATS (${file}) :`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`OK : ${file} lisible par un ATS (1 page, ${cv.fonts.length} polices, ${text.length} caractères).`);
