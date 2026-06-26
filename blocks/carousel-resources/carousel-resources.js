import { buildCarousel } from '../../scripts/carousel.js';

// Resources carousel: article cards, each a 2-column row (image | content).
// Slide/nav behavior comes from the shared carousel engine; this block only
// describes how a row's columns map into a slide and which nav style to use.
function arrangeSlide(row, slideIndex, slide) {
  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-resources-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });
}

export default function decorate(block) {
  buildCarousel(block, {
    name: 'carousel-resources',
    nav: 'dots',
    arrangeSlide,
  });
}
