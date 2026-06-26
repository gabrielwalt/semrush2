import { buildCarousel } from '../../scripts/carousel.js';

// Toolkits carousel: each row is a 2-column source (image | content). The card
// renders content-first with the preview image nested between the sub-headline
// (h4) and the description, so the visual order is: label, subtitle, image,
// description, CTA. Slide/nav behavior comes from the shared carousel engine.
function arrangeSlide(row, slideIndex, slide) {
  const columns = [...row.querySelectorAll(':scope > div')];
  const imageCol = columns[0];
  const contentCol = columns[1];
  if (imageCol) imageCol.classList.add('carousel-toolkits-slide-image');
  if (contentCol) contentCol.classList.add('carousel-toolkits-slide-content');

  if (contentCol) {
    slide.append(contentCol);
    if (imageCol) {
      const subtitle = contentCol.querySelector('h4');
      if (subtitle) subtitle.after(imageCol);
      else contentCol.prepend(imageCol);
    }
  } else if (imageCol) {
    slide.append(imageCol);
  }
}

export default function decorate(block) {
  buildCarousel(block, {
    name: 'carousel-toolkits',
    nav: 'dots',
    arrangeSlide,
  });
}
