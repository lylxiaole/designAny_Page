/******************************行为相关 **************************/
import { paramInfo } from '../commonClasses/pageInParamInfo'
import { objectBase, objectType } from './01_actionCommon'

//布局的事件所包含的行为列表
export class layoutEventBehaviors {
  eventName: string //布局的事件名称
  behaviorIds: string[] = [] //行为的Id
}

export class variable {
  name: string
  val: any
}

export class behavior {
  id: string = ''
  name: string = ''
  description: string = ''
  variableFormulas: any = {} //废弃
  inparam: any = {} //行为的入参
  variables: variable[] = [] //当前行文的上下文变量
  actions: action[] = []
}

export class action {
  id: string
  name: string
  judgingCondition: objectBase[] = null //动作的判断条件
  actionDetails: (actionDetail | action)[] = []
}

export class actionDetail {
  id: string
  name: string
  detail: string
  isActionDetail: boolean = true
  objs: objectBase[] = []
}

// export default class behaviorExcute {
//   currentBehavior: behavior
//   constructor(_behav: behavior) {
//     this.currentBehavior = _behav
//   }

//   public excuteBehavior() {
//     for (let index = 0; index < this.currentBehavior.actions.length; index++) {
//       let action = this.currentBehavior.actions[index]
//       this.excuteActions(action)
//     }
//   }
//   private excuteActions(act: action) {
//     for (let index = 0; index < act.actionDetails.length; index++) {
//       let actd = act.actionDetails[index]
//       if ((actd as actionDetail).isActionDetail) {
//         this.excuteObjs((actd as actionDetail).objs)
//       } else {
//         this.excuteActions(actd as action)
//       }
//     }
//   }

//   private excuteObjs(objs: objectBase[]) {
//     var resstr = ''
//     for (let index = 0; index < objs.length; index++) {
//       let obj = objs[index]
//       resstr += obj.ref
//     }
//     window.eval(resstr)
//   }
// }
