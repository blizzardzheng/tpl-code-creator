import { ts, Project } from "ts-morph";
export function createNodeByObj(obj) {
  const content = typeof obj === 'string' ? obj : `(${JSON.stringify(obj, null, 2)})`;
  const sourcefile = ts.createSourceFile('temporary.ts', content, ts.ScriptTarget.Latest);
  // @ts-ignore
  return sourcefile.statements[0].expression.expression;
}

const regexCondition: RegExp = /__(.+?)__/;

export function replaceTemplateStrTsByNode(str, configNodes = {}) {
  const project = new Project();
  const sourcefile = project.createSourceFile('temporary1.tsx', str);
  sourcefile.transform((traversal) => {
    const node = traversal.visitChildren(); // return type is `ts.Node`
    if (ts.isIdentifier(node)) {
      const text = node.getText();
      if (regexCondition.test(text)) {
        const nameVar: any = (regexCondition.exec(text) as any).pop();
        if (configNodes[nameVar]) {
          return configNodes[nameVar](node);
        }
      }
    }
    return node;
  });
  return sourcefile.getFullText();
}