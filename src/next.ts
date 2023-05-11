import ts, { factory, getDefaultCompilerOptions } from 'typescript';
const printer = ts.createPrinter({
  // @ts-ignore
  neverAsciiEscape: true
});
import fs from 'fs';

const source = ts.createSourceFile('temporary.ts', fs.readFileSync('./aaa.ts', 'utf8'), ts.ScriptTarget.Latest);

ts.transform(source.getSourceFile(), [(n: any) => {
  if (ts.isIdentifier(n)) {
    console.log(n.getFullText());
  }
  return n;
}])