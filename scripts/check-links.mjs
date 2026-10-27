/**
 * Verifies that every external URL used as a "source" on the site still
 * resolves. Collects URLs from every service content file plus the shared
 * exam, scope and resource data, requests each one (GET, following
 * redirects), and reports anything that does not return HTTP 200-399.
 *
 * Usage: node scripts/check-links.mjs [--concurrency=8]
 * Note: needs network access; run before releasing content.
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { examSources } from '../src/data/examData.js';
import { quickReference, removedFromScope } from '../src/data/scopeData.js';
import { officialResources } from '../src/data/resourcesData.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.join(root, '..', 'src', 'data', 'services');
const concurrencyArg = process.argv.find((arg) => arg.startsWith('--concurrency='));
const concurrency = concurrencyArg ? Number(concurrencyArg.split('=')[1]) : 8;

/** url -> list of places it is used */
const usages = new Map();
const add = (url, where) => usages.set(url, [...(usages.get(url) ?? []), where]);

Object.entries(examSources).forEach(([key, source]) => add(source.url, `examData:${key}`));
quickReference.forEach((item) => add(item.url, `scopeData:quickReference:${item.name}`));
removedFromScope.forEach((item) => add(item.url, `scopeData:removed:${item.name}`));
officialResources.forEach((item) => add(item.url, `resourcesData:${item.title}`));

for (const fileName of readdirSync(servicesDir).filter((name) => name.endsWith('.js'))) {
  const content = (await import(pathToFileURL(path.join(servicesDir, fileName)).href)).default;
  (content.sources ?? []).forEach((source) => add(source.url, `services/${fileName}`));
}

const urls = [...usages.keys()];
console.log(`Checking ${urls.length} unique URLs (concurrency ${concurrency})...`);

async function check(url) {
  const attempt = async (method) => {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; saa-prep-link-check)' },
      signal: AbortSignal.timeout(25000),
    });
    return response.status;
  };
  try {
    let status = await attempt('HEAD');
    if (status >= 400) status = await attempt('GET');
    return { url, status };
  } catch (error) {
    return { url, status: 0, error: error.message };
  }
}

const results = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      results.push(await check(queue.shift()));
    }
  })
);

const bad = results.filter((result) => result.status === 0 || result.status >= 400);
bad.sort((a, b) => a.url.localeCompare(b.url));
bad.forEach((result) =>
  console.error(`  ${result.status || 'ERR'}  ${result.url}\n        used in: ${usages.get(result.url).join(', ')}${result.error ? `\n        ${result.error}` : ''}`)
);
console.log(`${results.length - bad.length} OK, ${bad.length} failing.`);
process.exit(bad.length > 0 ? 1 : 0);
