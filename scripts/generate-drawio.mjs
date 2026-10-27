/**
 * Writes one draw.io (.drawio) file per service into public/diagrams/ from
 * the same diagram specs the website renders, so the downloadable files
 * always match what students see. Run after editing any diagram:
 *
 *   npm run diagrams
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { toDrawioXml } from '../src/utils/drawio.js';
import { validateDiagram } from '../src/utils/diagram.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.join(root, '..', 'src', 'data', 'services');
const outputDir = path.join(root, '..', 'public', 'diagrams');
mkdirSync(outputDir, { recursive: true });

let written = 0;
for (const fileName of readdirSync(servicesDir).filter((name) => name.endsWith('.js'))) {
  const id = fileName.replace('.js', '');
  const content = (await import(pathToFileURL(path.join(servicesDir, fileName)).href)).default;
  const problems = validateDiagram(content.diagram);
  if (problems.length > 0) {
    console.error(`${id}: ${problems.join('; ')}`);
    process.exitCode = 1;
    continue;
  }
  writeFileSync(path.join(outputDir, `${id}.drawio`), toDrawioXml(content.diagram, id), 'utf8');
  written += 1;
}

console.log(`Wrote ${written} .drawio files to public/diagrams/`);
