/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Semrush site-wide cleanup.
 *
 * Removes non-authorable site furniture (header, top promo banner, footer,
 * sidebar, skip-to-content), non-content overlays / popups, cookie consent,
 * analytics & tracking pixels/iframes, and stray <meta>/<link> tags so the
 * import contains only the authorable page content under `.main-page`
 * (homepage) or `#srf-skip-to-content` (pricing page).
 *
 * Shared across the homepage and pricing templates (the import script imports
 * this file for both). Every removal below is additive: homepage selectors and
 * pricing selectors coexist, and any selector that doesn't match on a given
 * page is simply a no-op.
 *
 * All selectors below were verified against the captured DOM
 * (migration-work/cleaned.html for the page being migrated), except the
 * Intercom chat selectors, which are injected at runtime by a third-party
 * script and are therefore not present in the static scrape — they are kept
 * defensively (same rationale as #srf-browser-unhappy) so the live importer
 * strips the chat widget if it has mounted by capture time.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / popups / cookie consent / outdated-browser notice.
    // These sit after `.main-page` (inside <main id="root-content">) and would
    // otherwise interfere with block parsing. Selectors from cleaned.html lines
    // 1385-1423 (overlays, popups, .ch2 cookie banner) and the top promo banner
    // (.srf_top_banner, lines 9-17). #srf-browser-unhappy is the documented
    // outdated-browser notice (not present on this page but kept for robustness).
    WebImporter.DOMUtils.remove(element, [
      '#srf-notice-bubble-container', // notice bubble container (cleaned.html line 1385)
      '.srf-overlay', // line 1387
      '.srf-popup-manager', // line 1389
      '#srf-sso-login-form', // line 1391
      '#srf-limit-popup', // line 1393
      '#srf-billing-popup', // line 1395
      '#srf-sharing-popup', // line 1397
      '#srf-multi-invite-popup', // line 1399
      '.ch2', // cookie consent (line 1407)
      '#srf-browser-unhappy', // outdated browser notice (documented furniture)
      '.srf_top_banner', // promo top banner (line 9)
    ]);

    // The logos marquee is a distinct block but is rendered NESTED inside
    // section.mp-hero. When the hero-search parser replaces section.mp-hero,
    // the nested marquee is detached and its parser is skipped. Promote the
    // marquee to be a sibling immediately after the hero so both blocks parse
    // independently and keep their visual order.
    const hero = element.querySelector('section.mp-hero');
    const marquee = element.querySelector('section.mp-hero .mp-logo-marquee');
    if (hero && marquee && hero.parentNode) {
      hero.parentNode.insertBefore(marquee, hero.nextSibling);
    }

    // --- Pricing-template furniture (no-op on the homepage) -----------------
    // The pricing page wraps its content in `#pricing.pricing__app`, with the
    // left-hand toolkit switcher (Semrush One / SEO Classic / AI Visibility …)
    // rendered as siblings BEFORE `#srf-skip-to-content`. This is navigation
    // chrome, not page content, and must be excluded. Removing it in
    // beforeTransform keeps it out of block parsing and ensures the section
    // transformer's content lookups under `#srf-skip-to-content` aren't
    // confused by the nav's own links/headings. Selectors verified against
    // migration-work/cleaned.html:
    //   - nav.sidebar.LeftMenu-module__wrapper (desktop nav, line 270)
    //   - .LeftMenu-module__mobileOnly (mobile toolkit dropdown, line 255)
    WebImporter.DOMUtils.remove(element, [
      'nav[class*="LeftMenu"]', // desktop toolkit switcher nav (line 270)
      '[class*="LeftMenu-module__mobileOnly"]', // mobile toolkit dropdown (line 255)
    ]);

    // Intercom live-chat widgets. Injected at runtime by Intercom's script, so
    // they are absent from the static scrape; kept defensively (see file
    // header) so the importer strips them if they have mounted by capture time.
    WebImporter.DOMUtils.remove(element, [
      '#intercom-container',
      '#intercom-css-container',
      '.intercom-lightweight-app',
      'iframe[name*="intercom"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Site furniture wrappers (header / top banner / footer / sidebar / skip
    // link). Verified in cleaned.html: skip-to-content (line 4),
    // .srf-layout__notification top-banner wrapper (line 7),
    // .srf-layout__header (line 19), .srf-layout__sidebar (line 252),
    // .srf-layout__footer (line 1143), <header id="srf-header"> (line 22),
    // <footer id="srf-footer"> (line 1145).
    WebImporter.DOMUtils.remove(element, [
      '.srf-layout__skip-to-content',
      '.srf-layout__notification',
      '.srf-layout__header',
      '.srf-layout__sidebar',
      '.srf-layout__footer',
      '#srf-header',
      '#srf-footer',
    ]);

    // Analytics / tracking pixels and iframes (cleaned.html lines 1405,
    // 1424-1432). Also strip stray <meta>/<link> tags that the scraper left
    // inside the content (lines 257-260) and <noscript> if present.
    WebImporter.DOMUtils.remove(element, [
      'img.ywa-10000', // Yahoo analytics pixels (homepage lines 1424-1425; pricing lines 1531, 1552)
      '[id^="batBeacon"]', // Bing tracking beacons — numeric suffix is page-specific
      // (homepage #batBeacon942788350180; pricing #batBeacon535441031900 wrapper
      // + nested img#batBeacon494714806976), so match by id prefix instead of a
      // hardcoded id.
      'iframe', // DoubleClick / empty tracking iframes (homepage 1405/1429/1431; pricing 1529/1553/1555)
      'canvas', // empty tracking <canvas> the scraper left in content (pricing line 1527)
      'meta', // stray meta tags inside content (homepage lines 257-258)
      'link', // stray stylesheet links inside content (homepage line 260; pricing lines 246-251, 1266)
      'noscript',
    ]);
  }
}
