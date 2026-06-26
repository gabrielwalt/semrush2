/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsStatsParser from './parsers/cards-stats.js';
import carouselResourcesParser from './parsers/carousel-resources.js';
import carouselToolkitsParser from './parsers/carousel-toolkits.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsTestimonialParser from './parsers/columns-testimonial.js';
import heroSearchParser from './parsers/hero-search.js';
import logosMarqueeParser from './parsers/logos-marquee.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/semrush-cleanup.js';
import sectionsTransformer from './transformers/semrush-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Semrush marketing homepage: hero with search form and logo marquee, promo cards, solutions/toolkits slider, stats facts, customer testimonials, and resources slider.',
  urls: [
    'https://www.semrush.com/',
  ],
  blocks: [
    {
      name: 'hero-search',
      instances: ['section.mp-hero'],
    },
    {
      name: 'logos-marquee',
      instances: ['section.mp-logo-marquee', '.mp-logo-marquee'],
    },
    {
      name: 'columns-promo',
      instances: ['.mp-promo-cards-wrapper'],
    },
    {
      name: 'carousel-toolkits',
      instances: ['section.mp-toolkits', '.mp-section.mp-toolkits'],
    },
    {
      name: 'cards-stats',
      instances: ['section.mp-stats', '.mp-section.mp-stats'],
    },
    {
      name: 'section-testimonials',
      instances: ['section.mp-client-testimonials', '.mp-section.mp-client-testimonials'],
      section: 'dark',
    },
    {
      name: 'columns-testimonial',
      instances: ['.mp-client-testimonials__layout'],
    },
    {
      name: 'carousel-resources',
      instances: ['section.mp-resources', '.mp-section.mp-resources'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: '#root-content > div.main-page > section.mp-hero',
      style: null,
      blocks: ['hero-search', 'logos-marquee'],
      defaultContent: [],
    },
    {
      id: 'promoCards',
      name: 'Promo Cards',
      selector: '#root-content > div.main-page > div.mp-promo-cards-wrapper',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'toolkits',
      name: 'Solutions Toolkits',
      selector: '#root-content > div.main-page > section.mp-section.mp-toolkits.mp-slider',
      style: null,
      blocks: ['carousel-toolkits'],
      defaultContent: ['#mp-toolkits-header'],
    },
    {
      id: 'stats',
      name: 'Stats and Facts',
      selector: '#root-content > div.main-page > section.mp-section.mp-stats',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: ['#mp-stats-header'],
    },
    {
      id: 'testimonials',
      name: 'Customer Testimonials',
      selector: '#root-content > div.main-page > section.mp-section.mp-client-testimonials',
      style: 'dark',
      blocks: ['columns-testimonial'],
      defaultContent: ['#mp-client-testimonials-header'],
    },
    {
      id: 'resources',
      name: 'Resources',
      selector: '#root-content > div.main-page > section.mp-section.mp-resources.mp-slider',
      style: null,
      blocks: ['carousel-resources'],
      defaultContent: ['#mp-resources-header'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-search': heroSearchParser,
  'logos-marquee': logosMarqueeParser,
  'columns-promo': columnsPromoParser,
  'carousel-toolkits': carouselToolkitsParser,
  'cards-stats': cardsStatsParser,
  'columns-testimonial': columnsTestimonialParser,
  'carousel-resources': carouselResourcesParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    // section- entries are section mappings, not parseable blocks
    if (blockDef.name.startsWith('section-')) return;

    let matched = false;
    blockDef.instances.forEach((selector) => {
      if (matched) return; // instances are fallbacks: use the first selector that matches
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) return;
      matched = true;
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });

    if (!matched) {
      console.warn(`Block "${blockDef.name}" selectors not found: ${blockDef.instances.join(', ')}`);
    }
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. For the site root the stripped pathname is
    // empty, which makes the importer's path.resolve() fall back to a missing
    // process.cwd() in the browser — default the root to '/index'.
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
