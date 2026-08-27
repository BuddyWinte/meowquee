/**
 * Meowquee
 * Copyright (c) 2026 BuddyWinte
 *
 * Licensed under the Apache License, Version 2.0.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
 import { Meowquee } from './meowquee';

 import type {
   MeowqueeConfig,
   MeowqueeDirection,
 } from './types';

 export { Meowquee };

 export type {
   MeowqueeConfig,
   MeowqueeDirection,
 };

 export function meowquee(
   element: HTMLElement,
   config?: MeowqueeConfig,
 ): Meowquee {
   return new Meowquee(element, config);
 }

 export default meowquee;
