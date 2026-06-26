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

  // tools/importer/import-pricing.js
  var import_pricing_exports = {};
  __export(import_pricing_exports, {
    default: () => import_pricing_default
  });

  // tools/importer/parsers/cards-pricing.js
  function parse(element, { document }) {
    const cards = Array.from(
      element.querySelectorAll('li[class*="styles-module__card--"], li[class*="__card--"]')
    );
    const cells = [];
    cards.forEach((card) => {
      const contentCell = [];
      const title = card.querySelector('h2[class*="title--"], h2');
      if (title && title.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        contentCell.push(h);
      }
      const audience = card.querySelector('p[class*="audience--"]');
      if (audience && audience.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = audience.textContent.trim();
        contentCell.push(p);
      }
      const priceColumn = card.querySelector('[class*="priceColumn--"]');
      if (priceColumn) {
        const priceText = priceColumn.querySelector('div > span[class*="_size_200"]:not([class*="ScreenReaderOnly"])');
        const billing = priceColumn.querySelector("p");
        const original = priceColumn.querySelector('del[class*="crossedPrice--"], del');
        const priceP = document.createElement("p");
        const priceParts = [];
        if (priceText && priceText.textContent.trim()) {
          priceParts.push(`<strong>${priceText.textContent.replace(/\s+/g, " ").trim()}</strong>`);
        }
        if (original && original.textContent.trim()) {
          priceParts.push(`<del>${original.textContent.trim()}</del>`);
        }
        if (priceParts.length) {
          priceP.innerHTML = priceParts.join(" ");
          contentCell.push(priceP);
        }
        if (billing && billing.textContent.trim()) {
          const billP = document.createElement("p");
          billP.textContent = billing.textContent.trim();
          contentCell.push(billP);
        }
      }
      const cta = card.querySelector('a[class*="ButtonResolver-module__button--"], a[class*="__button--"]');
      if (cta) {
        const link = document.createElement("a");
        link.href = cta.getAttribute("href") || "#";
        link.textContent = (cta.textContent || "Try for free").replace(/\s+/g, " ").trim();
        const p = document.createElement("p");
        p.append(link);
        contentCell.push(p);
      }
      const featureList = card.querySelector('ul[class*="KeyFeaturesList-module__List--"], ul[class*="__List--"]');
      if (featureList) {
        const sectionTitle = card.querySelector('p[class*="SectionTitle--"]');
        if (sectionTitle && sectionTitle.textContent.trim()) {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${sectionTitle.textContent.trim()}</strong>`;
          contentCell.push(p);
        }
        const items = Array.from(
          featureList.querySelectorAll('li[class*="KeyFeaturesList-module__Item--"], li[class*="__Item--"]')
        );
        if (items.length) {
          const ul = document.createElement("ul");
          items.forEach((item) => {
            const textNode = item.querySelector('[class*="SContent"] span, [class*="SContent"]');
            const text = (textNode || item).textContent.replace(/\s+/g, " ").trim();
            if (text) {
              const li = document.createElement("li");
              li.textContent = text;
              ul.append(li);
            }
          });
          if (ul.children.length) contentCell.push(ul);
        }
      }
      if (contentCell.length) {
        cells.push([contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table.js
  function parse2(element, { document }) {
    const cells = [];
    const planTitles = Array.from(
      element.querySelectorAll('[class*="tableHeaderColumn--"] [class*="columnTitle--"]')
    ).map((el) => el.textContent.replace(/\s+/g, " ").trim());
    const tableName = element.querySelector('[class*="tableName--"]');
    const labelHeader = tableName ? tableName.textContent.replace(/\s+/g, " ").trim() : "";
    const columnCount = planTitles.length + 1;
    const headerRow = [labelHeader, ...planTitles];
    while (headerRow.length < columnCount) headerRow.push("");
    cells.push(headerRow);
    const readCellValue = (wrapper) => {
      const nameText = wrapper.querySelector('[class*="NameColumnText--"]');
      if (nameText) {
        return nameText.textContent.replace(/\s+/g, " ").trim();
      }
      const cellInner = wrapper.querySelector('[class*="tableCell--"], [class*="SCell"]') || wrapper;
      const srOnly = cellInner.querySelector('[class*="ScreenReaderOnly"]');
      if (srOnly && cellInner.querySelector("img")) {
        return srOnly.textContent.replace(/\s+/g, " ").trim() || "Yes";
      }
      const text = cellInner.textContent.replace(/\s+/g, " ").trim();
      return text;
    };
    const rows = Array.from(element.querySelectorAll('[class*="tableRow--"]'));
    rows.forEach((row) => {
      const wrappers = Array.from(
        row.querySelectorAll(':scope > [class*="SCellWrapper"]')
      );
      if (!wrappers.length) return;
      const rowValues = wrappers.map((w) => readCellValue(w));
      while (rowValues.length < columnCount) rowValues.push("");
      if (rowValues.length > columnCount) rowValues.length = columnCount;
      cells.push(rowValues);
    });
    if (cells.length <= 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "table", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-addons.js
  function parse3(element, { document }) {
    const cards = Array.from(
      element.querySelectorAll('li[class*="styles-module__card--"], li[class*="__card--"]')
    );
    const cells = [];
    cards.forEach((card) => {
      const iconImg = card.querySelector('[class*="styles-module__icon--"] img, [class*="__icon--"] img');
      const contentCell = [];
      const title = card.querySelector('h3[class*="title--"], h3');
      if (title && title.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        contentCell.push(h);
      }
      const priceWrapper = card.querySelector('[class*="priceWrapper--"]');
      if (priceWrapper) {
        const priceSpan = priceWrapper.querySelector(":scope > span");
        const priceText = (priceSpan || priceWrapper).textContent.replace(/\s+/g, " ").trim();
        if (priceText) {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${priceText}</strong>`;
          contentCell.push(p);
        }
      }
      const featureList = card.querySelector('ul[class*="features--"]');
      if (featureList) {
        const items = Array.from(featureList.querySelectorAll(":scope > li"));
        if (items.length) {
          const ul = document.createElement("ul");
          items.forEach((item) => {
            const contentNode = item.querySelector('[class*="SContent"]');
            const text = (contentNode || item).textContent.replace(/\s+/g, " ").trim();
            if (text) {
              const li = document.createElement("li");
              li.textContent = text;
              ul.append(li);
            }
          });
          if (ul.children.length) contentCell.push(ul);
        }
      }
      if (iconImg || contentCell.length) {
        cells.push([
          iconImg ? [iconImg] : "",
          contentCell.length ? contentCell : ""
        ]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-addons", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse4(element, { document }) {
    const contentCell = [];
    const title = element.querySelector('h2[class*="title--"], h2');
    if (title && title.textContent.trim()) {
      const h = document.createElement("h2");
      h.textContent = title.textContent.replace(/\s+/g, " ").trim();
      contentCell.push(h);
    }
    const featureList = element.querySelector("ul");
    if (featureList) {
      const items = Array.from(featureList.querySelectorAll(":scope > li"));
      if (items.length) {
        const ul = document.createElement("ul");
        items.forEach((item) => {
          const contentNode = item.querySelector('[class*="SContent"]');
          const text = (contentNode || item).textContent.replace(/\s+/g, " ").trim();
          if (text) {
            const li = document.createElement("li");
            li.textContent = text;
            ul.append(li);
          }
        });
        if (ul.children.length) contentCell.push(ul);
      }
    }
    const ctaCell = [];
    const button = element.querySelector('button[class*="button--"], button, a[class*="button--"]');
    if (button) {
      const text = button.textContent.replace(/\s+/g, " ").trim();
      if (text) {
        const link = document.createElement("a");
        link.href = button.getAttribute("href") || "#";
        link.textContent = text;
        const p = document.createElement("p");
        p.append(link);
        ctaCell.push(p);
      }
    }
    if (!contentCell.length && !ctaCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      contentCell.length ? contentCell : "",
      ctaCell.length ? ctaCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse5(element, { document }) {
    const toggles = Array.from(
      element.querySelectorAll('h3[class*="SItemToggle"]')
    );
    const cells = [];
    toggles.forEach((toggle) => {
      const questionSpan = toggle.querySelector("span");
      const questionText = (questionSpan || toggle).textContent.replace(/\s+/g, " ").trim();
      if (!questionText) return;
      const questionEl = document.createElement("p");
      questionEl.textContent = questionText;
      const answerCell = [];
      let sibling = toggle.nextElementSibling;
      if (sibling && /SCollapse|Collapse/.test(sibling.className || "")) {
        const content = sibling.querySelector('[class*="collapseContent--"]') || sibling;
        const answerText = content.textContent.replace(/\s+/g, " ").trim();
        if (answerText) {
          const p = document.createElement("p");
          p.textContent = answerText;
          answerCell.push(p);
        }
      }
      cells.push([
        [questionEl],
        answerCell.length ? answerCell : ""
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse6(element, { document }) {
    const slides = Array.from(
      element.querySelectorAll('[class*="testimonialsSlide--"]')
    );
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    slides.forEach((slide) => {
      const quoteEl = slide.querySelector('[class*="testimonialsSlideText--"], p');
      const quoteText = quoteEl ? quoteEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!quoteText || seen.has(quoteText)) return;
      seen.add(quoteText);
      const contentCell = [];
      const bq = document.createElement("blockquote");
      bq.textContent = quoteText;
      contentCell.push(bq);
      const person = slide.querySelector('[class*="testimonialsSlidePerson--"]');
      if (person && person.textContent.trim()) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${person.textContent.replace(/\s+/g, " ").trim()}</strong>`;
        contentCell.push(p);
      }
      const position = slide.querySelector('[class*="testimonialsSlidePersonPosition--"]');
      if (position && position.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = position.textContent.replace(/\s+/g, " ").trim();
        contentCell.push(p);
      }
      cells.push([contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
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
      WebImporter.DOMUtils.remove(element, [
        'nav[class*="LeftMenu"]',
        // desktop toolkit switcher nav (line 270)
        '[class*="LeftMenu-module__mobileOnly"]'
        // mobile toolkit dropdown (line 255)
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#intercom-container",
        "#intercom-css-container",
        ".intercom-lightweight-app",
        'iframe[name*="intercom"]'
      ]);
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
        // Yahoo analytics pixels (homepage lines 1424-1425; pricing lines 1531, 1552)
        '[id^="batBeacon"]',
        // Bing tracking beacons — numeric suffix is page-specific
        // (homepage #batBeacon942788350180; pricing #batBeacon535441031900 wrapper
        // + nested img#batBeacon494714806976), so match by id prefix instead of a
        // hardcoded id.
        "iframe",
        // DoubleClick / empty tracking iframes (homepage 1405/1429/1431; pricing 1529/1553/1555)
        "canvas",
        // empty tracking <canvas> the scraper left in content (pricing line 1527)
        "meta",
        // stray meta tags inside content (homepage lines 257-258)
        "link",
        // stray stylesheet links inside content (homepage line 260; pricing lines 246-251, 1266)
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/semrush-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function findSectionEl(element, selector) {
    if (!selector) return null;
    return element.querySelector(selector) || element.querySelector(selector.split(">").pop().trim());
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    sections.forEach((section, index) => {
      const sectionEl = findSectionEl(element, section.selector);
      if (!sectionEl) return;
      const parent = sectionEl.parentNode;
      if (!parent) return;
      if (index > 0) {
        parent.insertBefore(doc.createElement("hr"), sectionEl);
      }
      (section.defaultContent || []).forEach((dcSelector) => {
        const dcEl = element.querySelector(dcSelector);
        if (dcEl && dcEl !== sectionEl && sectionEl.contains(dcEl)) {
          parent.insertBefore(dcEl, sectionEl);
        }
      });
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (sectionEl.nextSibling) {
          parent.insertBefore(metaBlock, sectionEl.nextSibling);
        } else {
          parent.appendChild(metaBlock);
        }
      }
    });
  }

  // tools/importer/import-pricing.js
  var PAGE_TEMPLATE = {
    name: "pricing",
    description: "Semrush pricing page (/pricing/ redirects to /pricing/seo/): plan cards, comparison table, add-ons cards, enterprise demo CTA, FAQ accordion, and testimonials carousel.",
    urls: [
      "https://www.semrush.com/pricing/"
    ],
    blocks: [
      {
        name: "cards-pricing",
        instances: ["ul[class*=cardsContainer]"]
      },
      {
        name: "table",
        instances: ["div[class*=MultiColumnTable]"]
      },
      {
        name: "cards-addons",
        instances: ['ul[class*="cards--"]']
      },
      {
        name: "columns-cta",
        instances: ["section[class*=CustomPlanRequest]"]
      },
      {
        name: "accordion",
        instances: ["section:has(h3[class*=SItemToggle])"]
      },
      {
        name: "carousel-testimonial",
        instances: ["div[class*=testimonialsSlider]"]
      }
    ],
    sections: [
      {
        id: "planHeader",
        name: "Page Header",
        selector: '#srf-skip-to-content > div[class*="styles-module__header"]',
        style: null,
        blocks: [],
        defaultContent: ["#srf-skip-to-content h1"]
      },
      {
        id: "planCards",
        name: "Pricing Plan Cards",
        selector: '#srf-skip-to-content > div:has(ul[class*="cardsContainer"])',
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: []
      },
      {
        id: "comparePlans",
        name: "Compare Plans Table",
        selector: '#srf-skip-to-content > div:has([class*="MultiColumnTable"])',
        style: null,
        blocks: ["table"],
        defaultContent: []
      },
      {
        id: "addons",
        name: "Add-ons",
        selector: '#srf-skip-to-content > section:has(ul[class*="cards--"])',
        style: null,
        blocks: ["cards-addons"],
        defaultContent: ['section:has(ul[class*="cards--"]) h2']
      },
      {
        id: "enterpriseDemo",
        name: "Enterprise Demo",
        selector: '#srf-skip-to-content > section[class*="CustomPlanRequest"]',
        style: "dark",
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "faq",
        name: "FAQ",
        selector: '#srf-skip-to-content > section:has(h3[class*="SItemToggle"])',
        style: null,
        blocks: ["accordion"],
        defaultContent: []
      },
      {
        id: "testimonials",
        name: "Testimonials",
        selector: '#srf-skip-to-content > section[class*="Testimonials"]',
        style: "accent",
        blocks: ["carousel-testimonial"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "cards-pricing": parse,
    table: parse2,
    "cards-addons": parse3,
    "columns-cta": parse4,
    accordion: parse5,
    "carousel-testimonial": parse6
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
  var import_pricing_default = {
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
  return __toCommonJS(import_pricing_exports);
})();
