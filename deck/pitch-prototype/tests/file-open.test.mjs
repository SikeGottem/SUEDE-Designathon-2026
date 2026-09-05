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

test('the revised deck opens on a visible logo page and contains 10 live slides', () => {
  assert.equal((source.match(/<article class="slide/g) ?? []).length, 10);
  assert.match(
    source,
    /<article class="slide logo-slide active"[^>]*>[\s\S]*?<div class="brand-lockup">/,
  );
  assert.doesNotMatch(source, /11\s*\/\s*\d+/);
  assert.doesNotMatch(source, /data-title="(?:Team|Thank you|Thanks)"/i);
});

test('the latest meeting framing replaces attribution and unsupported market claims', () => {
  assert.match(source, /We appreciate our friends and family\. We just do not always show it/);
  assert.doesNotMatch(source, /Chloe put the problem this way/);
  assert.doesNotMatch(source, /Our first market/);
  assert.doesNotMatch(source, /digital card/);
});

test('the final research, audience, and demo markup keeps the agreed presentation structure', () => {
  const researchSlide = source.match(/<article class="slide research-slide"[\s\S]*?<\/article>/)?.[0] ?? '';

  assert.match(source, /data-title="Research findings" data-steps="4"/);
  assert.match(source, /class="research-number">82%/);
  assert.match(source, /class="research-number">71%/);
  assert.doesNotMatch(source, /Does the expression gap exist\?|Why does it stay unspoken\?|How do the forms compare\?/);
  assert.doesNotMatch(source, /<span>what<\/span>|<span>why<\/span>|<span>how<\/span>/);
  assert.doesNotMatch(source, /\.research-job \{[^}]*border-top/);
  assert.doesNotMatch(source, /\.research-answer \{[^}]*border-top/);
  assert.match(source, /feel they do not fully show the appreciation they feel/);
  assert.match(researchSlide, /class="research-job has-ledger build"/);
  assert.match(researchSlide, /class="comparison-ledger"/);
  assert.equal((researchSlide.match(/class="ledger-row/g) ?? []).length, 3);
  assert.doesNotMatch(researchSlide, /mini-ratings-table|has-table/);
  for (const score of ['2.2', '1.0', '4.7', '3.5', '2.1', '3.6', '4.3', '1.2']) {
    assert.match(source, new RegExp(`>${score.replace('.', '\\.')}(?:<|$)`));
  }
  assert.equal((source.match(/>4\.7</g) ?? []).length, 2, 'frequency and impact ratings retain both 4.7 values');
  assert.equal((source.match(/class="target-score"/g) ?? []).length, 3);
  assert.doesNotMatch(source, /class="practice-flag"/);
  assert.doesNotMatch(source, /research-bridge/);
  assert.match(source, /Who sits in the gap\?/);
  assert.match(source, /<span>text<\/span>[\s\S]*?too awkward[\s\S]*?too casual/);
  assert.match(source, /<span>letter \/ gift<\/span>[\s\S]*?too much[\s\S]*?high friction · inaccessible/);
  assert.match(source, /<h2>They care\.<\/h2>[\s\S]*?appreciation[\s\S]*?stays unspoken/);
  assert.match(source, /class="audience-groups"[\s\S]*uni students[\s\S]*long-distance connections[\s\S]*close friends[\s\S]*close family/);
  assert.match(source, /class="audience-ring left[\s\S]*class="audience-ring right[\s\S]*class="audience-zone left[\s\S]*class="audience-zone center[\s\S]*class="audience-zone right/);
  assert.doesNotMatch(source, /class="audience-target/);
  assert.doesNotMatch(source, /Grandmother|Granddaughter/);
  assert.match(source, /data-title="Live demo" data-steps="0"[\s\S]*?class="demo-follow"/);
  assert.match(source, /assets\/live-demo-qr\.svg/);
  assert.match(source, /warm-and-fuzzies\.vercel\.app\/demo/);
  assert.match(source, /10\s*\/\s*10/);
  assert.doesNotMatch(source, /demo-sequence/);
  assert.doesNotMatch(source, /Live prototype · no video/);
  assert.match(source, /Warm &amp; Fuzzies is a private digital keepsake that brings the[\s\S]*thoughtfulness of a letter[\s\S]*ease of a text/);
  assert.doesNotMatch(source, /assets\/current-home\.png/);
  assert.doesNotMatch(source, /solution-detail|device-wrap/);
});

test('the latest review uses a problem-first opener and preserves the full synthesis', () => {
  assert.match(source, /When was the last time you showed someone appreciation or gratitude\?/);
  assert.doesNotMatch(source, /When was the last time someone showed you appreciation/);
  assert.doesNotMatch(source, /appreciation—not for a birthday or event/);
  assert.doesNotMatch(source, /When was the last time you sent or received a letter/);
  assert.match(source, /Is everything okay\?/);
  assert.match(source, /class="audience-groups"[\s\S]*uni students[\s\S]*long-distance connections[\s\S]*close friends[\s\S]*close family/);
  assert.match(source, /data-title="Research synthesis" data-steps="4"/);
  assert.match(source, /<span>if<\/span>[\s\S]*<span>and<\/span>[\s\S]*<span>then<\/span>[\s\S]*<span>therefore<\/span>/);
  assert.match(source, /Make showing appreciation feel normal on an ordinary day\./);
  assert.match(source, /Create the impact of gift-giving, with the low friction and repeatability of everyday digital contact\./);
  assert.match(source, /10 \/ 10/);
  assert.doesNotMatch(source, />75%</);
});

test('the channel map reveals local evidence with disclosed rehearsal ratings', () => {
  assert.equal((source.match(/class="plot-evidence"/g) ?? []).length, 3);
  assert.match(source, /data-title="The channel gap" data-steps="4"/);
  assert.match(source, /voice note \/ video call/);
  assert.match(source, /handwritten letter \/ physical gift/);
  assert.match(source, /assets\/channel-quick-text\.svg/);
  assert.match(source, /assets\/channel-voice-video\.svg/);
  assert.match(source, /assets\/illustrations\/cecilia\/envelope-mail-02\.png/);
  assert.match(source, /class="plot target build"[\s\S]*?assets\/illustrations\/cecilia\/firefly-brand-mark\.png/);
  assert.match(source, /width:calc\(var\(--freq,24px\) \+ 42px\)/);
  assert.match(source, /\.plot\.target \.plot-marker::before[\s\S]*?background:var\(--ink\)[\s\S]*?mask:url\('\.\.\/\.\.\/prototype\/public\/assets\/illustrations\/cecilia\/firefly-brand-mark\.png'\)/);
  assert.doesNotMatch(source, /class="evidence-dock"/);
  assert.match(source, /Kumar &amp; Epley, 2021/);
  assert.match(source, /Kumar &amp; Epley, 2018/);
  assert.match(source, /Algoe et al., 2008/);
  assert.match(source, /Temporary grouped positions—not findings/);
  assert.doesNotMatch(source, /class="practice-ratings"/);
  assert.doesNotMatch(source, /quick text<small>2\.2/);
  assert.match(source, /<strong>goldilocks zone<\/strong><small>high impact · low friction · repeatable<\/small>/);
  assert.match(source, /--accent:#081f4d/);
  assert.match(source, /--accent-ink:#254878/);
  assert.match(source, /--accent-on-ink:#a8c5ee/);
  assert.doesNotMatch(source, /#94a550|#5b682f/i);
  assert.doesNotMatch(source, /#b56d5f|#eda343/i);
  assert.doesNotMatch(source, /find digital channels too slight/);
  assert.doesNotMatch(source, /highest friction · occasion-coded/);
  assert.doesNotMatch(source, /hypothesis to test/i);
});

test('every local image reference resolves from the standalone deck file', async () => {
  const paths = [...source.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length > 0, 'expected image references in the deck');
  await Promise.all(paths.map((path) => access(new URL(path, deckUrl))));
});
