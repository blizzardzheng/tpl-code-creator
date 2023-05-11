import { createNodeByObj, replaceTemplateStrTsByNode } from './createNodeByModel';
import { createTsNodeByObject, createValue } from './createTsNodeByObject';


import snapshot from '../snapshot.json';
console.log('snapshot', snapshot);
const layoutData = snapshot.layoutData;

import fs from 'fs';
import path from 'path';
import { ts } from "ts-morph";

const factory = ts.factory;
// const node = createNodeByObj({
//   a: 24234,
//   fsdf: '4234',
//   ff: ['234234','24234']
// });

const props  = fs.readFileSync(path.join(__dirname, '../../tpl/worksProps.tpl'), 'utf-8');
const worksIndexTest  = fs.readFileSync(path.join(__dirname, '../../tpl/workIndex.tpl'), 'utf-8');
const componentIndex  = fs.readFileSync(path.join(__dirname, '../../tpl/componentIndex.tpl'), 'utf-8');
const { toString } = Object.prototype;

const componentNameMap = {
  Text: 'span',
  Image: 'img',
  Block: 'FlexCenterContainer'
}
function isString(value) {
	return toString.call(value) === '[object String]';
}

function makeNumberTabs(number) {
  return Array(number).fill('').join('  ');
}

function makeJSX(obj: any, layer: number = 1) {
  const { text, style, className, lines, ...otherProps } = obj?.props;
  const hasChildren = obj?.props?.text || (!!obj.children && !!obj.children.length);
  const componentName = componentNameMap[obj.componentName] ? componentNameMap[obj.componentName] : obj.componentName.toLowerCase();
  const otherPropsKeys = Object.keys(otherProps);
  console.log('object className', obj.props.className);
  let handleAttrbutes:any = [];
  if (className && className !== 'mod') {
    handleAttrbutes.push(factory.createJsxAttribute(
      factory.createIdentifier('className'),
      factory.createStringLiteral(obj.props?.className)
    ))
  }
  if (otherPropsKeys) {
    handleAttrbutes = handleAttrbutes.concat(
      otherPropsKeys.map(key => {
        const value = otherProps[key];
        const attrValue = isString(value) ? factory.createStringLiteral(value) : factory.createJsxExpression(undefined, createValue(value));
        return factory.createJsxAttribute(
          factory.createIdentifier(key),
          attrValue
          )
      })
    );
  }
  if (hasChildren) {
    let handleChildren: any = [factory.createJsxText('\n', true)];
    if (obj.children && obj.children.length) {
      obj.children.forEach(element => {
        handleChildren.push(factory.createJsxText(makeNumberTabs(layer)), makeJSX(element, layer + 1), factory.createJsxText('\n', true), factory.createJsxText(makeNumberTabs(layer)));
      });
    }
    if (obj?.props?.text) {
      handleChildren.push(factory.createJsxText(makeNumberTabs(layer + 1)), factory.createJsxText(obj?.props?.text, true), factory.createJsxText('\n', true), factory.createJsxText(makeNumberTabs(layer)));
    }
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier(componentName),
        undefined,
        factory.createJsxAttributes(handleAttrbutes),
      ),
      handleChildren,
      factory.createJsxClosingElement(factory.createIdentifier(componentName))
    )
  }
  return factory.createJsxSelfClosingElement(
    factory.createIdentifier(componentName),
    undefined,
    factory.createJsxAttributes(handleAttrbutes)
  )
}


const componentIndexStr = replaceTemplateStrTsByNode(componentIndex, {
  TSX: () => makeJSX(layoutData),
  COMPONRNT_NAME: () => factory.createIdentifier("RewardList"),
  IPROPS: () => factory.createInterfaceDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("IProps"),
    undefined,
    undefined,
    Object.keys({
      "234": 23
    }).map(key => {
      const node = ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(key),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken), // 是否是
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      );
      ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, '\n* dfgdgdgdfg\n', true);
      return node
    })
  )
});

fs.writeFileSync('gen.tsx', componentIndexStr);
console.log(234234, componentIndexStr);
