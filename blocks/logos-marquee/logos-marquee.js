/**
 * Logos Marquee block.
 * Collects all logo images authored in the block and renders them in a
 * continuously scrolling marquee track. The track content is duplicated so the
 * animation can loop seamlessly.
 *
 * Authoring: one image (logo) per row, or several images in a single row.
 */
export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture, img')]
    .filter((el) => el.tagName === 'PICTURE' || !el.closest('picture'));

  const items = [];
  pictures.forEach((el) => {
    const li = document.createElement('li');
    li.className = 'logos-marquee-item';
    const node = el.tagName === 'PICTURE' ? el : el;
    li.append(node);
    items.push(li);
  });

  block.textContent = '';

  const list = document.createElement('div');
  list.className = 'logos-marquee-list';

  const track = document.createElement('ul');
  track.className = 'logos-marquee-track';
  items.forEach((li) => track.append(li));

  // Duplicate the track for a seamless infinite scroll.
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');

  list.append(track, clone);
  block.append(list);
}
