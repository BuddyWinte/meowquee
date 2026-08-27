export interface MeowqueeDOM {
  viewport: HTMLDivElement;
  track: HTMLDivElement;
}

export function createMeowqueeDOM(
  element: HTMLElement,
): MeowqueeDOM {
  const viewport = document.createElement('div');
  const track = document.createElement('div');

  viewport.dataset.meowquee = 'viewport';
  track.dataset.meowquee = 'track';
  viewport.style.width = '100%';
  viewport.style.overflow = 'hidden';
  track.style.width = 'max-content';
  track.style.display = 'flex';
  track.style.flexWrap = 'nowrap';
  track.style.width = 'max-content';
  track.style.willChange = 'transform';
  while (element.firstChild) {
    track.appendChild(element.firstChild);
  }

  viewport.appendChild(track);
  element.appendChild(viewport);

  return {
    viewport,
    track,
  };
}

export function restoreMeowqueeDOM(
  element: HTMLElement,
  dom: MeowqueeDOM,
): void {
  while (dom.track.firstChild) {
    element.appendChild(dom.track.firstChild);
  }

  dom.viewport.remove();
}
