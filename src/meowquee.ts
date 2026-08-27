import type { MeowqueeConfig, MeowqueeDirection } from './types';

export class Meowquee {
  readonly element: HTMLElement;

  private readonly viewport: HTMLDivElement;
  private readonly track: HTMLDivElement;

  private speed: number;
  private direction: MeowqueeDirection;

  private position = 0;

  private viewportWidth = 0;
  private trackWidth = 0;

  private animationFrame: number | null = null;
  private lastTimestamp: number | null = null;

  private playing = false;
  private destroyed = false;

  private resizeObserver: ResizeObserver | null = null;

  constructor(element: HTMLElement, config: MeowqueeConfig = {}) {
    this.element = element;

    this.speed = config.speed ?? 50;
    this.direction = config.direction ?? 'left';

    this.viewport = document.createElement('div');
    this.track = document.createElement('div');

    this.initialize();

    if (config.autoplay ?? true) {
      this.play();
    }
  }

  private initialize(): void {
    const { element, viewport, track } = this;

    viewport.style.width = '100%';
    viewport.style.overflow = 'hidden';
    viewport.style.whiteSpace = 'nowrap';

    track.style.width = 'max-content';
    track.style.whiteSpace = 'nowrap';
    track.style.willChange = 'transform';

    while (element.firstChild) {
      track.appendChild(element.firstChild);
    }

    viewport.appendChild(track);
    element.appendChild(viewport);

    this.updateDimensions();
    this.resetPosition();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
        this.resetPosition();
      });

      this.resizeObserver.observe(viewport);
      this.resizeObserver.observe(track);
    }
  }

  private updateDimensions(): void {
    if (this.destroyed) {
      return;
    }

    this.viewportWidth = this.viewport.clientWidth;

    this.trackWidth = this.track.getBoundingClientRect().width;
  }

  private getStartPosition(): number {
    return this.direction === 'left' ? this.viewportWidth : -this.trackWidth;
  }

  private resetPosition(): void {
    this.position = this.getStartPosition();

    this.render();
  }

  private render(): void {
    this.track.style.transform = `translate3d(${this.position}px, 0, 0)`;
  }

  private tick = (timestamp: number): void => {
    if (!this.playing || this.destroyed) {
      return;
    }

    const previousTimestamp = this.lastTimestamp;

    this.lastTimestamp = timestamp;

    if (previousTimestamp === null) {
      this.animationFrame = requestAnimationFrame(this.tick);

      return;
    }

    const delta = Math.min(timestamp - previousTimestamp, 100) / 1000;

    const distance = this.speed * delta;

    if (this.direction === 'left') {
      this.position -= distance;

      if (this.position <= -this.trackWidth) {
        this.position = this.viewportWidth;
      }
    } else {
      this.position += distance;

      if (this.position >= this.viewportWidth) {
        this.position = -this.trackWidth;
      }
    }

    this.render();

    this.animationFrame = requestAnimationFrame(this.tick);
  };

  play(): void {
    if (this.destroyed || this.playing) {
      return;
    }

    this.playing = true;
    this.lastTimestamp = null;

    this.animationFrame = requestAnimationFrame(this.tick);
  }

  pause(): void {
    if (!this.playing) {
      return;
    }

    this.playing = false;
    this.lastTimestamp = null;

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);

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

    while (this.track.firstChild) {
      this.element.appendChild(this.track.firstChild);
    }

    this.viewport.remove();

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
      throw new TypeError('Meowquee speed must be a non-negative number.');
    }

    this.speed = speed;
  }

  setDirection(direction: MeowqueeDirection): void {
    if (direction !== 'left' && direction !== 'right') {
      throw new TypeError('Meowquee direction must be either "left" or "right".');
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
