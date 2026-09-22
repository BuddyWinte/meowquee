import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import pkg from './package.json' with { type: 'json' };

const banner = `/*!
  * ${pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)} v${pkg.version}
  * ${pkg.description}
  *
  * Maintained by BuddyWinte and pawsome contributors
  * https://github.com/BuddyWinte/Meowquee
  *
  * Copyright (c) 2026 BuddyWinte
  * You may obtain a copy of the License at
  * https://www.apache.org/licenses/LICENSE-2.0
  *
  * License: Apache-2.0
  */`;

const typescriptPlugin = typescript({
  tsconfig: './tsconfig.json',
});

const minify = terser({
  format: {
    comments: /^!/,
  },
});

export default [
  // ESM
  {
    input: 'src/index.ts',

    output: [
      {
        file: 'dist/meowquee.mjs',
        format: 'es',
        sourcemap: true,
        banner,
      },
      {
        file: 'dist/meowquee.min.mjs',
        format: 'es',
        sourcemap: true,
        banner,
        plugins: [minify],
      },
    ],

    plugins: [typescriptPlugin],
  },

  // IIFE
  {
    input: 'src/index.ts',

    output: [
      {
        file: 'dist/meowquee.iife.js',
        format: 'iife',
        name: 'Meowquee',
        exports: 'named',
        sourcemap: true,
        banner,
      },
      {
        file: 'dist/meowquee.iife.min.js',
        format: 'iife',
        name: 'Meowquee',
        exports: 'named',
        sourcemap: true,
        banner,
        plugins: [minify],
      },
    ],

    plugins: [typescriptPlugin],
  },

  // types
  {
    input: 'src/index.ts',

    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },

    plugins: [dts()],
  },
];
