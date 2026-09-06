// Guards the standalone appendix so it cannot change the 11-slide live-pitch route.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { access, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const repoRoot = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const deckRoot = join(repoRoot, 'deck/pitch-prototype');
const mainDeckPath = join(deckRoot, 'index.html');
const appendixPath = join(deckRoot, 'appendix.html');
const prototypeRequire = createRequire(new URL('../../../prototype/package.json', import.meta.url));

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const relativePath = requestPath === '/' ? 'deck/pitch-prototype/index.html' : requestPath.replace(/^\/+/, '');
    const absolutePath = resolve(repoRoot, normalize(relativePath));

    if (!absolutePath.startsWith(`${repoRoot}/`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      if (!(await stat(absolutePath)).isFile()) throw new Error('Not a file');
      response.writeHead(200, { 'content-type': contentTypes[extname(absolutePath)] ?? 'application/octet-stream' });
      response.end(await readFile(absolutePath));
    } catch {
      response.writeHead(404).end('Not found');
    }
  });

  await new Promise((resolveReady) => server.listen(0, '127.0.0.1', resolveReady));
  const address = server.address();
  assert.ok(address && typeof address !== 'string', 'static server should bind to a TCP port');
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolveClosed) => server.close(resolveClosed)),
  };
}

test('appendix is a separate 13-page route and cannot change the live deck count', async () => {
  await access(appendixPath);
  const [mainDeck, appendix] = await Promise.all([readFile(mainDeckPath, 'utf8'), readFile(appendixPath, 'utf8')]);

  assert.equal((mainDeck.match(/<article class="slide/g) ?? []).length, 11, 'the judged route remains 11 slides');
  assert.match(mainDeck, /11\s*\/\s*11/);
  assert.doesNotMatch(mainDeck, /<article class="appendix-slide/);
  assert.doesNotMatch(mainDeck, /appendix\.html/);

  const expectedPageIds = Array.from({ length: 13 }, (_, index) => `A${index + 1}`);
  assert.equal((appendix.match(/<article class="appendix-slide/g) ?? []).length, 13, 'appendix contains 13 separately numbered pages');
  assert.deepEqual(
    [...appendix.matchAll(/<article class="appendix-slide[^>]*\sid="(A\d+)"/g)].map((match) => match[1]),
    expectedPageIds,
    'appendix page IDs should be complete and sequential',
  );
  assert.match(appendix, /A1\s*\/\s*A13/);
  assert.match(appendix, /A7\s*\/\s*A13/);
  assert.match(appendix, /new URLSearchParams\(location\.search\)/);
  assert.match(appendix, /params\.get\(['"]slide['"]\)/);
  assert.match(appendix, /(?:index\.html\?slide=11(?:&|&amp;)step=0|index\.html\?slide=11)/);
  assert.equal((appendix.match(/data-primary-research-slot="true"/g) ?? []).length, 1, 'appendix exposes exactly one controlled primary-research insertion slot');
  assert.match(appendix, /question and scale endpoints are not legible/i, 'the held survey capture must state why it is not yet safe to claim');
  assert.doesNotMatch(appendix, /(?:82|71|59\.3|33\.3)%/, 'unverified and rehearsal survey percentages must stay out of the appendix');
  assert.match(appendix, /Anyone with the bearer link can open it\./, 'appendix must disclose the bearer-link privacy boundary');
  assert.match(appendix, /Local photo, video, voice, or song files cannot travel across devices\./, 'appendix must disclose the local-media transport boundary');
  assert.match(appendix, /Release gate before 2 PM/, 'appendix must preserve the final live-demo release gate');
  assert.match(appendix, /This protocol has not yet been run\./, 'planned matched-format testing cannot be presented as completed evidence');

  const localImages = [...appendix.matchAll(/<img\s+[^>]*src="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((source) => !/^(?:data:|https?:)/.test(source));
  await Promise.all(localImages.map((source) => access(resolve(deckRoot, source))));
});

test('main deck hard-stops at slide 11 while appendix deep-links to A7 and returns to slide 11', async (t) => {
  try {
    await access(appendixPath);
  } catch {
    t.skip('appendix.html has not landed yet');
    return;
  }

  let chromium;
  try {
    ({ chromium } = prototypeRequire('playwright'));
  } catch {
    t.skip('Playwright is not installed in prototype/node_modules');
    return;
  }

  const staticServer = await startStaticServer();
  let browser;
  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      t.skip(`Playwright browser is unavailable: ${error.message.split('\n')[0]}`);
      return;
    }

    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()}`));

    await page.goto(`${staticServer.origin}/deck/pitch-prototype/index.html?slide=11&step=0`, { waitUntil: 'networkidle' });
    await assertPageLabel(page, '.slide.active .status', '11 / 11');
    const mainUrl = page.url();
    for (const key of ['ArrowRight', 'Space', 'Enter', 'End']) {
      await page.keyboard.press(key);
      await assertPageLabel(page, '.slide.active .status', '11 / 11');
      assert.equal(page.url(), mainUrl, `main deck must not advance from slide 11 after ${key}`);
    }

    await page.goto(`${staticServer.origin}/deck/pitch-prototype/appendix.html?slide=A7`, { waitUntil: 'networkidle' });
    await assertPageLabel(page, '.page-counter', 'A7 / A13');
    assert.match(page.url(), /appendix\.html\?slide=A7$/);

    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.className), 'skip-link');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'appendix-stage', 'skip link should move focus to the appendix stage');

    await page.keyboard.press('i');
    assert.equal(await page.locator('#appendix-index').getAttribute('aria-hidden'), 'false');
    assert.equal(await page.locator('.index-button').getAttribute('aria-expanded'), 'true');
    assert.deepEqual(
      await page.locator('[data-jump]').evaluateAll((buttons) => buttons.map((button) => button.dataset.jump)),
      Array.from({ length: 13 }, (_, index) => `A${index + 1}`),
      'index jump IDs should exactly match appendix page IDs in order',
    );
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-jump')), 'A7', 'index should focus the current page');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#appendix-index').getAttribute('aria-hidden'), 'true');

    await page.keyboard.press('ArrowRight');
    await assertPageLabel(page, '.page-counter', 'A8 / A13');
    await page.keyboard.press('Home');
    await assertPageLabel(page, '.page-counter', 'A1 / A13');
    await page.keyboard.press('End');
    await assertPageLabel(page, '.page-counter', 'A13 / A13');
    await page.keyboard.press('ArrowRight');
    await assertPageLabel(page, '.page-counter', 'A13 / A13');

    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.appendix-slide').evaluateAll((slides) => slides.filter((slide) => getComputedStyle(slide).display !== 'none').length), 13, 'print media should expose every appendix page');
    await page.emulateMedia({ media: 'screen' });

    const returnLink = page.locator('a[href*="index.html?slide=11"]');
    assert.equal(await returnLink.count(), 1, 'appendix should expose exactly one deterministic return-to-main link');
    await returnLink.click();
    await page.waitForURL(/index\.html\?slide=11/);
    await assertPageLabel(page, '.slide.active .status', '11 / 11');
    assert.deepEqual(errors, [], `standalone main and appendix routes must have no page/network errors:\n${errors.join('\n')}`);
  } finally {
    await browser?.close();
    await staticServer.close();
  }
});

test('appendix remains complete when opened directly from the filesystem', async (t) => {
  let chromium;
  try {
    ({ chromium } = prototypeRequire('playwright'));
  } catch {
    t.skip('Playwright is not installed in prototype/node_modules');
    return;
  }

  let browser;
  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      t.skip(`Playwright browser is unavailable: ${error.message.split('\n')[0]}`);
      return;
    }

    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()}`));

    await page.goto(`${pathToFileURL(appendixPath).href}?slide=A7`, { waitUntil: 'load' });
    await assertPageLabel(page, '.page-counter', 'A7 / A13');
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    const brokenImages = await page.locator('img').evaluateAll((images) => images.filter((image) => image.naturalWidth === 0).map((image) => image.src));
    assert.deepEqual(brokenImages, [], `all direct-file appendix images should load:\n${brokenImages.join('\n')}`);
    assert.deepEqual(errors, [], `direct-file appendix should have no page/network errors:\n${errors.join('\n')}`);
  } finally {
    await browser?.close();
  }
});

async function assertPageLabel(page, selector, text) {
  const label = page.locator(selector).first();
  await label.waitFor({ state: 'attached' });
  assert.equal((await label.textContent())?.trim(), text);
}
