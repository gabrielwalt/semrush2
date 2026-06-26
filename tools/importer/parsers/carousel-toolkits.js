/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-toolkits.
 * Base block: carousel (2 columns: image | text).
 * Source: https://www.semrush.com/ (section.mp-toolkits)
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Carousel" + authoring-analysis):
 *   Row 1: block name
 *   One row per toolkit slide: cell 1 = preview image, cell 2 = title, subtitle, description, CTA.
 * The small leading icon image and the duplicate <picture> preview are decorative/duplicate
 * and are not used; the poster image is the slide's representative image.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.mp-toolkit.swiper-slide, .mp-toolkit[class*="swiper-slide"]'));
  const slideEls = slides.length
    ? slides
    : Array.from(element.querySelectorAll('.mp-toolkit'));

  const cells = [];

  slideEls.forEach((slide) => {
    // Preview image: poster preferred, fall back to content image
    const img = slide.querySelector('.mp-toolkit__poster img, .mp-toolkit__img-wrapper img, .mp-toolkit__content img');
    const imageCell = img || '';

    const textCell = [];

    // Title
    const title = slide.querySelector('.mp-toolkit__title, h3');
    if (title && title.textContent.trim()) {
      const heading = document.createElement('h3');
      heading.textContent = title.textContent.trim();
      textCell.push(heading);
    }

    // Subtitle
    const subtitle = slide.querySelector('.mp-toolkit__subtitle, h4');
    if (subtitle && subtitle.textContent.trim()) {
      const sub = document.createElement('h4');
      sub.textContent = subtitle.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(sub);
    }

    // Description
    const description = slide.querySelector('.mp-toolkit__description, p[class*="description"]');
    if (description && description.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      textCell.push(descP);
    }

    // CTA
    const cta = slide.querySelector('.mp-toolkit__cta, a.mp-button');
    if (cta && cta.href) {
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      textCell.push(link);
    }

    if (img || textCell.length) {
      cells.push([imageCell, textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-toolkits', cells });
  element.replaceWith(block);
}
