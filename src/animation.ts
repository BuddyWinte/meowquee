import type { MeowqueeDirection } from './types';

export function getStartPosition(
  direction: MeowqueeDirection,
  viewportWidth: number,
  contentWidth: number,
  repeat: boolean,
): number {
  if (repeat) {
    return 0;
  }

  return direction === 'left' ? viewportWidth : -contentWidth;
}

export function updatePosition(
  position: number,
  speed: number,
  direction: MeowqueeDirection,
  delta: number,
  viewportWidth: number,
  contentWidth: number,
  repeat: boolean,
  repeatWidth: number,
): number {
  const distance = speed * delta;

  if (direction === 'left') {
    position -= distance;

    if (repeat) {
      if (position <= -repeatWidth) {
        position += repeatWidth;
      }
    } else if (position <= -contentWidth) {
      position = viewportWidth;
    }
  } else {
    position += distance;

    if (repeat) {
      if (position >= repeatWidth) {
        position -= repeatWidth;
      }
    } else if (position >= viewportWidth) {
      position = -contentWidth;
    }
  }

  return position;
}
