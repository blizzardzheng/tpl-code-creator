import ts from 'typescript';
const { factory } = ts;


const printer = ts.createPrinter();



export function object2TsNode(inputObject) {
  if(inputObject instanceof Object){
    return factory.createParenthesizedExpression(createObject(inputObject) as any)
  } else if (inputObject instanceof Array){
    return factory.createParenthesizedExpression(createArray(inputObject) as any)
  } else if (inputObject instanceof Function){
    return factory.createParenthesizedExpression(factory.createArrayLiteralExpression(
      [factory.createStringLiteral("暂不支持转化函数")],
      true
    ));
  }
  return factory.createParenthesizedExpression(factory.createNull());

//判断array类型，先判断是否为空，再判断是否为对象中的array(对象中的array传入key，不是数组中的array不传入key)
function createArray(InputArray,inputKey?){
  if(InputArray === [] && inputKey){//如果key存在，且内容为空，则返回对象中的空数组节点
    return factory.createPropertyAssignment(
      factory.createIdentifier(inputKey),
      factory.createArrayLiteralExpression(
        [],
        false
      )
    )    
  } else if (InputArray === []){//如果key不存在，且内容为空，则返回数组中的空数组值
    return factory.createArrayLiteralExpression(
      [],
      false
    )
  }
  let result:any =[]
  for(let key in InputArray){
    switch(typeof InputArray[key]){
      case 'string': result.push(createString(InputArray[key]));break;
      case 'boolean': result.push(createBoolen(InputArray[key]));break;
      case 'number': result.push(createNumber(InputArray[key]));break;
      case 'undefined': result.push(createUndefined());break;
      case 'object': {
        if(InputArray[key] instanceof Array) result.push(createArray(InputArray[key]));
        else if(InputArray[key] instanceof Function) result.push(createString('暂时不支持转换函数'));
        else if(InputArray[key] instanceof Object) result.push(createObject(InputArray[key]));
      }
    }
  };
  if(inputKey){//如果key存在，数组内容不为空，则返回对象中的数组节点
    return factory.createPropertyAssignment(
      factory.createIdentifier(inputKey),
      factory.createArrayLiteralExpression(
        result,
        false
      )
    )
  } else {//如果key不存在，数组内容不为空，则返回数组中的数组值
    factory.createArrayLiteralExpression(
      result,
      false
    )
  }
}

//创建object类型，先判断object有没有key是否为空
function createObject(inputObject:any,inputKey?: any){
if(inputObject === {} && inputKey){//如果key存在且内容为空，即对象中的空对象
    return factory.createPropertyAssignment(
      factory.createIdentifier(inputKey),
      factory.createObjectLiteralExpression(
        [],
        true
      )
    )
} else if (inputObject === {}) {//key不存在且内容为空，即数组中的空对象
  return factory.createObjectLiteralExpression(
    [],
    false
  )
}
let result:any =[]
  for(let key in inputObject){
    switch(typeof inputObject[key]){
      case 'string': result.push(createString(inputObject[key], key));break;
      case 'boolean': result.push(createBoolen(inputObject[key], key));break;
      case 'number': result.push(createNumber(inputObject[key], key));break;
      case 'undefined': result.push(createUndefined(key));break;
      case 'object': {
        if(inputObject[key] instanceof Array) result.push(createArray(inputObject[key], key));
        else if(inputObject[key] instanceof Function) result.push(createString('暂时不支持转换函数', key));
        else if(inputObject[key] instanceof Object) result.push(createObject(inputObject[key], key));
      }
    }
  }
  if(inputKey){//key存在且对象内容不为空，即对象中的非空对象
    return factory.createPropertyAssignment(
      factory.createIdentifier(inputKey),
      factory.createObjectLiteralExpression(
        result,
        true
      )
    )
  } else {//key不存在且内容不为空，即数组中的非空对象
    return factory.createObjectLiteralExpression(
      result,
      true
    )
  }
}

//创建string类型,通过key是否传入判断是否是对象中还是数组中
function createString(InputString, inputKey?){
  if(inputKey){//如果传入key，则代表是在对象中，则返回一个对象的属性节点
    return factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createStringLiteral(InputString)
  )
  }//如果没有传入key，则说明在数组中，则返回一个数组的值
  return factory.createStringLiteral(InputString);
}

//创建bool类型
function createBoolen(InputBool, inputKey?){
  if(inputKey){
  return InputBool?
  factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createTrue()
  ):
  factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createFalse()
  )
  }
  return InputBool? factory.createTrue(): factory.createFalse()
}

//创建number类型
function createNumber(inputNumber,inputKey?: string){
  if(inputKey){  
    return factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createNumericLiteral(inputNumber)
  )}
  return factory.createNumericLiteral(inputNumber)
}

//创建undifined类型
function createUndefined(inputKey?){
  if(inputKey){
    return factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createIdentifier("undefined")
  )}
  return factory.createIdentifier("undefined")
}
}


function main() {
  const result = object2TsNode({ 'a23423423': [2342344], 

b: 3,
c: {
  dfg: {
    f: [{d: 3, c: '你好', 3: true}]
  }
}
});

  const file = ts.factory.updateSourceFile(
    ts.createSourceFile('temporary.ts', '', ts.ScriptTarget.Latest),
    [factory.createExpressionStatement(result)]
  )
  console.log(decodeURI(printer.printFile(file)))
}

main();