/**********此处import时需要保证类的继承顺序***************** */
import EngineLayout, { SaveInfo } from './EngineLayout'
import EngineContainer from './EngineContainer'
import EngineComponent from './EngineComponent'
import EnginePage from './EnginePage'

export { EngineLayout, EngineContainer, EngineComponent, EnginePage }
export { SaveInfo }
export * from './commonClasses/PropertyInfo'
export * from './commonClasses/MethodInfo'
export { LayoutEvent, LayoutEventBehaviors } from './commonClasses/EventInfo'
export * from './commonClasses/PageInfo'
export * from './commonClasses/ComponentInfo'

/**
 * 装饰器执行顺序
 * 结果：属性装饰器  >> 方法装饰器  >>  类装饰器
 * 同样的装饰器会先执行后面的装饰器
 */

// function logClass(params: string) {
//   debugger
//   return function (target: any) {
//     debugger
//     console.log('类装饰器')
//   }
// }

// function logAttr(params?: string) {
//   debugger
//   return function (target: any, attrName: any) {
//     Reflect.defineProperty(target, attrName, {
//       enumerable: true,
//       value: 'lyl',
//       writable: true,
//       configurable: true
//     })
//     debugger
//     console.log('属性装饰器')
//   }
// }

// function logMethods(params: any) {
//   debugger
//   return function (target: any, methodsName: any, desc: any) {
//     debugger
//     console.log('方法装饰器')
//   }
// }

// @logClass('类装饰器')
// class Person {
//   @logAttr('属性装饰器')
//   name: string | undefined

//   constructor() {}

//   @logMethods('方法装饰器')
//   getData() {
//     console.log('我是原本的返回值')
//   }
// }

// var x = new Person()
// debugger
