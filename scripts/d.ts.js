import glob from 'fast-glob';
import { performance } from 'perf_hooks';
import { resolve } from 'path';
import ts from 'typescript';
import { writeFileSync } from 'fs';

const start = performance.now();

console.log('Type Declaration Generator\n');

/** @type {Map<string, string>} */
const declarations = new Map();
const options = {
  declaration: true,
  emitDeclarationOnly: true,
};
const host = ts.createCompilerHost(options);
host.writeFile = (filename, contents) => declarations.set(filename, contents);

console.info('Finding .ts files');
const filenames = glob.sync('src/**/*.ts');

const compiler = ts.createProgram(filenames, options, host);
console.info('Compiling .ts files');
compiler.emit();

const declarationEntries = [...declarations.entries()];
console.info('Writing .d.ts files\n');
for (const [path, content] of declarationEntries) {
  const buildPath = path.split('/');
  buildPath.shift();
  writeFileSync(resolve(process.cwd(), 'build', ...buildPath), content);
}
const end = performance.now();
console.info(
  `Successfully generated ${declarationEntries.length} type declaration${
    declarationEntries.length === 1 ? '' : 's'
  }. (${Math.floor(end - start)}ms)`
);
