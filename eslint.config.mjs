import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

/**
 * @type {import('eslint').ESLint.ConfigData[]}
 */
export default [
  {
    ignores: ['**/demo/', '**/dist/', 'benchmark/extra/']
  },
  ...compat.extends('standard'),
  {
    rules: {
      camelcase: 0,
      'no-multi-spaces': 0
    }
  },
  {
    files: ['**/*.mjs'],
    rules: {
      'no-restricted-globals': [2, 'require', '__dirname']
    }
  },
  {
    files: ['test/**'],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  },
  {
    files: ['lib/**'],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'module'
    }
  },
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          $schema: 'https://json.schemastore.org/prettierrc',
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          bracketSameLine: true,
          bracketSpacing: true,
          semi: true,
          singleQuote: true,
          trailingComma: 'none',
          endOfLine: 'lf',
          quoteProps: 'as-needed',

          overrides: [
            {
              excludeFiles: ['*.min.js', '*.min.cjs', '*.min.css', '*.min.html', '*.min.scss'],
              files: ['*.js', '*.css', '*.sass', '*.html', '*.md', '*.ts'],
              options: {
                semi: true
              }
            },
            {
              files: ['*.ejs', '*.njk', '*.html'],
              options: {
                parser: 'html'
              }
            }
          ]
        }
      ]
    }
  }
];
