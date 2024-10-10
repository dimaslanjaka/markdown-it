const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel').default; // Babel plugin
const path = require('path');
const fs = require('fs');

// Function to get all entry points
const getEntryPoints = (dir) => {
    const entries = {};
    const fullDirPath = path.join(__dirname, dir); // Ensure we create the full path once

    const files = fs.readdirSync(fullDirPath); // Use the full path here

    files.forEach((file) => {
        const fullPath = path.join(fullDirPath, file); // Create full path for the current file
        if (fs.statSync(fullPath).isDirectory()) {
            Object.assign(entries, getEntryPoints(path.join(dir, file))); // Pass the relative path for subdirectories
        } else if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
            // Use the relative path as the key for the entries object
            const relativePath = path.relative(__dirname, fullPath);
            entries[relativePath.replace(/\.js$|\.cjs$|\.mjs$/, '')] = fullPath; // Exclude the file extension for the key
        }
    });

    return entries;
};

// Get all entry points from the directory
const input = getEntryPoints('lib')
input['index'] = 'index.mjs'

// Ensure input is not empty
if (Object.keys(input).length === 0) {
    console.error('No entry points found in the "lib" directory.');
    process.exit(1); // Exit the process with a failure code
}

// Configure output to maintain directory structure
module.exports = {
    input, // Use the input object directly
    output: {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].cjs', // Generate files with .cjs extension
    },
    plugins: [
        resolve(), // Resolve node_modules
        commonjs(), // Convert CommonJS modules to ES6
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**', // Exclude node_modules from transpilation
        }),
    ],
};
