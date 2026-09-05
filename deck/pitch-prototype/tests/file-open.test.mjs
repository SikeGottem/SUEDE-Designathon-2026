// Guards the standalone HTML deck against startup code that browsers block on file:// URLs.
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const deckUrl = new URL('../index.html', import.meta.url);
const refinementsUrl = new URL('../refinements.css', import.meta.url);
const demoQrUrl = new URL('../assets/live-demo-qr.svg', import.meta.url);
const source = await readFile(deckUrl, 'utf8');
const refinements = await readFile(refinementsUrl, 'utf8');
const demoQr = await readFile(demoQrUrl, 'utf8');

test('core scaling and navigation bootstrap without a static module import', () => {
  const bootScript = source.match(/<script>([\s\S]*?const deck = [\s\S]*?)<\/script>/);

  assert.ok(bootScript, 'expected the core deck bootstrap in a classic script');
  assert.doesNotMatch(bootScript[1], /^\s*import\s/m);
  assert.match(bootScript[1], /function fit\(\)/);
  assert.match(bootScript[1], /function render\(\)/);
  assert.match(bootScript[1], /location\.protocol==='file:'/);
  assert.match(bootScript[1], /step=Math\.min\(Number\(slides\[index\]\.dataset\.steps\)\|\|0/);
  assert.match(source, /id="deck-announcer"[^>]*role="status"[^>]*aria-live="polite"/);
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
  assert.match(source, /class="cover-thesis">Rethinking when we show appreciation\.<\/p>/);
  assert.match(source, /11\s*\/\s*11/);
  assert.doesNotMatch(source, /12\s*\/\s*\d+/);
  assert.doesNotMatch(source, /data-title="(?:Team|Thank you|Thanks)"/i);
});

test('the merged framing slide stages the occasion rule from the starting hypothesis', () => {
  const framingSlide = source.match(/<article class="slide framing-slide occasion-slide"[\s\S]*?<\/article>/)?.[0] ?? '';

  assert.match(framingSlide, /data-title="Where our framing changed" data-steps="4"/);
  assert.match(framingSlide, /class="framing-origin"[\s\S]*?class="problem-origin">where we started<\/p>/);
  assert.match(framingSlide, /We appreciate our friends and family\. We just do not always[\s\S]*?class="problem-emphasis">show it\.<\/span>/);
  assert.match(framingSlide, /class="framing-discovery build" data-step="2"[\s\S]*?The unwritten rule: appreciation needs an occasion\./);
  assert.match(framingSlide, /class="occasion-side event-side"[\s\S]*?<p class="occasion-kind">event<\/p>[\s\S]*?<strong>celebration \/ milestone<\/strong>[\s\S]*?<ul><li>expected<\/li><li>socially understood<\/li><li>a clear prompt<\/li><\/ul>/);
  assert.match(framingSlide, /class="occasion-side ordinary-side build" data-step="3"[\s\S]*?<p class="occasion-kind">ordinary day<\/p>[\s\S]*?<strong>no obvious prompt<\/strong>[\s\S]*?<ul><li>awkward<\/li><li>too much<\/li><li>intense<\/li><\/ul>/);
  assert.match(framingSlide, /<strong>How might we<\/strong> make ordinary-day appreciation easier to send\?/);
  assert.equal((source.match(/class="slide framing-slide occasion-slide"/g) ?? []).length, 1);
  assert.doesNotMatch(source, /class="slide problem-slide"/);
  assert.doesNotMatch(source, /Chloe put the problem this way/);
  assert.doesNotMatch(source, /Our first market/);
  assert.doesNotMatch(source, /digital card/);
});

test('the final research, audience, and demo markup keeps the agreed presentation structure', () => {
  const researchSlide = source.match(/<article class="slide research-slide"[\s\S]*?<\/article>/)?.[0] ?? '';

  assert.match(source, /data-title="Research findings" data-steps="4"/);
  assert.match(source, /class="research-title">Survey results<\/h2>/);
  assert.match(source, /class="research-dimension">what<\/span>[\s\S]*?class="research-dimension">why<\/span>[\s\S]*?class="research-dimension">how<\/span>/);
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
  assert.match(source, /data-title="The market gap" data-steps="3"/);
  assert.match(source, /<span>text<\/span>[\s\S]*?too awkward[\s\S]*?too casual/);
  assert.match(source, /<span>letter \/ gift<\/span>[\s\S]*?too much[\s\S]*?high friction · inaccessible/);
  assert.match(source, /class="audience-ring left[\s\S]*class="audience-ring right[\s\S]*class="audience-zone left[\s\S]*class="audience-zone center market-gap[\s\S]*class="audience-zone right/);
  assert.match(source, /class="market-gap-wash build" data-step="3"/);
  assert.match(source, /class="audience-zone center market-gap build" data-step="3">\s*<h2>Users are stuck in limbo\.<\/h2>/);
  assert.doesNotMatch(source, /market-gap-label/);
  assert.doesNotMatch(source, /market-gap-consequence|Neither option fits an ordinary day/);
  assert.match(source, /Working need-state hypothesis—not validated market sizing or demand\./);
  assert.doesNotMatch(source, /Grandmother|Granddaughter/);
  assert.match(source, /data-title="One use case" data-steps="3"/);
  assert.match(source, /data-title="Live demo" data-steps="0"[\s\S]*?class="demo-follow"/);
  assert.match(source, /assets\/live-demo-qr\.svg/);
  assert.match(source, /warm-and-fuzzies\.vercel\.app\/demo\/receive/);
  assert.match(demoQr, /Encoding-verified receiver demo QR: https:\/\/warm-and-fuzzies\.vercel\.app\/demo\/receive/);
  assert.match(demoQr, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(source, /11\s*\/\s*11/);
  assert.doesNotMatch(source, /demo-sequence/);
  assert.doesNotMatch(source, /Live prototype · no video/);
  assert.match(source, /Warm &amp; Fuzzies is a personal digital keepsake that brings the[\s\S]*thoughtfulness of a letter[\s\S]*ease of a text/);
  assert.doesNotMatch(source, /assets\/current-home\.png/);
  assert.doesNotMatch(source, /solution-detail|device-wrap/);
});

test('the approved process narrative uses one active focus at a time', () => {
  assert.match(source, /The unwritten rule: appreciation needs an occasion\./);
  assert.match(source, /Where our framing changed/);
  assert.match(source, /Psychology gave us three mechanisms to test\./);
  assert.match(source, /mechanisms, not verdicts/);
  assert.match(source, /Goldilocks zone are working hypotheses/);
  assert.match(refinements, /\.framing-slide:is\(\[data-current-step="2"\],\[data-current-step="3"\],\[data-current-step="4"\]\) \.framing-origin/);
  assert.match(refinements, /\.framing-slide\[data-current-step="4"\] \.framing-heading/);
  assert.match(refinements, /\.matrix-slide\[data-current-step="4"\] \.plot:not\(\.target\)/);
  assert.match(refinements, /opacity: \.42/);
});

test('the Goldilocks market gap and Maya use case remain separate and explicitly provisional', () => {
  const audienceSlide = source.match(/<article class="slide audience-slide"[\s\S]*?<\/article>/)?.[0] ?? '';
  const mayaSlide = source.match(/<article class="slide maya-slide"[\s\S]*?<\/article>/)?.[0] ?? '';

  assert.match(audienceSlide, /data-steps="3"/);
  assert.match(audienceSlide, /class="audience-ring left build" data-step="1"/);
  assert.match(audienceSlide, /class="audience-ring right build" data-step="2"/);
  assert.match(audienceSlide, /class="market-gap-wash build" data-step="3"/);
  assert.match(audienceSlide, /Users are stuck in limbo\./);
  assert.doesNotMatch(audienceSlide, /market-gap-consequence|Neither option fits an ordinary day/);
  assert.match(audienceSlide, /Working need-state hypothesis—not validated market sizing or demand\./);
  assert.doesNotMatch(audienceSlide, /Maya|illustrative use case/);
  assert.match(mayaSlide, /data-steps="3"/);
  assert.match(mayaSlide, /one illustrative use case/);
  assert.match(mayaSlide, /Maya<\/em> wants to thank someone for being so friendly during her first week at uni\./);
  assert.match(mayaSlide, /class="maya-moment build" data-step="1">It is an <em>ordinary Tuesday\.<\/em>/);
  assert.match(mayaSlide, /class="maya-stat build" data-step="2"><span class="maya-stat-side">text side<\/span><strong>72%<\/strong><p>said a text can feel too casual for meaningful appreciation\.<\/p>/);
  assert.match(mayaSlide, /class="maya-stat second build" data-step="3"><span class="maya-stat-side">gift side<\/span><strong>78%<\/strong><p>said they have never received a gift “just because\.”<\/p>/);
  assert.match(mayaSlide, /Maya is one of many people caught between these two options\./);
  assert.match(mayaSlide, /72% and 78% are rehearsal placeholders—not verified primary-research findings\. Maya is illustrative\./);
});

test('the solution and product differentiation explain expressive range and the combined format', () => {
  const solutionSlide = source.match(/<article class="slide solution-slide"[\s\S]*?<\/article>/)?.[0] ?? '';
  const outcomeSlide = source.match(/<article class="slide product-outcomes-slide"[\s\S]*?<\/article>/)?.[0] ?? '';

  assert.match(solutionSlide, /data-steps="1"/);
  assert.match(solutionSlide, /Warm &amp; Fuzzies is a personal digital keepsake that brings the[\s\S]*thoughtfulness of a letter[\s\S]*ease of a text/);
  assert.match(solutionSlide, /Because <em>digital<\/em> can hold more than words\./);
  for (const medium of ['writing', 'photo', 'voice', 'video', 'song']) {
    assert.match(solutionSlide, new RegExp(`>${medium}<`));
  }
  assert.match(solutionSlide, /<svg viewBox="0 0 64 64"/);
  assert.match(solutionSlide, /class="expressive-media"/);
  assert.doesNotMatch(solutionSlide, /keepsake-paper|for Maya|one thought, in the form it needs/);
  assert.doesNotMatch(solutionSlide, /emoji|🏷|🎵|📷/u);
  assert.match(outcomeSlide, /data-title="How the product answers the gap" data-steps="4"/);
  assert.match(outcomeSlide, /How Warm &amp; Fuzzies answers the gap\./);
  assert.equal((outcomeSlide.match(/class="response-row build"/g) ?? []).length, 4);
  assert.match(outcomeSlide, /handwritten letter[\s\S]*an authored canvas[\s\S]*personal, not generic/);
  assert.match(outcomeSlide, /mixed media[\s\S]*five media types in one keepsake[\s\S]*writing · photo · voice · video · song/);
  assert.match(outcomeSlide, /one direct browser link[\s\S]*no receiver account · no download[\s\S]*opens without setup/);
  assert.match(outcomeSlide, /receiver-controlled keepsake[\s\S]*keep · revisit · remove[\s\S]*the receiver decides what remains/);
  assert.match(outcomeSlide, /class="response-summary build" data-step="4"[\s\S]*firefly-carrying-envelope\.png/);
  assert.match(outcomeSlide, /impact[\s\S]*low friction[\s\S]*repeatability/);
  assert.match(outcomeSlide, /Goldilocks outcomes are design targets, not measured results · receiver control is not legal ownership or permanent storage/);
  assert.doesNotMatch(source, /resolution-ring|resolution-core|Venn|product-(?:make|share|receive)\.png|current-home\.png|product-mechanics-slide|solution-detail|device-wrap/);
  assert.match(refinements, /:fullscreen #hud,[\s\S]*:fullscreen #progress,[\s\S]*:fullscreen \.skip,[\s\S]*:fullscreen \.status/);
});

test('the latest review uses a problem-first opener and preserves the full synthesis', () => {
  assert.match(source, /When was the last time you showed someone appreciation or gratitude\?/);
  assert.doesNotMatch(source, /When was the last time someone showed you appreciation/);
  assert.doesNotMatch(source, /appreciation—not for a birthday or event/);
  assert.doesNotMatch(source, /When was the last time you sent or received a letter/);
  assert.match(source, /The unwritten rule: appreciation needs an occasion\./);
  assert.match(source, /<p class="occasion-kind">event<\/p>[\s\S]*?<strong>celebration \/ milestone<\/strong>[\s\S]*?<ul><li>expected<\/li><li>socially understood<\/li><li>a clear prompt<\/li><\/ul>/);
  assert.match(source, /<p class="occasion-kind">ordinary day<\/p>[\s\S]*?<strong>no obvious prompt<\/strong>[\s\S]*?<ul><li>awkward<\/li><li>too much<\/li><li>intense<\/li><\/ul>/);
  assert.match(source, /Kumar &amp; Epley, 2018 · Givi &amp; Galak, 2022/);
  assert.doesNotMatch(source, /class="occasion-mark"|occasion-sequence|birthday<\/strong>|farewell<\/strong>/);
  assert.doesNotMatch(source, /Is everything okay\?/);
  assert.match(source, /data-title="The market gap" data-steps="3"/);
  assert.match(source, /Users are stuck in limbo\./);
  assert.doesNotMatch(source, /market-gap-consequence|Neither option fits an ordinary day/);
  assert.match(source, /data-title="One use case" data-steps="3"/);
  assert.match(source, /Maya<\/em> wants to thank someone for being so friendly during her first week at uni\./);
  assert.match(source, /72% and 78% are rehearsal placeholders—not verified primary-research findings\. Maya is illustrative\./);
  assert.doesNotMatch(source, /no ready-made script/);
  assert.doesNotMatch(source, /Senders can overestimate awkwardness\./);
  assert.doesNotMatch(source, /Ordinary-day care can still be welcome\./);
  assert.match(source, /Contexts: university students · long-distance family · close friends/);
  assert.match(source, /data-title="Research synthesis" data-steps="4"[\s\S]*?08 \/ 11/);
  assert.match(source, /data-title="Warm (?:&|&amp;) Fuzzies" data-steps="1"[\s\S]*?09 \/ 11/);
  assert.equal((source.match(/class="slide synthesis-slide"/g) ?? []).length, 1);
  assert.equal((source.match(/class="slide solution-slide"/g) ?? []).length, 1);
  assert.match(source, /<span>if<\/span>[\s\S]*<span>and<\/span>[\s\S]*<span>then<\/span>[\s\S]*<span>therefore<\/span>/);
  assert.match(source, /Make showing appreciation feel normal on an ordinary day\./);
  assert.match(source, /Create the impact of gift-giving, with the low friction and repeatability of everyday digital contact\./);
  assert.match(source, /11 \/ 11/);
  assert.doesNotMatch(source, />75%</);
});

test('the channel map reveals local evidence with disclosed rehearsal ratings', () => {
  const mapSlide = source.match(/<article class="slide matrix-slide"[\s\S]*?<\/article>/)?.[0] ?? '';

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
  assert.doesNotMatch(mapSlide, /Kumar &amp; Epley, 2018/);
  assert.match(source, /Algoe et al., 2008/);
  assert.match(source, /Tone can be misread\./);
  assert.match(source, /Voice can feel closer\./);
  assert.match(source, /Thoughtfulness matters more than price\./);
  assert.match(source, /mechanisms, not verdicts/);
  assert.match(source, /font-size:25px[\s\S]*?color:var\(--ink\)/);
  assert.match(source, /Published studies support the mechanism labels/);
  assert.doesNotMatch(source, /class="practice-ratings"/);
  assert.doesNotMatch(source, /quick text<small>2\.2/);
  assert.match(source, /<strong>goldilocks zone<\/strong><small>high impact · low friction · repeatable<\/small>/);
  assert.match(source, /class="ledger-header"[\s\S]*?impact \/ 5[\s\S]*?friction \/ 5[\s\S]*?frequency \/ 5/);
  assert.match(source, /Temporary rehearsal figures—not survey findings\. Replace before judging\./);
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
