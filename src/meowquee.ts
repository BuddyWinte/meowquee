import type {
  MeowqueeConfig,
  MeowqueeDirection,
} from './types';

import {
  createMeowqueeDOM,
  restoreMeowqueeDOM,
  type MeowqueeDOM,
} from './dom';

import {
  getStartPosition,
  updatePosition,
} from './animation';

export class Meowquee {
  readonly element: HTMLElement;

  private readonly viewport: HTMLDivElement;
  private readonly track: HTMLDivElement;

  private speed: number;
  private direction: MeowqueeDirection;
  private pauseOnHover: boolean;
  private respectReducedMotion: boolean;
  private autoplay: boolean;

  private position = 0;

  private viewportWidth = 0;
  private trackWidth = 0;

  private animationFrame: number | null = null;
  private lastTimestamp: number | null = null;

  private playing = false;
  private destroyed = false;

  private resizeObserver: ResizeObserver | null = null;

  constructor(
    element: HTMLElement,
    config: MeowqueeConfig = {},
  ) {
    this.element = element;

    this.speed = config.speed ?? 50;
    this.direction = config.direction ?? 'left';
    this.pauseOnHover = config.pauseOnHover ?? true;
    this.respectReducedMotion =
      config.respectReducedMotion ?? true;
    this.autoplay = config.autoplay ?? true;

    const dom: MeowqueeDOM = createMeowqueeDOM(element);

    this.viewport = dom.viewport;
    this.track = dom.track;

    this.initialize();
  }

  private initialize(): void {
    if (this.pauseOnHover) {
      this.viewport.addEventListener(
        'mouseenter',
        this.handleMouseEnter,
      );

      this.viewport.addEventListener(
        'mouseleave',
        this.handleMouseLeave,
      );
    }

    this.updateDimensions();
    this.resetPosition();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
        this.resetPosition();
      });

      this.resizeObserver.observe(this.element);
      this.resizeObserver.observe(this.track);
    }

    const prefersReducedMotion = window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .matches;

    if (
      this.autoplay &&
      (!this.respectReducedMotion || !prefersReducedMotion)
    ) {
      this.play();
    }
  }

  private handleMouseEnter = (): void => {
    this.pause();
  };

  private handleMouseLeave = (): void => {
    this.play();
  };

  private updateDimensions(): void {
    if (this.destroyed) {
      return;
    }

    this.viewportWidth = this.viewport.clientWidth;
    this.trackWidth =
      this.track.getBoundingClientRect().width;
  }

  private resetPosition(): void {
    this.position = getStartPosition(
      this.direction,
      this.viewportWidth,
      this.trackWidth,
    );

    this.render();
  }

  private render(): void {
    this.track.style.transform =
      `translate3d(${this.position}px, 0, 0)`;
  }

  private tick = (timestamp: number): void => {
    if (!this.playing || this.destroyed) {
      return;
    }

    const previousTimestamp = this.lastTimestamp;

    this.lastTimestamp = timestamp;

    if (previousTimestamp === null) {
      this.animationFrame =
        window.requestAnimationFrame(this.tick);

      return;
    }

    const delta =
      Math.min(timestamp - previousTimestamp, 100) / 1000;

    this.position = updatePosition(
      this.position,
      this.speed,
      this.direction,
      delta,
      this.viewportWidth,
      this.trackWidth,
    );

    this.render();

    this.animationFrame =
      window.requestAnimationFrame(this.tick);
  };

  play(): void {
    if (this.destroyed || this.playing) {
      return;
    }

    this.playing = true;
    this.lastTimestamp = null;

    this.animationFrame =
      window.requestAnimationFrame(this.tick);
  }

  pause(): void {
    if (!this.playing) {
      return;
    }

    this.playing = false;
    this.lastTimestamp = null;

    if (this.animationFrame !== null) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.pause();

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.viewport.removeEventListener(
      'mouseenter',
      this.handleMouseEnter,
    );

    this.viewport.removeEventListener(
      'mouseleave',
      this.handleMouseLeave,
    );

    restoreMeowqueeDOM(this.element, {
      viewport: this.viewport,
      track: this.track,
    });

    this.destroyed = true;
  }

  refresh(): void {
    if (this.destroyed) {
      return;
    }

    this.updateDimensions();
    this.resetPosition();
  }

  setSpeed(speed: number): void {
    if (!Number.isFinite(speed) || speed < 0) {
      throw new TypeError(
        'Meowquee speed must be a non-negative number.',
      );
    }

    this.speed = speed;
  }

  setDirection(direction: MeowqueeDirection): void {
    if (
      direction !== 'left' &&
      direction !== 'right'
    ) {
      throw new TypeError(
        'Meowquee direction must be either "left" or "right".',
      );
    }

    if (this.direction === direction) {
      return;
    }

    this.direction = direction;
    this.resetPosition();
  }

  get isPlaying(): boolean {
    return this.playing;
  }
}
