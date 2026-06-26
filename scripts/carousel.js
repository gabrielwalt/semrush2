/*
 * Shared carousel engine.
 *
 * One implementation powers every carousel variant on the site (carousel-resources,
 * carousel-toolkits, carousel-testimonial, and any future ones) so slide and
 * navigation behavior is identical everywhere. A variant block's decorate()
 * delegates to buildCarousel() and only supplies its class prefix, nav style,
 * and an optional per-slide content arranger.
 *
 * This project's scripts/scripts.js does not export moveInstrumentation, so it
 * is defined here and re-exported for variant blocks that need it.
 */

export function moveInstrumentation(from, to) {
  if (!from || !to) return;
  [...from.attributes]
    .filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'))
    .forEach(({ name, value }) => {
      to.setAttribute(name, value);
      from.removeAttribute(name);
    });
}

function updateNav(block, prefix, slideIndex, total) {
  // Dots: toggle the disabled (active) state on each indicator button.
  block.querySelectorAll(`.${prefix}-slide-indicator`).forEach((indicator, idx) => {
    const button = indicator.querySelector('button');
    if (!button) return;
    if (idx === slideIndex) button.setAttribute('disabled', 'true');
    else button.removeAttribute('disabled');
  });

  // Counter: "current / total".
  const counter = block.querySelector(`.${prefix}-counter`);
  if (counter) counter.textContent = `${slideIndex + 1} / ${total}`;
}

function updateActiveSlide(slide, prefix) {
  const block = slide.closest(`.${prefix}`);
  if (!block) return;
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll(`.${prefix}-slide`);
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  updateNav(block, prefix, slideIndex, slides.length);
}

export function showSlide(block, prefix, slideIndex = 0) {
  const slides = block.querySelectorAll(`.${prefix}-slide`);
  if (!slides.length) return;
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector(`.${prefix}-slides`).scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block, prefix) {
  block.querySelectorAll(`.${prefix}-slide-indicator button`).forEach((button) => {
    button.addEventListener('click', (e) => {
      const indicator = e.currentTarget.parentElement;
      showSlide(block, prefix, parseInt(indicator.dataset.targetSlide, 10));
    });
  });

  const prev = block.querySelector('.slide-prev');
  const next = block.querySelector('.slide-next');
  if (prev) {
    prev.addEventListener('click', () => {
      showSlide(block, prefix, parseInt(block.dataset.activeSlide, 10) - 1);
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      showSlide(block, prefix, parseInt(block.dataset.activeSlide, 10) + 1);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target, prefix);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll(`.${prefix}-slide`).forEach((slide) => slideObserver.observe(slide));
}

const carouselIds = {};

/**
 * Decorate a carousel block.
 * @param {Element} block the block element
 * @param {Object} options
 * @param {string} options.name class prefix / block name (e.g. 'carousel-resources')
 * @param {'dots'|'counter'} [options.nav='dots'] navigation UI style
 * @param {(row: Element, slideIndex: number, slide: Element) => void} [options.arrangeSlide]
 *   optional hook to customize how a row's columns are placed into the slide <li>.
 *   Default: move every child <div> into the slide as `${name}-slide-content`.
 * @param {Object} [options.labels] aria label overrides
 */
export function buildCarousel(block, options = {}) {
  const {
    name,
    nav = 'dots',
    arrangeSlide,
    labels = {},
  } = options;

  carouselIds[name] = (carouselIds[name] || 0) + 1;
  const carouselId = carouselIds[name];
  block.setAttribute('id', `${name}-${carouselId}`);

  const rows = [...block.querySelectorAll(':scope > div')];
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', labels.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add(`${name}-slides-container`);

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add(`${name}-slides`);
  container.append(slidesWrapper);

  // Build the navigation chrome (only when there's more than one slide).
  let slideIndicators;
  if (!isSingleSlide) {
    const navButtons = document.createElement('div');
    navButtons.classList.add(`${name}-navigation-buttons`);
    if (nav === 'counter') {
      navButtons.innerHTML = `
        <button type="button" class="slide-prev" aria-label="${labels.previousSlide || 'Previous Slide'}"></button>
        <span class="${name}-counter" aria-hidden="true">1 / ${rows.length}</span>
        <button type="button" class="slide-next" aria-label="${labels.nextSlide || 'Next Slide'}"></button>
      `;
      block.prepend(navButtons);
    } else {
      const indicatorsNav = document.createElement('nav');
      indicatorsNav.setAttribute('aria-label', labels.slideControls || 'Carousel Slide Controls');
      slideIndicators = document.createElement('ol');
      slideIndicators.classList.add(`${name}-slide-indicators`);
      indicatorsNav.append(slideIndicators);
      block.append(indicatorsNav);

      navButtons.innerHTML = `
        <button type="button" class="slide-prev" aria-label="${labels.previousSlide || 'Previous Slide'}"></button>
        <button type="button" class="slide-next" aria-label="${labels.nextSlide || 'Next Slide'}"></button>
      `;
      container.append(navButtons);
    }
  }

  rows.forEach((row, idx) => {
    const slide = document.createElement('li');
    slide.dataset.slideIndex = idx;
    slide.setAttribute('id', `${name}-${carouselId}-slide-${idx}`);
    slide.classList.add(`${name}-slide`);

    if (typeof arrangeSlide === 'function') {
      arrangeSlide(row, idx, slide);
    } else {
      row.querySelectorAll(':scope > div').forEach((column) => {
        column.classList.add(`${name}-slide-content`);
        slide.append(column);
      });
    }

    const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (labeledBy && labeledBy.id) slide.setAttribute('aria-labelledby', labeledBy.id);

    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add(`${name}-slide-indicator`);
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${labels.showSlide || 'Show Slide'} ${idx + 1} ${labels.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }

    row.remove();
  });

  block.prepend(container);
  block.dataset.activeSlide = 0;

  if (!isSingleSlide) bindEvents(block, name);
}

export default buildCarousel;
