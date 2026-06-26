/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Semrush section breaks and section metadata.
 *
 * The homepage template defines 6 sections. This transformer inserts a section
 * break (<hr>) before every section except the first, and a Section Metadata
 * block for each section that declares a `style` (only "testimonials" -> dark).
 *
 * Runs in afterTransform only (block parsers run between the hooks; section
 * structure is final cleanup). Selectors come from payload.template.sections,
 * each verified against migration-work/cleaned.html:
 *   - section.mp-hero (line 262)
 *   - div.mp-promo-cards-wrapper (line 448)
 *   - section.mp-section.mp-toolkits.mp-slider (line 492)
 *   - section.mp-section.mp-stats (line 808)
 *   - section.mp-section.mp-client-testimonials (style: dark)
 *   - section.mp-section.mp-resources.mp-slider
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (sections.length < 2) return;

    const doc = element.ownerDocument;

    // Process in reverse so inserting nodes does not shift earlier matches.
    sections.slice().reverse().forEach((section, reverseIndex) => {
      const index = sections.length - 1 - reverseIndex;

      // Locate the section root within the migrated content. The template
      // selectors are absolute (#root-content > div.main-page > ...); match
      // them relative to `element` by using the trailing element selector.
      const sel = section.selector;
      let sectionEl = null;
      if (sel) {
        // Try the full selector first, then progressively simpler tails so it
        // works whether `element` is <main> or the inner content wrapper.
        sectionEl = element.querySelector(sel)
          || element.querySelector(sel.split('>').pop().trim());
      }
      if (!sectionEl) return;

      // Section Metadata block for sections that declare a style.
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(metaBlock);
        }
      }

      // Section break before every section except the first.
      if (index > 0) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    });
  }
}
