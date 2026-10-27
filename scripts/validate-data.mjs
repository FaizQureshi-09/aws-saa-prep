/**
 * Data integrity checks for the study content. Fails (exit 1) on:
 *  - a catalog entry without a content file, or a content file not in the catalog
 *  - a service missing from the study plan, or scheduled twice
 *  - missing/short sections, malformed questions, duplicate stems
 *  - invalid diagram specs (unknown kinds, dangling edges, overlapping cells)
 *  - unknown service ids in domain task mappings or `related` lists
 *  - non-HTTPS source URLs or sources outside docs/aws pages
 *
 * Usage: node scripts/validate-data.mjs
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { serviceCatalog, serviceById } from '../src/data/serviceCatalog.js';
import { allPlanDays } from '../src/data/studyPlanData.js';
import { domains } from '../src/data/domainsData.js';
import { categoryById } from '../src/data/categoriesData.js';
import { validateDiagram } from '../src/utils/diagram.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.join(root, '..', 'src', 'data', 'services');
const errors = [];
const warnings = [];
const fail = (scope, message) => errors.push(`${scope}: ${message}`);

const fileIds = readdirSync(servicesDir).filter((name) => name.endsWith('.js')).map((name) => name.replace('.js', ''));
const catalogIds = serviceCatalog.map((service) => service.id);

// Catalog <-> files
catalogIds.filter((id) => !fileIds.includes(id)).forEach((id) => fail('catalog', `no content file for "${id}"`));
fileIds.filter((id) => !catalogIds.includes(id)).forEach((id) => fail('files', `content file "${id}" is not in the catalog`));
new Set(catalogIds.filter((id, index) => catalogIds.indexOf(id) !== index)).forEach((id) => fail('catalog', `duplicate id "${id}"`));
serviceCatalog.forEach((service) => {
  if (!categoryById[service.category]) fail(service.id, `unknown category "${service.category}"`);
  if (!['critical', 'high', 'medium', 'low'].includes(service.tier)) fail(service.id, `bad tier "${service.tier}"`);
  if (!(service.hours > 0)) fail(service.id, 'hours must be > 0');
});

// Study plan coverage
const planned = allPlanDays.flatMap((day) => day.services);
catalogIds.filter((id) => !planned.includes(id)).forEach((id) => fail('plan', `"${id}" is not scheduled`));
planned.filter((id) => !serviceById[id]).forEach((id) => fail('plan', `unknown service "${id}"`));
new Set(planned.filter((id, index) => planned.indexOf(id) !== index)).forEach((id) => fail('plan', `"${id}" scheduled more than once`));

// Domain mappings
domains.forEach((domain) =>
  domain.tasks.forEach((task) =>
    task.services.filter((id) => !serviceById[id]).forEach((id) => fail(`task ${task.id}`, `unknown service "${id}"`))
  )
);

const HOST_ALLOWLIST = /(^|\.)((docs|aws)\.amazon\.com|awsstatic\.com|amazonaws\.com|aws\.amazon\.com)$/;
const stems = new Map();
let questionTotal = 0;
let officialTotal = 0;

for (const id of fileIds) {
  const meta = serviceById[id];
  if (!meta) continue;
  const content = (await import(pathToFileURL(path.join(servicesDir, `${id}.js`)).href)).default;
  const scope = id;
  // Depth thresholds: critical/high = full, medium = mid, low = compact.
  const depth = meta.tier === 'low' ? 0 : meta.tier === 'medium' ? 1 : 2;
  const pick = (compactMin, midMin, fullMin) => [compactMin, midMin, fullMin][depth];

  const need = (key, min) => {
    const value = content[key];
    if (!Array.isArray(value) || value.length < min) fail(scope, `"${key}" needs at least ${min} entries`);
  };

  if (!content.tagline || content.tagline.length < 20) fail(scope, 'missing tagline');
  need('intro', pick(4, 5, 5));
  if ((content.intro?.length ?? 0) > 7) warnings.push(`${scope}: intro has more than 6 points`);
  need('useCases', pick(2, 3, 3));
  if (!content.importance?.points?.length) fail(scope, 'missing importance.points');
  need('cli', pick(2, 4, 5));
  if (!content.sdk?.summary || !content.sdk?.snippets?.length) fail(scope, 'missing sdk summary/snippets');
  need('examples', 1);
  need('questionTypes', pick(2, 3, 3));
  need('questions', pick(3, 3, 4));
  need('keyFacts', pick(4, 5, 6));
  need('traps', pick(2, 3, 3));
  need('sources', 2);

  // Diagram
  validateDiagram(content.diagram).forEach((problem) => fail(scope, `diagram: ${problem}`));
  if (!content.diagram?.steps?.length) warnings.push(`${scope}: diagram has no steps`);

  // Related
  (content.related ?? []).filter((rel) => !serviceById[rel]).forEach((rel) => fail(scope, `related "${rel}" is not in the catalog`));

  // Sources
  (content.sources ?? []).forEach((source) => {
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:') fail(scope, `non-HTTPS source ${source.url}`);
      if (!HOST_ALLOWLIST.test(url.hostname) && !/aws|amazon/i.test(url.hostname)) fail(scope, `unexpected host ${url.hostname}`);
    } catch {
      fail(scope, `invalid URL ${source.url}`);
    }
    if (!source.title) fail(scope, `source without title: ${source.url}`);
  });

  // Questions
  (content.questions ?? []).forEach((question, index) => {
    const label = `${scope} Q${index + 1}`;
    questionTotal += 1;
    if (question.source === 'official') officialTotal += 1;
    if (!['official', 'mock'].includes(question.source)) fail(label, `bad source "${question.source}"`);
    if (![1, 2, 3, 4].includes(question.domain)) fail(label, 'bad domain');
    if (!question.stem || question.stem.length < 30) fail(label, 'stem too short');
    if (!Array.isArray(question.options) || question.options.length < 4 || question.options.length > 6) fail(label, 'needs 4-6 options');
    const letters = (question.options ?? []).map((_, i) => String.fromCharCode(65 + i));
    if (!Array.isArray(question.answer) || question.answer.length === 0) fail(label, 'missing answer');
    else if (question.answer.some((letter) => !letters.includes(letter))) fail(label, `answer ${question.answer} outside options`);
    if (question.answer?.length > 1 && !question.multi) fail(label, 'multiple answers but multi flag not set');
    if (question.multi && (question.options?.length ?? 0) < 5) fail(label, 'multiple-response questions need 5+ options');
    if (!question.explanation || question.explanation.length < 40) fail(label, 'explanation too short');
    if (new Set(question.options).size !== question.options?.length) fail(label, 'duplicate options');
    if (stems.has(question.stem)) fail(label, `duplicate stem also in ${stems.get(question.stem)}`);
    stems.set(question.stem, label);
    if (question.source === 'official' && !question.reference) fail(label, 'official question needs a reference');
  });
}

console.log(`Checked ${fileIds.length} content files, ${questionTotal} questions (${officialTotal} official).`);
warnings.forEach((warning) => console.warn(`  warning: ${warning}`));
if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log('Data validation passed.');
