export type MeowqueeDirection = 'left' | 'right';

export interface MeowqueeConfig {
  /**
   * Movement speed in pixels per second.
   *
   * @default 50
   * @min 0
   * @max Infinity
   */
  speed?: number;

  /**
   * Direction the content moves.
   *
   * @default 'left'
   */
  direction?: MeowqueeDirection;

  /**
   * Start moving immediately.
   *
   * @default true
   */
  autoplay?: boolean;

  /**
   * Pause the animation on hover.
   *
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Respect the user's reduced motion preference.
   *
   * @default true
   */
  respectReducedMotion?: boolean;
}
