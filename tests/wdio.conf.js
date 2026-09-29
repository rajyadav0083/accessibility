import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = process.env.A11Y_TARGET || 'chrome';
const baseUrl = process.env.A11Y_BASE_URL || 'http://localhost:4200';
const tunnelName = process.env.SAUCE_TUNNEL_NAME || 'angular20-a11y-tunnel';

const sauceOptions = {
  build: process.env.SAUCE_BUILD || 'Angular-20-A11y-Demo',
  tunnelName,
  screenResolution: '1920x1080',
  extendedDebugging: true,
  capturePerformance: true,
  recordVideo: true,
  recordScreenshots: true,
  captureHtml: true
};

function capabilityFor(name) {
  const common = { 'sauce:options': { ...sauceOptions, name } };

  switch (target) {
    case 'safari':
      return {
        browserName: 'safari',
        platformName: 'macOS 14',
        browserVersion: 'latest',
        ...common
      };
    case 'iphone':
      return {
        platformName: 'iOS',
        'appium:deviceName': 'iPhone 15.*',
        'appium:automationName': 'XCUITest',
        'appium:browserName': 'Safari',
        ...common
      };
    case 'android':
      return {
        platformName: 'Android',
        'appium:deviceName': 'Galaxy S24.*',
        'appium:automationName': 'UiAutomator2',
        'appium:browserName': 'Chrome',
        ...common
      };
    case 'chrome':
    default:
      return {
        browserName: 'chrome',
        platformName: 'Windows 11',
        browserVersion: 'latest',
        ...common
      };
  }
}

export const config = {
  runner: 'local',
  specs: [path.join(__dirname, 'specs/**/*.a11y.spec.js')],
  maxInstances: 1,
  logLevel: 'info',
  baseUrl,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  services: ['sauce'],
  user: 'oauth-anushakya011-f73fa',
  key: '988fd50c-854b-43ea-b636-692d7f95add7',
  region: 'eu',
  framework: 'mocha',
  reporters: ['spec'],
  outputDir: path.join(__dirname, '../reports/wdio'),
  mochaOpts: {
    timeout: 90000
  },
  capabilities: [capabilityFor(`Angular 20 A11y - ${target}`)],
  before: async () => {
    await browser.setTimeout({ implicit: 1000, pageLoad: 60000, script: 30000 });
  }
};
