# Angular 20 + Sauce Labs MCP + Accessibility Demo

This project is a small, intentionally imperfect Angular 20 Hello World application designed to demonstrate the workflow described in `Angular_SauceLabs_Accessibility_Testing_Guide.pdf`:

```text
Devin
  |
  +-- Sauce Labs MCP -----------------> Sauce account/jobs/devices/artifacts
  |
  +-- Git repository -----------------> Angular 20 source
  |
  +-- npm run test:a11y --------------> WebdriverIO + @axe-core/webdriverio
                                         |
                                         +--> Sauce Labs browser/device
                                         +--> WCAG 2.1 A/AA results
```

The PDF recommends WebdriverIO + `@axe-core/webdriverio`, an Angular-stability wait, a cross-device capability matrix, and Devin + Sauce MCP for discovery, execution/diagnosis and remediation. See pages 1-5 of the supplied guide.

## 1. Prerequisites

- Node.js 20.19+ for Angular 20.
- Sauce Labs account and Access Key.
- Sauce Connect 5 if the Angular application is running only on your local machine.
- Devin with access to this Git repository and a remote HTTP MCP configuration.

Angular 20 currently requires Node.js 20.19+ (or supported newer Node versions). The project pins Angular 20.3.32.

## 2. Install

```bash
npm install
```

Copy `.env.example` to `.env` only for your local reference. Do not commit `.env`.

Set credentials in your shell/Devin secret store instead of source code:

### PowerShell

```powershell
$env:SAUCE_USERNAME="your_username"
$env:SAUCE_ACCESS_KEY="your_access_key"
$env:SAUCE_REGION_SHORT="eu-central"
$env:SAUCE_TUNNEL_NAME="angular20-a11y-tunnel"
$env:A11Y_BASE_URL="http://localhost:4200"
```

### macOS/Linux

```bash
export SAUCE_USERNAME="your_username"
export SAUCE_ACCESS_KEY="your_access_key"
export SAUCE_REGION_SHORT="eu-entral"
export SAUCE_TUNNEL_NAME="angular20-a11y-tunnel"
export A11Y_BASE_URL="http://localhost:4200"
```

## 3. Run the Angular application

```bash
npm start
```

Open:

```text
http://localhost:4200
```

The page intentionally contains accessibility defects so the first scan should fail. Devin can later remediate them.

## 4. Local Sauce Connect 5 tunnel

Because Sauce's cloud browser cannot directly reach your PC's localhost, run Sauce Connect 5 with the same tunnel name used in `sauce:options`.

Example Windows command after installing `sauce-connect.exe`:

```powershell
sauce-connect.exe run --tunnel-name angular20-a11y-tunnel --region us-west
```

For Sauce Connect 5, `tunnelName` is the current capability name. `tunnelIdentifier` is deprecated.

For a desktop virtual browser, `http://localhost:4200` can be proxied through Sauce Connect. For real iOS/Android devices, Sauce's localhost guidance requires a placeholder hostname rather than `localhost`/`127.0.0.1`.

Add this to your Windows hosts file as Administrator:

```text
127.0.0.1 localtestsite
```

Then use:

```powershell
$env:A11Y_BASE_URL="http://localtestsite:4200"
```

Start Sauce Connect with localhost proxying enabled when required by your environment:

```powershell
sauce-connect.exe run --tunnel-name angular20-a11y-tunnel --region us-west --proxy-localhost allow
```

## 5. Run accessibility test on Sauce Chrome

Keep Angular and Sauce Connect running, then:

```bash
npm run test:a11y:chrome
```

The test uses:

- Windows 11
- Chrome latest
- Sauce Labs
- WebdriverIO 9
- `@axe-core/webdriverio`
- WCAG 2.1 A/AA + best-practice tags

Reports are written under:

```text
reports/a11y/
```

## 6. Other targets

Desktop Safari:

```bash
npm run test:a11y:safari
```

iPhone 15 Safari:

```bash
npm run test:a11y:iphone
```

Galaxy S24 Chrome:

```bash
npm run test:a11y:android
```

Real-device execution requires the appropriate Sauce Labs Real Device/private-device entitlements. The supplied PDF's matrix uses iPad, Galaxy Tab, iPhone 15 and Galaxy S24.

## 7. Important intentional defects

The demo deliberately contains examples Devin should be able to identify and fix:

1. Icon-only menu button without an accessible name.
2. Image without `alt` text.
3. Text input without an associated label.
4. A very small mobile touch target.
5. Dialog is intentionally simple and does not yet implement complete focus management.

This makes the project useful as a remediation demo rather than a page that already passes.

## 8. Devin + Sauce MCP

The supplied PDF shows an environment-based `mcp_config.json`. The current Sauce MCP connection documentation uses a remote Streamable HTTP server with an HTTP Basic Authorization header. Use the latter for current Sauce MCP clients, especially because it avoids the 401 issue caused by credentials not being converted into the required HTTP header.

The endpoint is:

```text
https://mcp.saucelabs.com
```

The current connection headers are:

```text
Authorization: Basic <BASE64_OF_USERNAME_COLON_ACCESSKEY>
X-Sauce-Region: US_WEST
```

See `devin-sauce-mcp.example.json` for the project template. Never commit the real Base64 credential.

## 9. Verify Devin -> Sauce MCP

After configuring the MCP server in Devin, first ask:

```text
What's my Sauce Labs account information?
```

This is a good authentication smoke test because it does not require private-device access.

Then ask:

```text
Use Sauce Labs MCP to show my active tunnels and available browser/device targets.
```

## 10. Devin accessibility workflow

Give Devin this prompt first:

```text
You are working in the Angular 20 accessibility demo repository.

1. Inspect the Angular source and understand the existing app.
2. Do not change code yet.
3. Use Sauce Labs MCP to confirm my Sauce Labs account and active region.
4. Confirm that the angular20-a11y-tunnel is available.
5. Review tests/wdio.conf.js and tests/helpers/a11y-helper.js.
6. Explain how the accessibility test runs on Sauce Labs.
7. Identify the intentional accessibility defects in src/app/app.component.html.
```

Then execute:

```text
Run npm run test:a11y:chrome.
Use Sauce Labs MCP to inspect the resulting job, build, screenshots, HTML and logs.
Summarize every axe accessibility violation with:
- rule ID
- impact
- help text
- affected HTML target
- recommended Angular HTML/CSS change
Do not modify code yet.
```

Finally, for autonomous remediation:

```text
Fix the accessibility violations found by the Sauce Labs axe scan.

Rules:
1. Reuse the existing Angular component.
2. Make the smallest safe HTML/CSS change.
3. Preserve the existing visual intent.
4. Add accessible names/labels/alt text where required.
5. Ensure interactive mobile targets are at least 44x44 CSS pixels where applicable.
6. Improve dialog keyboard/focus behavior without changing the public behavior.
7. Run npm run build.
8. Run npm run test:a11y:chrome.
9. Use Sauce Labs MCP to inspect the new job and verify whether violations remain.
10. Show me the final diff and remaining violations.
```

## 11. What the first scan should demonstrate

Because the source is intentionally broken, the initial run should normally produce one or more axe violations. Exact violations can vary with the axe-core version and browser.

The useful Devin loop is:

```text
Angular source
    |
    v
WebdriverIO
    |
    v
Sauce Labs Chrome
    |
    v
axe-core scan
    |
    v
A11y JSON + Sauce job artifacts
    |
    v
Devin + Sauce MCP
    |
    v
Root-cause analysis
    |
    v
Angular HTML/CSS fix
    |
    v
Re-run on Sauce
    |
    v
Zero remaining violations
```

## 12. Files to know

```text
src/app/app.component.html       Intentional a11y defects
src/app/app.component.css        Responsive/mobile styles
src/app/app.component.ts         Angular component

tests/wdio.conf.js               Sauce Labs + WebdriverIO capabilities
tests/helpers/a11y-helper.js     Angular stability + axe wrapper
tests/specs/app.a11y.spec.js     Accessibility assertions

devin-sauce-mcp.example.json     Current remote Sauce MCP template
.env.example                     Environment variable template
.github/workflows/sauce-a11y.yml CI skeleton
```

## 13. Source alignment

The project follows the supplied guide's core implementation pattern: WebdriverIO + Sauce service + `@axe-core/webdriverio`, Angular stability before scanning, WCAG 2.1 A/AA tags, Sauce cross-device capabilities, and Devin/Sauce MCP prompts for setup, diagnosis and remediation.

The supplied guide's MCP example uses an `env` block. Current Sauce MCP documentation instead specifies HTTP Basic Auth in the `Authorization` header. That current header-based form should be used in Devin to avoid the 401 authentication problem.
