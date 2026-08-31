import { getStartPosition, updatePosition } from './animation';
import {
  configureAccessibility,
  createMeowqueeDOM,
  createRepeat,
  restoreMeowqueeDOM,
  type MeowqueeDOM,
} from './dom';
import type { MeowqueeAccessibility, MeowqueeConfig, MeowqueeDirection } from './types';

export class Meowquee {
  readonly element: HTMLElement;

  private readonly viewport: HTMLDivElement;
  private readonly track: HTMLDivElement;
  private readonly content: HTMLDivElement;

  private speed: number;
  private direction: MeowqueeDirection;
  private pauseOnHover: boolean;
  private pauseOnFocus: boolean;
  private respectReducedMotion: boolean;
  private autoplay: boolean;
  private repeat: boolean;
  private gap: string;
  private accessibility: MeowqueeAccessibility;
  private ariaLabel?: string;
  private observeResize: boolean;
  private observeMutations: boolean;

  private contentWidth = 0;
  private repeatWidth = 0;
  private viewportWidth = 0;

  private readonly repeatNodes: HTMLDivElement[] = [];

  private position = 0;

  private animationFrame: number | null = null;
  private lastTimestamp: number | null = null;

  private playing = false;
  private destroyed = false;

  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private reducedMotionQuery: MediaQueryList | null = null;

  private hovered = false;
  private focused = false;
  private reducedMotion = false;

  constructor(element: HTMLElement, config: MeowqueeConfig = {}) {
    this.element = element;

    this.speed = config.speed ?? 50;
    this.direction = config.direction ?? 'left';
    this.pauseOnHover = config.pauseOnHover ?? true;
    this.pauseOnFocus = config.pauseOnFocus ?? true;
    this.respectReducedMotion = config.respectReducedMotion ?? true;
    this.autoplay = config.autoplay ?? true;
    this.repeat = config.repeat ?? true;
    this.gap = config.gap ?? '0px';
    this.accessibility = config.accessibility ?? 'decorative';
    this.ariaLabel = config.ariaLabel;
    this.observeResize = config.observeResize ?? true;
    this.observeMutations = config.observeMutations ?? true;

    this.validateConfiguration();

    const dom: MeowqueeDOM = createMeowqueeDOM(element);

    this.viewport = dom.viewport;
    this.track = dom.track;
    this.content = dom.content;

    this.initialize();
  }

  private validateConfiguration(): void {
    if (!Number.isFinite(this.speed) || this.speed < 0) {
      throw new TypeError('Meowquee speed must be a non-negative number.');
    }

    if (this.direction !== 'left' && this.direction !== 'right') {
      throw new TypeError('Meowquee direction must be either "left" or "right".');
    }

    if (this.accessibility !== 'decorative' && this.accessibility !== 'content') {
      throw new TypeError('Meowquee accessibility must be either "decorative" or "content".');
    }

    if (typeof this.gap !== 'string') {
      throw new TypeError('Meowquee gap must be a CSS length string.');
    }
  }

  private initialize(): void {
    this.track.style.gap = this.gap;

    configureAccessibility(
      this.element,
      {
        viewport: this.viewport,
        track: this.track,
        content: this.content,
      },
      this.accessibility,
      this.ariaLabel,
    );

    if (this.pauseOnHover) {
      this.viewport.addEventListener('mouseenter', this.handleMouseEnter);

      this.viewport.addEventListener('mouseleave', this.handleMouseLeave);
    }

    if (this.pauseOnFocus) {
      this.viewport.addEventListener('focusin', this.handleFocusIn);

      this.viewport.addEventListener('focusout', this.handleFocusOut);
    }

    this.setupReducedMotion();
    this.setupResizeObserver();
    this.setupMutationObserver();

    this.updateDimensions();
    this.resetPosition();

    if (this.autoplay && !this.shouldPause()) {
      this.play();
    }
  }

  private setupReducedMotion(): void {
    if (!this.respectReducedMotion) {
      return;
    }

    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    this.reducedMotion = this.reducedMotionQuery.matches;

    this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange);
  }

  private setupResizeObserver(): void {
    if (!this.observeResize || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateDimensions();
    });

    this.resizeObserver.observe(this.element);
    this.resizeObserver.observe(this.track);
  }

  private setupMutationObserver(): void {
    if (!this.observeMutations || typeof MutationObserver === 'undefined') {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.updateDimensions();
    });

    this.mutationObserver.observe(this.content, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private buildRepeats(): void {
    this.clearRepeats();

    if (!this.repeat || this.repeatWidth <= 0) {
      return;
    }

    const copiesNeeded = Math.ceil(this.viewportWidth / this.repeatWidth) + 1;

    for (let copy = 0; copy < copiesNeeded; copy++) {
      const clone = createRepeat(this.content);

      this.track.appendChild(clone);
      this.repeatNodes.push(clone);
    }
  }

  private clearRepeats(): void {
    for (const node of this.repeatNodes) {
      node.remove();
    }

    this.repeatNodes.length = 0;
  }

  private getGapWidth(): number {
    const styles = window.getComputedStyle(this.track);

    return parseFloat(styles.columnGap) || 0;
  }

  private handleMouseEnter = (): void => {
    this.hovered = true;
    this.updatePlaybackState();
  };

  private handleMouseLeave = (): void => {
    this.hovered = false;
    this.updatePlaybackState();
  };

  private handleFocusIn = (): void => {
    this.focused = true;
    this.updatePlaybackState();
  };

  private handleFocusOut = (): void => {
    this.focused = this.viewport.contains(document.activeElement);

    this.updatePlaybackState();
  };

  private handleReducedMotionChange = (event: MediaQueryListEvent): void => {
    this.reducedMotion = event.matches;
    this.updatePlaybackState();
  };

  private shouldPause(): boolean {
    if (this.hovered) {
      return true;
    }

    if (this.focused) {
      return true;
    }

    if (this.respectReducedMotion && this.reducedMotion) {
      return true;
    }

    return false;
  }

  private updatePlaybackState(): void {
    if (this.shouldPause()) {
      this.pause();
      return;
    }

    if (this.autoplay) {
      this.play();
    }
  }

  private updateDimensions(): void {
    if (this.destroyed) {
      return;
    }

    const previousRepeatWidth = this.repeatWidth;

    this.viewportWidth = this.viewport.clientWidth;

    this.clearRepeats();

    this.contentWidth = this.content.getBoundingClientRect().width;

    this.repeatWidth = this.contentWidth + this.getGapWidth();

    this.buildRepeats();

    if (previousRepeatWidth > 0 && this.repeatWidth > 0 && this.repeat) {
      this.position = this.position % this.repeatWidth;

      if (this.position > 0) {
        this.position -= this.repeatWidth;
      }

      this.render();
    }
  }

  private resetPosition(): void {
    this.position = getStartPosition(
      this.direction,
      this.viewportWidth,
      this.contentWidth,
      this.repeat,
      this.repeatWidth,
    );

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
      this.animationFrame = window.requestAnimationFrame(this.tick);

      return;
    }

    const delta = Math.min(timestamp - previousTimestamp, 100) / 1000;

    this.position = updatePosition({
      position: this.position,
      speed: this.speed,
      direction: this.direction,
      delta,
      viewportWidth: this.viewportWidth,
      contentWidth: this.contentWidth,
      repeat: this.repeat,
      repeatWidth: this.repeatWidth,
    });

    this.render();

    this.animationFrame = window.requestAnimationFrame(this.tick);
  };

  play(): void {
    if (this.destroyed || this.playing || this.shouldPause()) {
      return;
    }

    this.playing = true;
    this.lastTimestamp = null;

    this.animationFrame = window.requestAnimationFrame(this.tick);
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

    this.mutationObserver?.disconnect();
    this.mutationObserver = null;

    this.reducedMotionQuery?.removeEventListener('change', this.handleReducedMotionChange);

    this.reducedMotionQuery = null;

    this.viewport.removeEventListener('mouseenter', this.handleMouseEnter);

    this.viewport.removeEventListener('mouseleave', this.handleMouseLeave);

    this.viewport.removeEventListener('focusin', this.handleFocusIn);

    this.viewport.removeEventListener('focusout', this.handleFocusOut);

    this.clearRepeats();

    this.element.removeAttribute('aria-hidden');
    this.element.inert = false;

    restoreMeowqueeDOM(this.element, {
      viewport: this.viewport,
      track: this.track,
      content: this.content,
    });

    this.destroyed = true;
  }

  refresh(): void {
    if (this.destroyed) {
      return;
    }

    this.updateDimensions();
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
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  get isDestroyed(): boolean {
    return this.destroyed;
  }

  get currentSpeed(): number {
    return this.speed;
  }

  get currentDirection(): MeowqueeDirection {
    return this.direction;
  }
}
