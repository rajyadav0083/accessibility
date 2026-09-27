import { expect } from 'chai';
import { printViolations, runAxeScan, saveA11yReport } from '../helpers/a11y-helper.js';

describe('Angular 20 - WCAG 2.1 AA Accessibility Audit', () => {
  it('should pass the main landing page accessibility audit', async () => {
    await browser.url('/');
    const results = await runAxeScan();

    printViolations(results);
    await saveA11yReport('landing-page', results);

    expect(results.violations, 'Accessibility violations found on the landing page').to.have.lengthOf(0);
  });

  it('should audit the navigation/menu state', async () => {
    await browser.url('/');
    const menuButton = await $('.menu-button');
    await menuButton.click();
    const results = await runAxeScan({ include: ['header'] });

    printViolations(results);
    await saveA11yReport('navigation', results);

    expect(results.violations, 'Accessibility violations found in navigation').to.have.lengthOf(0);
  });

  it('should audit the dialog state', async () => {
    await browser.url('/');
    await $('.primary').click();
    const results = await runAxeScan({ include: ['.dialog-backdrop'] });

    printViolations(results);
    await saveA11yReport('dialog', results);

    expect(results.violations, 'Accessibility violations found in dialog').to.have.lengthOf(0);
  });
});
