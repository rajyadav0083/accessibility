import fs from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/webdriverio';

export async function waitForAngularStability(timeout = 15000) {
  await browser.waitUntil(
    async () => browser.execute(() => {
      const testabilities = window.getAllAngularTestabilities?.();
      const angularStable = testabilities
        ? testabilities.every((testability) => testability.isStable())
        : true;
      return document.readyState === 'complete' && angularStable;
    }),
    {
      timeout,
      interval: 250,
      timeoutMsg: 'Angular rendering did not become stable before the accessibility scan.'
    }
  );
}

export async function runAxeScan({ include = [], exclude = [], tags = ['wcag2a', 'wcag21a', 'wcag21aa', 'best-practice'] } = {}) {
  await waitForAngularStability();

  const builder = new AxeBuilder({ client: browser }).withTags(tags);
  include.forEach((selector) => builder.include(selector));
  exclude.forEach((selector) => builder.exclude(selector));

  return builder.analyze();
}

export async function saveA11yReport(name, results) {
  const outputDir = path.resolve('reports/a11y');
  await fs.mkdir(outputDir, { recursive: true });
  const file = path.join(outputDir, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(results, null, 2), 'utf8');
  return file;
}

export function printViolations(results) {
  if (results.violations.length === 0) {
    console.log('[A11y] No violations found.');
    return;
  }

  console.error(`[A11y] Found ${results.violations.length} violation rule(s).`);
  for (const violation of results.violations) {
    console.error(`- ${violation.id} | impact=${violation.impact} | ${violation.help}`);
    for (const node of violation.nodes) {
      console.error(`  target=${JSON.stringify(node.target)} | html=${node.html}`);
    }
  }
}
