// Guards the standalone HTML deck against startup code that browsers block on file:// URLs.
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const deckUrl = new URL('../index.html', import.meta.url);
const source = await readFile(deckUrl, 'utf8');

test('core scaling and navigation bootstrap without a static module import', () => {
  const bootScript = source.match(/<script>([\s\S]*?const deck = [\s\S]*?)<\/script>/);

  assert.ok(bootScript, 'expected the core deck bootstrap in a classic script');
  assert.doesNotMatch(bootScript[1], /^\s*import\s/m);
  assert.match(bootScript[1], /function fit\(\)/);
  assert.match(bootScript[1], /function render\(\)/);
  assert.match(bootScript[1], /location\.protocol==='file:'/);
});

test('CSS centres the fixed canvas before JavaScript enhances its scale', () => {
  assert.match(
    source,
    /#deck\s*\{[^}]*transform:translate\(-50%,-50%\)/,
  );
});

test('the revised deck opens on a visible logo page and contains 13 slides', () => {
  assert.equal((source.match(/<article class="slide/g) ?? []).length, 13);
  assert.match(
    source,
    /<article class="slide logo-slide active"[^>]*>[\s\S]*?<div class="brand-lockup">/,
  );
});

test('every local image reference resolves from the standalone deck file', async () => {
  const paths = [...source.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length > 0, 'expected image references in the deck');
  await Promise.all(paths.map((path) => access(new URL(path, deckUrl))));
});
