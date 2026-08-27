# Meowquee

A lightweight headless marquee engine for building pawesome scrolling content.

> **Beta Warning**: Meowquee is currently in `0.0.9-beta.1`. The API may change before the first stable release.

> [!WARNING]
> **Known CSS limitation**: Meowquee currently adds internal `<div>` wrappers around the marquee content. Because of this, CSS selectors that rely on the marquee element being the direct parent of its children, such as `.marquee > a`, will not work as expected. We are actively working on improving how Meowquee handles the DOM so existing CSS selectors can be preserved. **thanks for the patience**!

## Features

- Pawesomely lightweight, dependency-free marquee engine
- Typescript-first
- Completely plug-and-play
- Accessible by default (NOT FULLY, WE ARE STILL WORKING ON THIS BEFORE V1.0.0)
- Framework agnostic
- Headless (no forced styles)

## Installation

```bash
npm install meowquee
bun add meowquee
pnpm install meowquee
```

## Basic Usage

```js
import { Meowquee } from "meowquee";

const element = document.querySelector < HTMLElement > "#marquee";

if (element) {
  const marquee = new Meowquee(element);
}
<div id="marquee">Hello! This content is powered by Meowquee.</div>;
```

Meowquee takes the existing contents of the element and turns them into a scrolling marquee.

## Configuration

All configuration options are optional.

```js
const marquee = new Meowquee(element, {
  speed: 50,
  direction: "left",
  autoplay: true,
  pauseOnHover: true,
  respectReducedMotion: true,
});
```

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
