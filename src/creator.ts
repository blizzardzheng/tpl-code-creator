import ts from 'typescript';
const factory = ts.factory;
const printer = ts.createPrinter({
    // @ts-ignore
    neverAsciiEscape: true
});


export function createCodeByNode(node) {
  const tmp = ts.factory.updateSourceFile(ts.createSourceFile('temporary.tsx', '', ts.ScriptTarget.Latest), node);
  return printer.printFile(tmp)
}
