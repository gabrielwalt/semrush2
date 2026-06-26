/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Semrush section breaks and section metadata.
 *
 * The homepage template defines 6 sections. This transformer inserts a section
 * break (<hr>) before every section except the first, lifts each section's
 * default-content headers out so the block parsers don't destroy them, and adds
 * a Section Metadata block for each section that declares a `style`
 * (only "testimonials" -> dark).
 *
 * IMPORTANT: runs in beforeTransform (NOT afterTransform). The block parsers
 * replace whole section elements (e.g. section.mp-toolkits) with their block
 * tables, so by afterTransform the section anchors no longer exist. Doing this
 * work in beforeTransform — while the original section roots and their inner
 * default-content headers are still present — is what keeps the 6 section
 * boundaries and the eyebrow/headline default content intact.
 *
 * Section roots come from payload.template.sections, each verified against
 * migration-work/cleaned.html:
 *   - section.mp-hero
 *   - div.mp-promo-cards-wrapper
 *   - section.mp-section.mp-toolkits.mp-slider
 *   - section.mp-section.mp-stats
 *   - section.mp-section.mp-client-testimonials (style: dark)
 *   - section.mp-section.mp-resources.mp-slider
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

function findSectionEl(element, selector) {
  if (!selector) return null;
  // Try the full selector first, then the trailing element selector so it works
  // whether `element` is <body>, <main>, or the inner content wrapper.
  return element.querySelector(selector)
    || element.querySelector(selector.split('>').pop().trim());
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Forward order: each section is located by its unique selector, and we only
  // insert nodes adjacent to that section, so earlier insertions never shift
  // later lookups.
  sections.forEach((section, index) => {
    const sectionEl = findSectionEl(element, section.selector);
    if (!sectionEl) return;

    const parent = sectionEl.parentNode;
    if (!parent) return;

    // 1. Section break before every section except the first.
    if (index > 0) {
      parent.insertBefore(doc.createElement('hr'), sectionEl);
    }

    // 2. Lift default-content headers out of the section (between the <hr> and
    //    the section root) so the block parser — which replaces the whole
    //    section element — cannot destroy them.
    (section.defaultContent || []).forEach((dcSelector) => {
      const dcEl = element.querySelector(dcSelector);
      if (dcEl && dcEl !== sectionEl && sectionEl.contains(dcEl)) {
        // dcEl is inside the section: move it to just before the section root.
        parent.insertBefore(dcEl, sectionEl);
      }
    });

    // 3. Section Metadata block for sections that declare a style. Placed
    //    immediately after the section root so it falls inside this section's
    //    <hr> boundaries. The testimonials block parser replaces an inner child
    //    (.mp-client-testimonials__layout), so the section root survives and the
    //    metadata stays correctly grouped with it.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (sectionEl.nextSibling) {
        parent.insertBefore(metaBlock, sectionEl.nextSibling);
      } else {
        parent.appendChild(metaBlock);
      }
    }
  });
}
