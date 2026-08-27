export interface MeowqueeDOM {
  viewport: HTMLDivElement;
  track: HTMLDivElement;
  content: HTMLDivElement;
}

export function createMeowqueeDOM(element: HTMLElement): MeowqueeDOM {
  const viewport = document.createElement('div');
  const track = document.createElement('div');
  const content = document.createElement('div');

  viewport.dataset.meowquee = 'viewport';
  track.dataset.meowquee = 'track';
  content.dataset.meowquee = 'content';

  viewport.style.width = '100%';
  viewport.style.overflow = 'hidden';

  track.style.width = 'max-content';
  track.style.display = 'flex';
  track.style.flexWrap = 'nowrap';
  track.style.willChange = 'transform';

  content.style.display = 'flex';
  content.style.flexShrink = '0';
  content.style.width = 'max-content';

  while (element.firstChild) {
    content.appendChild(element.firstChild);
  }

  track.appendChild(content);
  viewport.appendChild(track);
  element.appendChild(viewport);

  return {
    viewport,
    track,
    content,
  };
}

export function restoreMeowqueeDOM(element: HTMLElement, dom: MeowqueeDOM): void {
  const clones = dom.track.querySelectorAll('[data-meowquee-repeat]');

  clones.forEach((clone) => {
    clone.remove();
  });

  while (dom.content.firstChild) {
    element.appendChild(dom.content.firstChild);
  }

  dom.viewport.remove();
}
