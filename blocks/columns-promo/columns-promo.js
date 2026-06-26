export default function decorate(block) {
  const row = block.firstElementChild;
  const cols = [...row.children];
  block.classList.add(`columns-promo-${cols.length}-cols`);

  // The block authors two stacked promo panels as two cells of a single row.
  // First cell = light "Semrush One" panel, second cell = dark "Enterprise" panel.
  cols.forEach((col, i) => {
    col.classList.add('columns-promo-panel');
    col.classList.add(i === 0 ? 'columns-promo-light' : 'columns-promo-dark');

    // Convert each bare .mp4 link into an inline, muted, autoplaying video so the
    // promo media renders like the source (the authored cell holds an <a> to the file).
    const videoLink = [...col.querySelectorAll('a')].find((a) => /\.mp4(\?|$)/i.test(a.getAttribute('href') || ''));
    if (videoLink) {
      const src = videoLink.getAttribute('href');
      const wrapper = document.createElement('div');
      wrapper.className = 'columns-promo-video';
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'metadata');
      wrapper.append(video);
      // replace the paragraph that wraps the link
      const host = videoLink.closest('p') || videoLink;
      host.replaceWith(wrapper);
    }

    // Mark the CTA link as a button-style element.
    const cta = col.querySelector('a:not([href$=".mp4"])');
    if (cta) cta.classList.add('columns-promo-cta');
  });
}
