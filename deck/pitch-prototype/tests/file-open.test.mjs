// Guards the standalone HTML deck against startup code that browsers block on file:// URLs.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');

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
