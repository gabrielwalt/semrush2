/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-stats.js
  function parse(element, { document }) {
    const items = Array.from(element.querySelectorAll('.mp-stats__item, li[class*="stats__item"]'));
    const cells = [];
    items.forEach((item) => {
      const contentCell = [];
      const count = item.querySelector('.mp-stats__item-count, [class*="item-count"] b, b');
      if (count) {
        const heading = document.createElement("h3");
        heading.textContent = count.textContent.trim();
        contentCell.push(heading);
      }
      const title = item.querySelector('.mp-stats__item-title, [class*="item-title"]');
      if (title && title.textContent.trim()) {
        const titleP = document.createElement("p");
        titleP.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
        contentCell.push(titleP);
      }
      const description = item.querySelector('.mp-stats__item-description, [class*="item-description"]');
      if (description && description.textContent.trim()) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        contentCell.push(descP);
      }
      if (contentCell.length) {
        cells.push([contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-resources.js
  function parse2(element, { document }) {
    const slides = Array.from(element.querySelectorAll('.mp-resources__item, article[class*="resources__item"]'));
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".mp-resources__item-img, img");
      const imageCell = img || "";
      const textCell = [];
      const titleLink = slide.querySelector(".mp-resources__item-link, .mp-resources__item-title a, h3 a");
      if (titleLink) {
        const heading = document.createElement("h3");
        const link = document.createElement("a");
        link.href = titleLink.href;
        link.textContent = titleLink.textContent.trim();
        heading.append(link);
        textCell.push(heading);
      } else {
        const titleEl = slide.querySelector(".mp-resources__item-title, h3");
        if (titleEl && titleEl.textContent.trim()) {
          const heading = document.createElement("h3");
          heading.textContent = titleEl.textContent.trim();
          textCell.push(heading);
        }
      }
      const description = slide.querySelector('.mp-resources__item-description, p[class*="description"]');
      if (description && description.textContent.trim()) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        textCell.push(descP);
      }
      const tags = Array.from(slide.querySelectorAll(".mp-resources__item-info-tag, footer span")).map((t) => t.textContent.trim()).filter(Boolean);
      if (tags.length) {
        const tagP = document.createElement("p");
        tagP.textContent = tags.join(", ");
        textCell.push(tagP);
      }
      if (img || textCell.length) {
        cells.push([imageCell, textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-toolkits.js
  function parse3(element, { document }) {
    const slides = Array.from(element.querySelectorAll('.mp-toolkit.swiper-slide, .mp-toolkit[class*="swiper-slide"]'));
    const slideEls = slides.length ? slides : Array.from(element.querySelectorAll(".mp-toolkit"));
    const cells = [];
    slideEls.forEach((slide) => {
      const img = slide.querySelector(".mp-toolkit__poster img, .mp-toolkit__img-wrapper img, .mp-toolkit__content img");
      const imageCell = img || "";
      const textCell = [];
      const title = slide.querySelector(".mp-toolkit__title, h3");
      if (title && title.textContent.trim()) {
        const heading = document.createElement("h3");
        heading.textContent = title.textContent.trim();
        textCell.push(heading);
      }
      const subtitle = slide.querySelector(".mp-toolkit__subtitle, h4");
      if (subtitle && subtitle.textContent.trim()) {
        const sub = document.createElement("h4");
        sub.textContent = subtitle.textContent.replace(/\s+/g, " ").trim();
        textCell.push(sub);
      }
      const description = slide.querySelector('.mp-toolkit__description, p[class*="description"]');
      if (description && description.textContent.trim()) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        textCell.push(descP);
      }
      const cta = slide.querySelector(".mp-toolkit__cta, a.mp-button");
      if (cta && cta.href) {
        const link = document.createElement("a");
        link.href = cta.href;
        link.textContent = cta.textContent.trim();
        textCell.push(link);
      }
      if (img || textCell.length) {
        cells.push([imageCell, textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-toolkits", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document }) {
    const panels = Array.from(element.querySelectorAll("section.mp-promo-cards, .mp-promo-cards"));
    const rowCells = [];
    panels.forEach((panel) => {
      const cell = [];
      const title = panel.querySelector(".mp-promo-cards__title, h2");
      if (title && title.textContent.trim()) {
        const heading = document.createElement("h2");
        heading.textContent = title.textContent.replace(/\s+/g, " ").trim();
        cell.push(heading);
      }
      const description = panel.querySelector(".mp-promo-cards__description, p");
      if (description && description.textContent.trim()) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        cell.push(descP);
      }
      const cta = panel.querySelector('.mp-button, a[class*="button"], a');
      if (cta && cta.href) {
        const link = document.createElement("a");
        link.href = cta.href;
        link.textContent = cta.textContent.trim();
        cell.push(link);
      }
      const videoEl = panel.querySelector(".mp-promo-cards__video, video");
      let videoSrc = "";
      if (videoEl) {
        const sourceEl = videoEl.querySelector("source");
        videoSrc = sourceEl && (sourceEl.getAttribute("src") || sourceEl.getAttribute("data-src")) || videoEl.getAttribute("src") || videoEl.getAttribute("data-src") || "";
      }
      if (videoSrc) {
        const videoLink = document.createElement("a");
        videoLink.href = videoSrc;
        videoLink.textContent = videoSrc;
        cell.push(videoLink);
      }
      if (cell.length) rowCells.push(cell);
    });
    if (!rowCells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-testimonial.js
  function parse5(element, { document }) {
    const quoteCell = [];
    const quoteBlock = element.querySelector(".mp-client-testimonials__quote-block, figure");
    if (quoteBlock) {
      const logo = quoteBlock.querySelector(".mp-client-testimonials__logo-img, img.mp-client-testimonials__logo-img");
      if (logo) quoteCell.push(logo);
      const quote = quoteBlock.querySelector(".mp-client-testimonials__quote, blockquote");
      if (quote && quote.textContent.trim()) {
        const bq = document.createElement("blockquote");
        bq.textContent = quote.textContent.trim();
        quoteCell.push(bq);
      }
      const authorImg = quoteBlock.querySelector(".mp-client-testimonials__author-img, figcaption img");
      if (authorImg) quoteCell.push(authorImg);
      const cite = quoteBlock.querySelector("cite");
      if (cite) {
        const name = cite.querySelector("b");
        const role = cite.querySelector("span");
        if (name && name.textContent.trim()) {
          const nameP = document.createElement("p");
          nameP.innerHTML = `<strong>${name.textContent.trim()}</strong>`;
          quoteCell.push(nameP);
        }
        if (role && role.textContent.trim()) {
          const roleP = document.createElement("p");
          roleP.textContent = role.textContent.trim();
          quoteCell.push(roleP);
        }
      }
    }
    const statsCell = [];
    const statsBlock = element.querySelector('.mp-client-testimonials__stats-block, [class*="stats-block"]');
    if (statsBlock) {
      const statImg = statsBlock.querySelector("img");
      if (statImg) statsCell.push(statImg);
      const number = statsBlock.querySelector('.mp-client-testimonials__stats-block-number, [class*="stats-block-number"]');
      if (number && number.textContent.trim()) {
        const numEl = document.createElement("h3");
        numEl.textContent = number.textContent.trim();
        statsCell.push(numEl);
      }
      const label = statsBlock.querySelector('.mp-client-testimonials__stats-block-text, [class*="stats-block-text"]');
      if (label && label.textContent.trim()) {
        const labelP = document.createElement("p");
        labelP.textContent = label.textContent.trim();
        statsCell.push(labelP);
      }
    }
    if (!quoteCell.length && !statsCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      quoteCell.length ? quoteCell : "",
      statsCell.length ? statsCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-search.js
  function parse6(element, { document }) {
    const cells = [];
    const bgImage = Array.from(element.querySelectorAll("img")).find(
      (img) => !img.closest(".mp-logo-marquee")
    );
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    const title = element.querySelector(".mp-hero__title, h1");
    if (title && title.textContent.trim()) {
      const heading = document.createElement("h1");
      heading.textContent = title.textContent.trim();
      contentCell.push(heading);
    }
    const subtitle = element.querySelector('.mp-hero__subtitle, p[class*="subtitle"]');
    if (subtitle && subtitle.textContent.trim()) {
      const subP = document.createElement("p");
      subP.textContent = subtitle.textContent.trim();
      contentCell.push(subP);
    }
    const searchBtn = element.querySelector(".mp-search .mp-button, .mp-search__container .mp-button");
    const searchInput = element.querySelector(".mp-search__input-value, .mp-search input");
    if (searchBtn) {
      const placeholder = element.querySelector('.suggest-placeholder-overlay, [class*="placeholder"]');
      const labelText = searchBtn.textContent.trim() || "Get insights";
      if (placeholder && placeholder.textContent.trim()) {
        const promptP = document.createElement("p");
        promptP.textContent = placeholder.textContent.trim();
        contentCell.push(promptP);
      } else if (searchInput) {
        const promptP = document.createElement("p");
        promptP.textContent = "Enter your website";
        contentCell.push(promptP);
      }
      const cta = document.createElement("a");
      cta.href = "#main-cta-top";
      cta.textContent = labelText;
      const ctaP = document.createElement("p");
      ctaP.append(cta);
      contentCell.push(ctaP);
    }
    const videoEl = element.querySelector(".mp-hero__video, video");
    if (videoEl) {
      const sourceEl = videoEl.querySelector("source");
      const videoSrc = sourceEl && (sourceEl.getAttribute("src") || sourceEl.getAttribute("data-src")) || videoEl.getAttribute("src") || videoEl.getAttribute("data-src") || "";
      if (videoSrc) {
        const videoLink = document.createElement("a");
        videoLink.href = videoSrc;
        videoLink.textContent = videoSrc;
        const videoP = document.createElement("p");
        videoP.append(videoLink);
        contentCell.push(videoP);
      }
    }
    if (!cells.length && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-search", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/logos-marquee.js
  function parse7(element, { document }) {
    const firstGroup = element.querySelector(".mp-logo-marquee__group, ul");
    const scope = firstGroup || element;
    const logos = Array.from(scope.querySelectorAll("img")).filter((img) => img.getAttribute("src") || img.getAttribute("data-src"));
    const cells = [];
    logos.forEach((img) => {
      cells.push([img]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "logos-marquee", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/semrush-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#srf-notice-bubble-container",
        // notice bubble container (cleaned.html line 1385)
        ".srf-overlay",
        // line 1387
        ".srf-popup-manager",
        // line 1389
        "#srf-sso-login-form",
        // line 1391
        "#srf-limit-popup",
        // line 1393
        "#srf-billing-popup",
        // line 1395
        "#srf-sharing-popup",
        // line 1397
        "#srf-multi-invite-popup",
        // line 1399
        ".ch2",
        // cookie consent (line 1407)
        "#srf-browser-unhappy",
        // outdated browser notice (documented furniture)
        ".srf_top_banner"
        // promo top banner (line 9)
      ]);
      const hero = element.querySelector("section.mp-hero");
      const marquee = element.querySelector("section.mp-hero .mp-logo-marquee");
      if (hero && marquee && hero.parentNode) {
        hero.parentNode.insertBefore(marquee, hero.nextSibling);
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".srf-layout__skip-to-content",
        ".srf-layout__notification",
        ".srf-layout__header",
        ".srf-layout__sidebar",
        ".srf-layout__footer",
        "#srf-header",
        "#srf-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "img.ywa-10000",
        // Yahoo analytics pixels (lines 1424-1425)
        "#batBeacon942788350180",
        // Bing tracking beacon (line 1426)
        "iframe",
        // DoubleClick / empty tracking iframes (lines 1405, 1429, 1431)
        "meta",
        // stray meta tags inside content (lines 257-258)
        "link",
        // stray stylesheet links inside content (line 260)
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/semrush-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      if (sections.length < 2) return;
      const doc = element.ownerDocument;
      sections.slice().reverse().forEach((section, reverseIndex) => {
        const index = sections.length - 1 - reverseIndex;
        const sel = section.selector;
        let sectionEl = null;
        if (sel) {
          sectionEl = element.querySelector(sel) || element.querySelector(sel.split(">").pop().trim());
        }
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(metaBlock);
          }
        }
        if (index > 0) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Semrush marketing homepage: hero with search form and logo marquee, promo cards, solutions/toolkits slider, stats facts, customer testimonials, and resources slider.",
    urls: [
      "https://www.semrush.com/"
    ],
    blocks: [
      {
        name: "hero-search",
        instances: ["section.mp-hero"]
      },
      {
        name: "logos-marquee",
        instances: ["section.mp-logo-marquee", ".mp-logo-marquee"]
      },
      {
        name: "columns-promo",
        instances: [".mp-promo-cards-wrapper"]
      },
      {
        name: "carousel-toolkits",
        instances: ["section.mp-toolkits", ".mp-section.mp-toolkits"]
      },
      {
        name: "cards-stats",
        instances: ["section.mp-stats", ".mp-section.mp-stats"]
      },
      {
        name: "section-testimonials",
        instances: ["section.mp-client-testimonials", ".mp-section.mp-client-testimonials"],
        section: "dark"
      },
      {
        name: "columns-testimonial",
        instances: [".mp-client-testimonials__layout"]
      },
      {
        name: "carousel-resources",
        instances: ["section.mp-resources", ".mp-section.mp-resources"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        selector: "#root-content > div.main-page > section.mp-hero",
        style: null,
        blocks: ["hero-search", "logos-marquee"],
        defaultContent: []
      },
      {
        id: "promoCards",
        name: "Promo Cards",
        selector: "#root-content > div.main-page > div.mp-promo-cards-wrapper",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "toolkits",
        name: "Solutions Toolkits",
        selector: "#root-content > div.main-page > section.mp-section.mp-toolkits.mp-slider",
        style: null,
        blocks: ["carousel-toolkits"],
        defaultContent: ["#mp-toolkits-header"]
      },
      {
        id: "stats",
        name: "Stats and Facts",
        selector: "#root-content > div.main-page > section.mp-section.mp-stats",
        style: null,
        blocks: ["cards-stats"],
        defaultContent: ["#mp-stats-header"]
      },
      {
        id: "testimonials",
        name: "Customer Testimonials",
        selector: "#root-content > div.main-page > section.mp-section.mp-client-testimonials",
        style: "dark",
        blocks: ["columns-testimonial"],
        defaultContent: ["#mp-client-testimonials-header"]
      },
      {
        id: "resources",
        name: "Resources",
        selector: "#root-content > div.main-page > section.mp-section.mp-resources.mp-slider",
        style: null,
        blocks: ["carousel-resources"],
        defaultContent: ["#mp-resources-header"]
      }
    ]
  };
  var parsers = {
    "hero-search": parse6,
    "logos-marquee": parse7,
    "columns-promo": parse4,
    "carousel-toolkits": parse3,
    "cards-stats": parse,
    "columns-testimonial": parse5,
    "carousel-resources": parse2
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      let matched = false;
      blockDef.instances.forEach((selector) => {
        if (matched) return;
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
            section: blockDef.section || null
          });
        });
      });
      if (!matched) {
        console.warn(`Block "${blockDef.name}" selectors not found: ${blockDef.instances.join(", ")}`);
      }
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
