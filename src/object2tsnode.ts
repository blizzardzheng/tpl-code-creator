import ts from 'typescript';
const { factory } = ts;


const printer = ts.createPrinter();



export function object2TsNode(object) {

  return factory.createParenthesizedExpression(factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        factory.createIdentifier("a"),
        factory.createStringLiteral("342342")
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier("b"),
        factory.createStringLiteral("234234")
      )
    ],
    true
  ))
}

//

function main() {
  const result = object2TsNode({ a: '234234234' });
  const file = ts.factory.updateSourceFile(
    ts.createSourceFile('temporary.ts', '', ts.ScriptTarget.Latest),
    [factory.createExpressionStatement(result)]
  )
  console.log(printer.printFile(file))
}

function bbb (className, style) { 
  return Object.keys(style).reduce((p, v) => {
    return p+=`  ${v}: ${style[v]};\n`
  }, `.${className} {\n`) + '}';
}
console.log(bbb('dfgdfg', {
  width: '100px'
}))

// main();