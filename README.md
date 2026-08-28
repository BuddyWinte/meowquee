# Meowquee

![GitHub Release](https://img.shields.io/github/v/release/buddywinte/meowquee)
[![Discord](https://img.shields.io/discord/1375986160995930132?style=plastic&logo=discord&label=Discord)](https://discord.gg/Ruk58PhJvm)
![NPM Version](https://img.shields.io/npm/v/meowquee)
![Downloads](https://img.shields.io/npm/dm/meowquee)
![Total Downloads](https://img.shields.io/npm/dt/meowquee)

A lightweight headless marquee engine for building pawesome scrolling content.

> [!WARNING]
> **Known CSS limitation**: Meowquee currently adds internal `<div>` wrappers around the marquee content. Because of this, CSS selectors that rely on the marquee element being the direct parent of its children, such as `.marquee > a`, will not work as expected.
>
> We are actively working on improving how Meowquee handles the DOM so existing CSS selectors can be preserved. Thanks for the patience!

## Features

- Pawesomely lightweight, dependency-free marquee engine
- Typescript-first
- Completely plug-and-play
- Accessible by default (NOT FULLY, WE ARE STILL WORKING ON THIS BEFORE V1.0.0)
- Framework agnostic
- Headless (no forced styles)

> [!NOTE]
> Marquees are visual by design. Meowquee treats marquee content as decorative/visual by default because continuously moving content should generally not contain important information. If content is genuinely necessary, it should be presented in a way that users have enough time to read and interact with it.

## Installation

```bash
npm install meowquee
bun add meowquee
pnpm install meowquee
```

### CDN

Meowquee can also be loaded directly from a CDN:

```html
<script type="module">
  import Meowquee from "https://cdn.jsdelivr.net/npm/meowquee/dist/meowquee.mjs";
  const element = document.querySelector("#marquee");
  if (element) {
    const marquee = new Meowquee(element);
  }
</script>
```

## Basic Usage

```html
<div id="marquee">Hello! This content is powered by Meowquee.</div>
```

```js
import { Meowquee } from "meowquee";

const element = document.querySelector("#marquee");

if (element) {
  const marquee = new Meowquee(element);
}
```

Meowquee takes the existing contents of the element and turns them into a scrolling marquee.

## Configuration

All options are optional.

```js
const marquee = new Meowquee(element, {
  speed: 50,
  direction: "left",
  autoplay: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  accessibility: "decorative",
  respectReducedMotion: true,
  repeat: true,
  gap: "0px",
  observeResize: true,
  observeMutations: true,
});
```

### Defaults

| Option                 | Default      | Description                                        |
| ---------------------- | ------------ | -------------------------------------------------- |
| `speed`                | 50           | Scroll speed in pixels per frame                   |
| `direction`            | 'left'       | Scroll direction ('left' or 'right')               |
| `autoplay`             | false        | Whether to automatically start scrolling           |
| `pauseOnHover`         | false        | Whether to pause on hover                          |
| `pauseOnFocus`         | false        | Whether to pause on focus                          |
| `accessibility`        | 'decorative' | Accessibility mode ('decorative' or 'informative') |
| `respectReducedMotion` | false        | Whether to respect reduced motion preferences      |
| `repeat`               | false        | Whether to repeat the marquee content              |
| `gap`                  | '0px'        | Gap between marquee items                          |
| `observeResize`        | true         | Whether to observe resize events                   |
| `observeMutations`     | true         | Whether to observe DOM mutations                   |

### Accessibility

`accessibility: 'decorative'` is the default and recommended mode for normal marquees. The marquee is treated as visual content and hidden from assistive technologies.

For genuinely meaningful marquee content, use:

```js
new Meowquee(element, {
  accessibility: "content",
  ariaLabel: "Latest announcements",
});
```

Even in content mode, repeated copies are hidden from assistive technologies to prevent duplicate content.
Meowquee also pauses when focused or hovered by default and respects `prefers-reduced-motion`.

## Browser Requirements

Meowquee requires a browser environment and uses modern browser APIs including:

- `requestAnimationFrame`
- `ResizeObserver`
- `window.matchMedia`

It is not intended for server-side execution.

---

## License

Copyright 2026 BuddyWinte

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
