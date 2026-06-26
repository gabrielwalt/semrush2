/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Semrush site-wide cleanup.
 *
 * Removes non-authorable site furniture (header, top promo banner, footer,
 * sidebar, skip-to-content), non-content overlays / popups, cookie consent,
 * analytics & tracking pixels/iframes, and stray <meta>/<link> tags so the
 * import contains only the authorable page content under `.main-page`.
 *
 * All selectors below were verified against migration-work/cleaned.html.
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
      'img.ywa-10000', // Yahoo analytics pixels (lines 1424-1425)
      '#batBeacon942788350180', // Bing tracking beacon (line 1426)
      'iframe', // DoubleClick / empty tracking iframes (lines 1405, 1429, 1431)
      'meta', // stray meta tags inside content (lines 257-258)
      'link', // stray stylesheet links inside content (line 260)
      'noscript',
    ]);
  }
}
