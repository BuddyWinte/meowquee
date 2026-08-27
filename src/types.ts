export type MeowqueeDirection = 'left' | 'right';

export interface MeowqueeConfig {
  /**
   * Movement speed in pixels per second.
   *
   * @default 70
   * @min 1
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
   * Respect the user's reduced motion preference. We highly recommend having this enabled
   *
   * @default true
   */
  respectReducedMotion?: boolean;
}
