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
  * > http://www.apache.org/licenses/LICENSE-2.0
  *
  * License: Apache-2.0
  */`;

export default [
  {
    input: 'src/index.ts',

    output: {
      file: 'dist/meowquee.mjs',
      format: 'es',
      sourcemap: true,
      banner,
    },

    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),

      terser({
        format: {
          comments: /^!/,
        },
      }),
    ],
  },

  {
    input: 'src/index.ts',

    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },

    plugins: [dts()],
  },
];
