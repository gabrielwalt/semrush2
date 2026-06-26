import { buildCarousel } from '../../scripts/carousel.js';

// Testimonial carousel: text-only quote slides with a "N / 5" counter between
// the prev/next arrows. Default slide arrangement (each row column becomes
// slide content) matches the source. Behavior comes from the shared engine.
export default function decorate(block) {
  buildCarousel(block, {
    name: 'carousel-testimonial',
    nav: 'counter',
  });
}
