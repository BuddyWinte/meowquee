export type MeowqueeDirection = 'left' | 'right';

export interface MeowqueeConfig {
  /**
   * Movement speed in pixels per second.
   *
   * @default 50
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
   * Controls whether Meowquee respects the user's `prefers-reduced-motion` preference.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion}
   *
   * @default true
   */
  respectReducedMotion?: boolean;

  /**
   * Controls whether marquee content is repeated continuously.
   *
   * For text marquees, it is recommended to include a separator such as `|` at the end of the content when a clear visual separation between
   * repetitions is desired.
   *
   * @default true
   */
  repeat?: boolean;

  /**
   * Space between repeated marquee content.
   *
   * The value accepts any valid CSS `<length>` value.
   *
   * @default "0px"
   */
  gap?: string;
}
