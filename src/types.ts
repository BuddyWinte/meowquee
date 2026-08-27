export type MeowqueeDirection = 'left' | 'right';

export interface MeowqueeConfig {
  /**
   * Movement speed in pixels per second.
   */
  speed?: number;

  /**
   * Direction the content moves.
   */
  direction?: MeowqueeDirection;

  /**
   * Start moving immediately.
   */
  autoplay?: boolean;
}
