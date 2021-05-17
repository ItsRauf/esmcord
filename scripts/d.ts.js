import { resolve, sep } from 'path';

import glob from 'fast-glob';
import { performance } from 'perf_hooks';
import ts from 'typescript';
import { writeFile } from 'fs/promises';

const start = performance.now();

console.log('Type Declaration Generator\n');

/** @type {Map<string, string>} */
const declarations = new Map();
const options = {
  declaration: true,
  declarationMap: true,
  emitDeclarationOnly: true,
};
// const options = JSON.parse(await readFile('tsconfig.json'));
const host = ts.createCompilerHost(options);
host.writeFile = (filename, contents) => declarations.set(filename, contents);

console.info('Finding .ts files');
const filenames = glob.sync('src/**/*.ts');

const compiler = ts.createProgram(filenames, options, host);
console.info('Compiling .ts files');
compiler.emit();

const declarationEntries = [...declarations.entries()];
console.info('Writing .d.ts files\n');
const cwd = process.cwd().replace(new RegExp(sep.repeat(2), 'g'), '/');
for (const [path, content] of declarationEntries) {
  const buildPath = path.startsWith(cwd)
    ? path.substr(cwd.length + 1).split('/')
    : path.split('/');
  buildPath.shift();
  writeFile(resolve(cwd, 'build', ...buildPath), content);
}
const end = performance.now();
console.info(
  `Successfully generated ${declarationEntries.length} type declaration${
    declarationEntries.length === 1 ? '' : 's'
  }. (${Math.floor(end - start)}ms)`
);
