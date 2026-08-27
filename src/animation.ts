import type { MeowqueeDirection } from './types';

export function getStartPosition(
  direction: MeowqueeDirection,
  viewportWidth: number,
  contentWidth: number,
): number {
  return direction === 'left'
    ? viewportWidth
    : -contentWidth;
}

export function updatePosition(
  position: number,
  speed: number,
  direction: MeowqueeDirection,
  delta: number,
  viewportWidth: number,
  contentWidth: number,
): number {
  const distance = speed * delta;

  if (direction === 'left') {
    position -= distance;

    if (position <= -contentWidth) {
      position = viewportWidth;
    }
  } else {
    position += distance;

    if (position >= viewportWidth) {
      position = -contentWidth;
    }
  }

  return position;
}
