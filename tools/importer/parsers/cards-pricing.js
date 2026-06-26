/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-pricing.
 * Base block: cards (no card image — content goes in a single cell per row).
 * Source: https://www.semrush.com/pricing/ (ul[class*=cardsContainer])
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Cards" + authoring-analysis):
 *   Row 1: block name
 *   One row per pricing tier card. Each card's single cell holds:
 *     plan name (heading), short description, price (with strikethrough
 *     original + billing note), a "Try for free" CTA, and a
 *     "What's inside" bulleted feature list.
 */
export default function parse(element, { document }) {
  const cards = Array.from(
    element.querySelectorAll('li[class*="styles-module__card--"], li[class*="__card--"]'),
  );

  const cells = [];

  cards.forEach((card) => {
    const contentCell = [];

    // Plan name → heading
    const title = card.querySelector('h2[class*="title--"], h2');
    if (title && title.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      contentCell.push(h);
    }

    // Short description / audience
    const audience = card.querySelector('p[class*="audience--"]');
    if (audience && audience.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = audience.textContent.trim();
      contentCell.push(p);
    }

    // Price block: discounted price, billing note, strikethrough original
    const priceColumn = card.querySelector('[class*="priceColumn--"]');
    if (priceColumn) {
      // Visible price text (e.g. "$117.33/mo"), excluding screen-reader-only nodes
      const priceText = priceColumn
        .querySelector('div > span[class*="_size_200"]:not([class*="ScreenReaderOnly"])');
      const billing = priceColumn.querySelector('p');
      const original = priceColumn.querySelector('del[class*="crossedPrice--"], del');

      const priceP = document.createElement('p');
      const priceParts = [];
      if (priceText && priceText.textContent.trim()) {
        priceParts.push(`<strong>${priceText.textContent.replace(/\s+/g, ' ').trim()}</strong>`);
      }
      if (original && original.textContent.trim()) {
        priceParts.push(`<del>${original.textContent.trim()}</del>`);
      }
      if (priceParts.length) {
        priceP.innerHTML = priceParts.join(' ');
        contentCell.push(priceP);
      }
      if (billing && billing.textContent.trim()) {
        const billP = document.createElement('p');
        billP.textContent = billing.textContent.trim();
        contentCell.push(billP);
      }
    }

    // Primary CTA ("Try for free")
    const cta = card.querySelector('a[class*="ButtonResolver-module__button--"], a[class*="__button--"]');
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.getAttribute('href') || '#';
      link.textContent = (cta.textContent || 'Try for free').replace(/\s+/g, ' ').trim();
      const p = document.createElement('p');
      p.append(link);
      contentCell.push(p);
    }

    // "What's inside" feature list
    const featureList = card.querySelector('ul[class*="KeyFeaturesList-module__List--"], ul[class*="__List--"]');
    if (featureList) {
      const sectionTitle = card.querySelector('p[class*="SectionTitle--"]');
      if (sectionTitle && sectionTitle.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${sectionTitle.textContent.trim()}</strong>`;
        contentCell.push(p);
      }

      const items = Array.from(
        featureList.querySelectorAll('li[class*="KeyFeaturesList-module__Item--"], li[class*="__Item--"]'),
      );
      if (items.length) {
        const ul = document.createElement('ul');
        items.forEach((item) => {
          const textNode = item.querySelector('[class*="SContent"] span, [class*="SContent"]');
          const text = (textNode || item).textContent.replace(/\s+/g, ' ').trim();
          if (text) {
            const li = document.createElement('li');
            li.textContent = text;
            ul.append(li);
          }
        });
        if (ul.children.length) contentCell.push(ul);
      }
    }

    if (contentCell.length) {
      cells.push([contentCell]); // 1-column row, one card per row
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
