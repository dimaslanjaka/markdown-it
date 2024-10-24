import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { globSync } from 'glob';
import { external } from './rollup.utils.js';
import support from './support/rollup.config.mjs';

// Get all entry points from the directory
const input = globSync(['./lib/**/*.{ts,js,cjs,mjs}'], { posix: true });

/**
 * @type {import('rollup').RollupOptions}
 */
const preserverDirs = {
  input, // Use the input array directly
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      exports: 'named'
    },
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].cjs'
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].mjs'
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json'
    }),
    resolve(), // Resolve node_modules
    commonjs(), // Convert CommonJS modules to ES6
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**' // Exclude node_modules from transpilation
    })
  ],
  external
};

/**
 * @type {import('rollup').RollupOptions}
 */
const cjsOneFile = {
  input: './index.mjs', // Use the input array directly
  output: {
    file: 'dist/markdown-it.cjs',
    format: 'cjs',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json'
    }),
    resolve(), // Resolve node_modules
    commonjs(), // Convert CommonJS modules to ES6
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**' // Exclude node_modules from transpilation
    })
  ],
  external
};

export default [preserverDirs, cjsOneFile, ...support]; // Export the configuration
