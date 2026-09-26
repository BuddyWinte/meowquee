export interface MeowqueeDOM {
  viewport: HTMLDivElement;
  track: HTMLDivElement;
}

export function createMeowqueeDOM(element: HTMLElement): MeowqueeDOM {
  const viewport = document.createElement('div');
  viewport.dataset.meowquee = 'viewport';
  viewport.style.width = '100%';
  viewport.style.overflow = 'hidden';

  const track = document.createElement('div');
  track.dataset.meowquee = 'track';
  track.style.display = 'flex';
  track.style.flexWrap = 'nowrap';
  track.style.width = 'max-content';
  track.style.willChange = 'transform';

  element.parentNode?.insertBefore(viewport, element);
  viewport.appendChild(track);
  track.appendChild(element);

  return {
    viewport,
    track,
  };
}

export function configureAccessibility(
  element: HTMLElement,
  dom: MeowqueeDOM,
  accessibility: 'decorative' | 'content',
  ariaLabel?: string,
): void {
  if (accessibility === 'decorative') {
    element.setAttribute('aria-hidden', 'true');

    return;
  }

  element.removeAttribute('aria-hidden');
  element.inert = false;

  if (ariaLabel !== undefined) {
    element.setAttribute('aria-label', ariaLabel);
  }

  dom.viewport.removeAttribute('aria-hidden');
  dom.viewport.inert = false;
}

export function createRepeat(element: HTMLElement): HTMLElement {
  const repeat = element.cloneNode(true) as HTMLElement;

  repeat.removeAttribute('id');
  repeat.removeAttribute('data-meowquee');
  repeat.dataset.meowqueeRepeat = 'true';

  repeat.setAttribute('aria-hidden', 'true');
  repeat.inert = true;

  return repeat;
}

export function restoreAccessibility(
  element: HTMLElement,
  accessibility: 'decorative' | 'content',
  ariaLabel?: string,
): void {
  if (accessibility === 'decorative') {
    element.removeAttribute('aria-hidden');

    return;
  }

  if (ariaLabel !== undefined) {
    element.removeAttribute('aria-label');
  }
}

export function restoreMeowqueeDOM(element: HTMLElement, dom: MeowqueeDOM): void {
  dom.track.querySelectorAll('[data-meowquee-repeat]').forEach((clone) => clone.remove());

  // The viewport took the element's place in the parent, so it is the node that
  // has to be swapped back. Replacing the track leaves the viewport wrapping the
  // element, and another wrapper is added on every create/destroy cycle.
  dom.viewport.replaceWith(element);
}
