/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsPricingParser from './parsers/cards-pricing.js';
import tableParser from './parsers/table.js';
import cardsAddonsParser from './parsers/cards-addons.js';
import columnsCtaParser from './parsers/columns-cta.js';
import accordionParser from './parsers/accordion.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';

// TRANSFORMER IMPORTS (shared with homepage)
import cleanupTransformer from './transformers/semrush-cleanup.js';
import sectionsTransformer from './transformers/semrush-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (pricing)
const PAGE_TEMPLATE = {
  name: 'pricing',
  description: 'Semrush pricing page (/pricing/ redirects to /pricing/seo/): plan cards, comparison table, add-ons cards, enterprise demo CTA, FAQ accordion, and testimonials carousel.',
  urls: [
    'https://www.semrush.com/pricing/',
  ],
  blocks: [
    {
      name: 'cards-pricing',
      instances: ['ul[class*=cardsContainer]'],
    },
    {
      name: 'table',
      instances: ['div[class*=MultiColumnTable]'],
    },
    {
      name: 'cards-addons',
      instances: ['ul[class*="cards--"]'],
    },
    {
      name: 'columns-cta',
      instances: ['section[class*=CustomPlanRequest]'],
    },
    {
      name: 'accordion',
      instances: ['section:has(h3[class*=SItemToggle])'],
    },
    {
      name: 'carousel-testimonial',
      instances: ['div[class*=testimonialsSlider]'],
    },
  ],
  sections: [
    {
      id: 'planHeader',
      name: 'Page Header',
      selector: '#srf-skip-to-content > div[class*="styles-module__header"]',
      style: null,
      blocks: [],
      defaultContent: ['#srf-skip-to-content h1'],
    },
    {
      id: 'planCards',
      name: 'Pricing Plan Cards',
      selector: '#srf-skip-to-content > div:has(ul[class*="cardsContainer"])',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: [],
    },
    {
      id: 'comparePlans',
      name: 'Compare Plans Table',
      selector: '#srf-skip-to-content > div:has([class*="MultiColumnTable"])',
      style: null,
      blocks: ['table'],
      defaultContent: [],
    },
    {
      id: 'addons',
      name: 'Add-ons',
      selector: '#srf-skip-to-content > section:has(ul[class*="cards--"])',
      style: null,
      blocks: ['cards-addons'],
      defaultContent: ['section:has(ul[class*="cards--"]) h2'],
    },
    {
      id: 'enterpriseDemo',
      name: 'Enterprise Demo',
      selector: '#srf-skip-to-content > section[class*="CustomPlanRequest"]',
      style: 'dark',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
    {
      id: 'faq',
      name: 'FAQ',
      selector: '#srf-skip-to-content > section:has(h3[class*="SItemToggle"])',
      style: null,
      blocks: ['accordion'],
      defaultContent: [],
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      selector: '#srf-skip-to-content > section[class*="Testimonials"]',
      style: 'accent',
      blocks: ['carousel-testimonial'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'cards-pricing': cardsPricingParser,
  table: tableParser,
  'cards-addons': cardsAddonsParser,
  'columns-cta': columnsCtaParser,
  accordion: accordionParser,
  'carousel-testimonial': carouselTestimonialParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
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
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    if (blockDef.name.startsWith('section-')) return;

    let matched = false;
    blockDef.instances.forEach((selector) => {
      if (matched) return; // instances are fallbacks: use the first selector that matches
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for ${blockDef.name}: ${selector}`, e);
        return;
      }
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

    // 1. beforeTransform (cleanup + section breaks/metadata + default-content lifting)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced
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

    // 4. afterTransform (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path. For the site root the stripped pathname is empty;
    // default to '/index' to avoid path.resolve() hitting a missing
    // process.cwd() in the browser. /pricing/ → /pricing/index.
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
