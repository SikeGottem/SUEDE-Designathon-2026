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

test('the revised deck opens on a visible logo page and contains 11 live slides', () => {
  assert.equal((source.match(/<article class="slide/g) ?? []).length, 11);
  assert.match(
    source,
    /<article class="slide logo-slide active"[^>]*>[\s\S]*?<div class="brand-lockup">/,
  );
});

test('the latest meeting framing replaces attribution and unsupported market claims', () => {
  assert.match(source, /We appreciate our friends and family\. We just do not always show it/);
  assert.doesNotMatch(source, /Chloe put the problem this way/);
  assert.doesNotMatch(source, /Our first market/);
  assert.doesNotMatch(source, /digital card/);
});

test('the newest follow-up simplifies research, restores personas and clears the demo slide', () => {
  assert.match(source, /class="research-number">___%/);
  assert.match(source, /feel they do not fully show the appreciation they feel/);
  assert.doesNotMatch(source, /research-bridge/);
  assert.match(source, /Grandmother[\s\S]*Granddaughter/);
  assert.match(source, /Grandmother makes it now\. Granddaughter opens it later\./);
  assert.match(source, /data-title="Live demo" data-steps="0"[\s\S]*?<h2>Let us show you\.<\/h2>/);
  assert.doesNotMatch(source, /demo-sequence/);
  assert.doesNotMatch(source, /Live prototype · no video/);
});

test('the latest review uses a problem-first opener and adds the synthesis bridge', () => {
  assert.match(source, /When was the last time someone showed you appreciation or gratitude\?/);
  assert.doesNotMatch(source, /appreciation—not for a birthday or event/);
  assert.doesNotMatch(source, /When was the last time you sent or received a letter/);
  assert.match(source, /Is everything okay\?/);
  assert.match(source, /different time zones/);
  assert.match(source, /data-title="Research synthesis"[\s\S]*<span>if<\/span>[\s\S]*<span>and<\/span>[\s\S]*<span>then<\/span>/);
  assert.match(source, /Make showing appreciation feel normal on an ordinary day\./);
  assert.match(source, /11 \/ 11/);
  assert.doesNotMatch(source, />75%</);
});

test('every local image reference resolves from the standalone deck file', async () => {
  const paths = [...source.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length > 0, 'expected image references in the deck');
  await Promise.all(paths.map((path) => access(new URL(path, deckUrl))));
});
