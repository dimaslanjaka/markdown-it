import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'upath';
import { external } from './rollup.utils.js';
import support from './support/rollup.config.mjs';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all entry points from the directory
const input = globSync(['./lib/**/*.{ts,js,cjs,mjs}'], { cwd: __dirname }).map((file) => pathResolve(__dirname, file));

/**
 * @type {import('rollup').RollupOptions}
 */
const preserverDirs = {
  input,
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      entryFileNames: entryFileNamesWithExt('cjs'),
      chunkFileNames: chunkFileNamesWithExt('cjs'),
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      entryFileNames: entryFileNamesWithExt('mjs'),
      chunkFileNames: chunkFileNamesWithExt('mjs'),
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
  input: './index.mjs',
  output: [
    {
      file: 'dist/markdown-it.mjs',
      format: 'esm',
      sourcemap: false
    },
    {
      file: 'dist/markdown-it.cjs',
      format: 'cjs',
      sourcemap: false
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
 * Returns a function to generate entry file names with the given extension for Rollup output.
 *
 * For files from node_modules, places them in the dependencies folder and logs the mapping.
 *
 * @param {string} ext The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { facadeModuleId: string }) => string} Function that generates the output file name for a given entry.
 */
export function entryFileNamesWithExt(ext) {
  // Ensure the extension does not start with a dot
  if (ext.startsWith('.')) {
    ext = ext.slice(1);
  }
  return function ({ facadeModuleId }) {
    facadeModuleId = path.toUnix(facadeModuleId);
    if (!facadeModuleId.includes('node_modules')) {
      return `[name].${ext}`;
    }
    // Find the first occurrence of 'node_modules' and slice from there
    const nodeModulesIdx = facadeModuleId.indexOf('node_modules');
    let rel = facadeModuleId.slice(nodeModulesIdx);
    rel = rel.replace('node_modules', 'dependencies');
    // Remove extension using upath.extname
    rel = rel.slice(0, -path.extname(rel).length) + `.${ext}`;
    // Remove any null bytes (\x00) that may be present (Rollup sometimes injects these)
    rel = rel.replace(/\0/g, '');
    // Remove any leading slashes
    rel = rel.replace(/^\/\/+/, '');

    fs.appendFileSync(
      'tmp/rollup.log',
      `entryFileNamesWithExt:\n  [facadeModuleId] ${facadeModuleId}\n  [rel] ${rel}\n`
    );
    return rel;
  };
}

/**
 * Returns a function to generate chunk file names with the given extension for Rollup output.
 *
 * For chunks from node_modules, places them in the dependencies folder and removes the original extension.
 *
 * @param {string} ext The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { name: string }) => string} Function that generates the output file name for a given chunk.
 */
export function chunkFileNamesWithExt(ext) {
  return function ({ name }) {
    // For node_modules chunks, place in dependencies folder
    if (name && name.includes('node_modules')) {
      const nodeModulesIdx = name.indexOf('node_modules');
      let rel = name.slice(nodeModulesIdx);
      rel = rel.replace('node_modules', 'dependencies');
      // Remove extension using upath.extname
      rel = rel.slice(0, -path.extname(rel).length);
      // Remove any null bytes (\x00) that may be present
      rel = rel.replace(/\0/g, '');
      // Remove any leading slashes
      rel = rel.replace(/^\/\/+/, '');
      return `${rel}-[hash].${ext}`;
    }
    // For local chunks, keep the default pattern
    return `[name]-[hash].${ext}`;
  };
}

export default [preserverDirs, cjsOneFile, ...support]; // Export the configuration
