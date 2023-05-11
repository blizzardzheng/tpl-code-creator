import ts from 'typescript';
const factory = ts.factory;
const { toString } = Object.prototype;

export function isObject(value) {
	return toString.call(value) === '[object Object]';
}
export function isArray(value) {
	return toString.call(value) === '[object Array]';
}
export function isFunction(value) {
	return toString.call(value) === '[object Function]';
}
export function isString(value) {
	return toString.call(value) === '[object String]';
}
export function isNumber(value) {
	return toString.call(value) === '[object Number]';
}
export function isBoolean(value) {
	return toString.call(value) === '[object Boolean]';
}

//创建string类型,通过key是否传入判断是否是对象中还是数组中
export function createString(inputString, inputKey?) {
  if(inputKey){//如果传入key，则代表是在对象中，则返回一个对象的属性节点
    return factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createStringLiteral(inputString)
  )
  }//如果没有传入key，则说明在数组中，则返回一个数组的值
  return factory.createStringLiteral(inputString)
}

//创建bool类型
export function createBoolen(inputBool, inputKey?) {
  if(inputKey){
  return inputBool?
  factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createTrue()
  ):
  factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createFalse()
  )
  }
  return inputBool? factory.createTrue(): factory.createFalse()
}

//创建number类型
export function createNumber(inputNumber,inputKey?: string) {
  if(inputKey){  
    return factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createNumericLiteral(inputNumber)
  )}
  return factory.createNumericLiteral(inputNumber)
}

//创建undifined类型
export function createUndefined(inputKey?) {
  if(inputKey){
    return factory.createPropertyAssignment(
    factory.createIdentifier(inputKey),
    factory.createIdentifier("undefined")
  )}
  return factory.createIdentifier("undefined")
}

//判断array类型，先判断是否为空，再判断是否为对象中的array(对象中的array传入key，不是数组中的array不传入key)
export function createArray(inputArray,inputKey?) {
  if(inputArray === [] && inputKey) {//如果key存在，且内容为空，则返回对象中的空数组节点
    return factory.createPropertyAssignment(
      factory.createIdentifier(inputKey),
      factory.createArrayLiteralExpression(
        [],
        false
      )
    )    
  } else if (inputArray === []) { //如果key不存在，且内容为空，则返回数组中的空数组值
    return factory.createArrayLiteralExpression(
      [],
      false
    )
  }
  let result:any =[]
  for(let key in inputArray) {
    switch(typeof inputArray[key]) {
      case 'string': result.push(createString(inputArray[key]));break;
      case 'boolean': result.push(createBoolen(inputArray[key]));break;
      case 'number': result.push(createNumber(inputArray[key]));break;
      case 'undefined': result.push(createUndefined());break;
      case 'object': {
        if(isArray(inputArray[key])) result.push(createArray(inputArray[key]));
        else if(isFunction(inputArray[key])) result.push(createString('暂时不支持转换函数'));
        else if(isObject(inputArray[key])) result.push(createObject(inputArray[key]));
      }
    }
  };
  if(inputKey) {//如果key存在，数组内容不为空，则返回对象中的数组节点
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
export function createObject(inputObject:any,inputKey?: any) {
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
          if(isArray(inputObject[key])) result.push(createArray(inputObject[key], key));
          else if(isFunction(inputObject[key])) result.push(createString('暂时不支持转换函数', key));
          else if(isObject(inputObject[key])) result.push(createObject(inputObject[key], key));
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

// 创建 value 类型
export function createValue(value) {
  if (isString(value)) {
    return createString(value) as ts.StringLiteral;
  }
  if (isNumber(value)) {
    return createNumber(value) as ts.NumericLiteral;
  }
  if (isBoolean(value)) {
    return createBoolen(value) as ts.TrueLiteral | ts.FalseLiteral;
  }
  if (isArray(value)) {
    return createArray(value) as ts.ArrayLiteralExpression;
  }
  if (value === undefined) {
    return createUndefined() as ts.PropertyAssignment;
  }
  if (isObject(value)) {
    return createObject(value) as ts.ObjectLiteralExpression;
  }
  return null as any;
}


export function createTsNodeByObject(inputObject) {
  if(isObject(inputObject)){
    return factory.createParenthesizedExpression(createObject(inputObject) as any)
  } else if (isArray(inputObject)){
    return factory.createParenthesizedExpression(createArray(inputObject) as any)
  } else if (isFunction(inputObject)){
    return factory.createParenthesizedExpression(factory.createArrayLiteralExpression(
      [factory.createStringLiteral("暂不支持转化函数")],
      true
    ));
  }
  return factory.createParenthesizedExpression(factory.createNull());
}
