// This project's scripts/aem.js and scripts/scripts.js do not export
// fetchPlaceholders or moveInstrumentation, so provide local equivalents:
// placeholder labels fall back to literal English strings (see usages below),
// and instrumentation attributes (used by the Universal Editor) are copied.
const placeholders = {};

function moveInstrumentation(from, to) {
  if (!from || !to) return;
  [...from.attributes]
    .filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'))
    .forEach(({ name, value }) => {
      to.setAttribute(name, value);
      from.removeAttribute(name);
    });
}

function updateCounter(block) {
  const counter = block.querySelector('.carousel-testimonial-counter');
  if (!counter) return;
  const total = block.querySelectorAll('.carousel-testimonial-slide').length;
  const current = parseInt(block.dataset.activeSlide, 10) + 1;
  counter.textContent = `${current} / ${total}`;
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-testimonial');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-testimonial-slide');
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  updateCounter(block);
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-testimonial-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-testimonial-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const prev = block.querySelector('.slide-prev');
  const next = block.querySelector('.slide-next');

  if (prev) {
    prev.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-testimonial-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-testimonial-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-testimonial-slide');

  row.querySelectorAll(':scope > div').forEach((column) => {
    column.classList.add('carousel-testimonial-slide-content');
    slide.append(column);
  });

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-testimonial-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-testimonial-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-testimonial-slides');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    const nav = document.createElement('div');
    nav.classList.add('carousel-testimonial-nav');
    nav.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <span class="carousel-testimonial-counter" aria-hidden="true">1 / ${rows.length}</span>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    // Nav bar sits above the slides, matching the source layout.
    block.prepend(nav);
    bindEvents(block);
  }
}
