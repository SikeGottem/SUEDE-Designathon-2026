// This Playwright callback applies the same functional, responsive and motion checks to every blind design-skill candidate.
async (page) => {
  const candidate = page.url().split('/')[3];
  const outputRoot = `output/playwright/design-skill-benchmark/${candidate}`;
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const visible = async (role, name) => {
    const locator = page.getByRole(role, { name });
    if (await locator.count() !== 1 || !await locator.isVisible()) {
      throw new Error(`Expected one visible ${role} matching ${name}`);
    }
    return locator;
  };

  const activate = async (name) => {
    const control = await visible('button', name);
    await control.focus();
    await control.press('Enter');
    await page.waitForTimeout(120);
    return page.evaluate(() => {
      const element = document.activeElement;
      const style = getComputedStyle(element);
      return {
        tag: element?.tagName,
        label: (element?.textContent || element?.getAttribute?.('aria-label') || '').trim().slice(0, 120),
        focusVisible: element?.matches?.(':focus-visible') || false,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
  };

  const layoutEvidence = async () => page.evaluate(() => {
    const root = document.documentElement;
    const controls = [...document.querySelectorAll('button, a[href]')]
      .filter((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
      })
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          label: (element.textContent || element.getAttribute('aria-label') || '').trim(),
          width: Math.round(box.width),
          height: Math.round(box.height),
        };
      });
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { width: root.scrollWidth, height: root.scrollHeight },
      horizontalOverflow: root.scrollWidth > innerWidth + 1,
      undersizedControls: controls.filter((control) => control.width < 44 || control.height < 44),
    };
  });

  const runFlow = async (suffix) => {
    const states = { ready: await layoutEvidence() };
    const transitionFocus = {};
    await page.screenshot({ path: `${outputRoot}/ready-${suffix}.png`, fullPage: true });
    transitionFocus.start = await activate(/Start relay with Jo/i);
    await visible('button', /I.?m okay/i);
    states.active = await layoutEvidence();
    await page.screenshot({ path: `${outputRoot}/active-${suffix}.png`, fullPage: true });
    transitionFocus.checkin = await activate(/I.?m okay/i);
    await page.waitForFunction(() => /check-in (shared|recorded)|manual check-in/i.test(document.body.innerText));
    transitionFocus.loss = await activate(/simulate signal loss/i);
    await page.getByRole('heading', { name: /Signal paused\. You still have a plan\./i }).waitFor({ state: 'visible' });
    await page.getByText(/saved your last checkpoint and will retry automatically/i).first().waitFor({ state: 'visible' });
    states.lost = await layoutEvidence();
    await page.screenshot({ path: `${outputRoot}/lost-${suffix}.png`, fullPage: true });
    transitionFocus.fallback = await activate(/Use SMS fallback/i);
    await page.getByText(/SMS queued to Jo/i).first().waitFor({ state: 'visible' });
    states.fallback = await layoutEvidence();
    await page.screenshot({ path: `${outputRoot}/fallback-${suffix}.png`, fullPage: true });
    transitionFocus.restore = await activate(/restore connection/i);
    await page.getByText(/Connection strong/i).first().waitFor({ state: 'visible' });
    states.restored = await layoutEvidence();
    await page.screenshot({ path: `${outputRoot}/restored-${suffix}.png`, fullPage: true });
    transitionFocus.arrive = await activate(/arrived/i);
    await page.getByRole('heading', { name: /Made it\./i }).waitFor({ state: 'visible' });
    await page.getByText(/Jo knows you.?re home\. Relay is off\./i).first().waitFor({ state: 'visible' });
    states.arrived = await layoutEvidence();
    await page.screenshot({ path: `${outputRoot}/arrived-${suffix}.png`, fullPage: true });
    transitionFocus.replay = await activate(/Replay journey/i);
    await visible('button', /Start relay with Jo/i);
    states.replay = await layoutEvidence();
    return { states, transitionFocus };
  };

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: 'networkidle' });
  const desktop = await runFlow('desktop');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  const mobile = await runFlow('mobile');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  const reducedMotion = await page.evaluate(() => {
    const seconds = (value) => value.split(',').map((entry) => {
      const duration = entry.trim();
      return duration.endsWith('ms') ? Number.parseFloat(duration) / 1000 : Number.parseFloat(duration);
    }).filter(Number.isFinite);
    const offenders = [...document.querySelectorAll('*')].flatMap((element) => {
      const style = getComputedStyle(element);
      const maximum = Math.max(0, ...seconds(style.animationDuration), ...seconds(style.transitionDuration));
      return maximum > 0.02 ? [{ tag: element.tagName, className: element.className, maximum }] : [];
    });
    return { mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches, offenders };
  });
  await activate(/Start relay with Jo/i);
  await activate(/simulate signal loss/i);
  await page.getByRole('heading', { name: /Signal paused\. You still have a plan\./i }).waitFor({ state: 'visible' });

  const semantics = await page.evaluate(() => ({
    mainCount: document.querySelectorAll('main').length,
    headingCount: document.querySelectorAll('h1, h2, h3').length,
    liveRegionCount: document.querySelectorAll('[aria-live], [role="status"], [role="alert"]').length,
    activeElement: document.activeElement?.textContent?.trim() || document.activeElement?.tagName,
  }));
  const requests = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));

  return {
    candidate,
    desktop,
    mobile,
    reducedMotion,
    semantics,
    consoleErrors,
    pageErrors,
    requests,
  };
}
