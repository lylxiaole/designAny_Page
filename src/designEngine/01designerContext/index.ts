import IContext from './IContext'
import IApiBase from './IApiBase'
import Context_Test from './Context_Test'
import APIS_Test from './APIs_Test'
import store from '../../../store'

import { fileInfo, AuthorityCode, APIRequestClass, APIResponseClass, pagenNodeType, PageOrderClass } from './commonTypes'

var CurrentContext: IContext = new Context_Test()
var CurrentApis: IApiBase = new APIS_Test()
var CurrentStore: any = store
function RegisterContext(context: IContext) {
  CurrentContext = context
}

function RegisterApis(apis: IApiBase) {
  CurrentApis = apis
}

function RegisterStore(store: any) {
  CurrentStore = store
}

export { RegisterContext, RegisterApis, RegisterStore, IContext, IApiBase, CurrentContext, CurrentApis, CurrentStore }

export { fileInfo, AuthorityCode, pagenNodeType, APIRequestClass, PageOrderClass }
