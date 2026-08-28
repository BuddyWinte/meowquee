export type MeowqueeDirection = 'left' | 'right';

export type MeowqueeAccessibility = 'decorative' | 'content';

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
   * Pause the animation while an element inside the marquee has focus.
   *
   * @default true
   */
  pauseOnFocus?: boolean;

  /**
   * Controls how the marquee is exposed to assistive technologies.
   *
   * `decorative` hides the marquee from assistive technologies and makes
   * its contents inert.
   *
   * `content` keeps the original content accessible while generated
   * repetitions remain hidden.
   *
   * @default 'decorative'
   */
  accessibility?: MeowqueeAccessibility;

  /**
   * Accessible label for the marquee.
   *
   * This is only applied when `accessibility` is `content`.
   */
  ariaLabel?: string;

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
   * For text marquees, it is recommended to include a separator such as
   * `|` at the end of the content when a clear visual separation between
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

  /**
   * Automatically respond to marquee size changes.
   *
   * @default true
   */
  observeResize?: boolean;

  /**
   * Automatically respond to changes to the marquee's content.
   *
   * @default true
   */
  observeMutations?: boolean;
}
