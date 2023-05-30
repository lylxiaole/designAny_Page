import PageBase from '../EnginePage'
import { getUuid } from '@common/utils'
import { behavior, variable, action, actionDetail } from './behaviorTypes'
import { objectBase, objectType, resourceType, resourceSearchType, object_Method, object_Variable, allCuteSigns, allFilterSigns, resourceSearchAttr } from './01_actionCommon'
import factory from './03_actionFactory'
import { object_callback, object_FixedVal } from '.'

export class groupNode {
  key: string //node节点的key
  title: string //node节点的标题
  resourceSearchType: resourceSearchType
  canScrollPage: boolean = false
  canSearch: boolean = false
  childrenObjs: objectBase[] = [] //node节点的子级,有可能是
  childrenGroups: groupNode[] = []
}

function makeGroupNode(name: string, resType: resourceSearchType): groupNode {
  var newnode = new groupNode()
  newnode.key = getUuid()
  newnode.title = name
  newnode.resourceSearchType = resType
  return newnode
}

export class pageSearchBase {
  static currentPage: PageBase = null
  static actionFctory: factory = null
  static currentBehavior: behavior = null
  isNeedCache: boolean = false
  currentGroup: groupNode

  totalPageNumber: number = 1
  pageIndex: number = 0
  pageSize: number = 20

  get canScroll(): boolean {
    if (this.pageIndex >= this.totalPageNumber) {
      return false
    } else {
      return true
    }
  }

  public clear() {
    this.currentGroup = null
    this.totalPageNumber = 1
    this.pageIndex = 0
    this.pageSize = 20
  }

  public async searchStr(searchstr?: string): Promise<groupNode> {
    if (searchstr) {
      var cache_totalPageNumber = this.totalPageNumber
      var cache_pageIndex = this.pageIndex
      var cache_pageSize = this.pageSize
      this.totalPageNumber = 1
      this.pageIndex = 1
      this.pageSize = 500000
      var res = await this.search_inner(searchstr)
      this.totalPageNumber = cache_totalPageNumber
      this.pageIndex = cache_pageIndex
      this.pageSize = cache_pageSize
      return res
    } else {
      this.clear()
      return await this.searchNext()
    }
  }

  public async searchNext(): Promise<groupNode> {
    if (this.pageIndex < this.totalPageNumber) {
      this.pageIndex++
    } else {
      return this.currentGroup
    }
    //
    var newgroup = await this.search_inner()
    if (!this.currentGroup) {
      this.currentGroup = newgroup
      return this.currentGroup
    }
    //
    this.currentGroup.childrenGroups = this.currentGroup.childrenGroups.concat(newgroup.childrenGroups)
    this.currentGroup.childrenObjs = this.currentGroup.childrenObjs.concat(newgroup.childrenObjs)
    return this.currentGroup
  }

  protected async search_inner(searchstr?: string): Promise<groupNode> {
    return new Promise<groupNode>((resolve, reject) => {
      resolve(null)
    })
  }
}

@resourceSearchAttr(resourceSearchType.behaviorInParam)
export class behaviorInParamSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('行为入参分组', resourceSearchType.pageContext)
    var newwfnode = pageSearchBase.actionFctory.makeObject(getUuid(), '入参', objectType.method, resourceType.behaviorInParam)
    nodegroup.childrenObjs.push(newwfnode)
    return nodegroup
  }
}

//计算用的符号
@resourceSearchAttr(resourceSearchType.signs)
export class signsSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('运算符', resourceSearchType.signs)
    allCuteSigns.filter((sign) => {
      var newwfnode = pageSearchBase.actionFctory.makeObject(getUuid(), sign.title, objectType.signs, resourceType.signs)
      nodegroup.childrenObjs.push(newwfnode)
    })
    return nodegroup
  }
}
//判断用的符号
@resourceSearchAttr(resourceSearchType.filterSigns)
export class filterSignsSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('运算符', resourceSearchType.signs)
    allFilterSigns.filter((sign) => {
      var newwfnode = pageSearchBase.actionFctory.makeObject(getUuid(), sign.title, objectType.signs, resourceType.filterSigns)
      nodegroup.childrenObjs.push(newwfnode)
    })
    return nodegroup
  }
}

@resourceSearchAttr(resourceSearchType.fixedVal)
export class fixedValSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupNode = makeGroupNode('固定值分组', resourceSearchType.fixedVal)
    var fixedValNode = pageSearchBase.actionFctory.makeObject(getUuid() + '&字符串', '固定值-字符串', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(getUuid() + '&布尔', '固定值-布尔', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(getUuid() + '&整数', '固定值-整数', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(getUuid() + '&浮点数', '固定值-浮点数', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(getUuid() + '&空值', '固定值-空值', objectType.method, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    return groupNode
  }
}

@resourceSearchAttr(resourceSearchType.variables)
export class variableSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    // window.console.log('查询变量')
    var groupinfo = makeGroupNode('当前变量', resourceSearchType.variables)
    /************************************ */
    var createVaNode = pageSearchBase.actionFctory.makeObject(getUuid(), '新建变量', objectType.variable, resourceType.variables)
    groupinfo.childrenObjs.push(createVaNode)
    /*****************************/
    var allVariables = this.findVariableActs(pageSearchBase.currentBehavior.actions)
    allVariables.filter((o) => {
      var objNode = pageSearchBase.actionFctory.makeObject(getUuid(), o.name, objectType.variable, resourceType.variables)
      if (!groupinfo.childrenObjs.find((obj) => obj.name == o.name)) {
        groupinfo.childrenObjs.push(objNode)
      }
    })

    return groupinfo
  }

  private findVariableActs(acts: (action | actionDetail)[]) {
    var res: object_Variable[] = []
    for (let index = 0; index < acts.length; index++) {
      let act = acts[index]
      if ((act as actionDetail).isActionDetail) {
        let actDetail = act as actionDetail
        actDetail.objs.filter((obj) => {
          if (obj.resourceType == resourceType.variables && !res.find((r) => r.name == obj.name)) {
            res.push(obj as object_Variable)
          }
        })
      } else {
        let action = act as action
        var findacts = this.findVariableActs(action.actionDetails)
        findacts.filter((fact) => {
          res.push(fact)
        })
      }
    }
    return res
  }
}

@resourceSearchAttr(resourceSearchType.normalPopupWindow)
export class normalPopupWindowSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupinfo = makeGroupNode('全局通用方法', resourceSearchType.normalPopupWindow)
    var param = pageSearchBase.actionFctory.makeObject(getUuid(), '提示文字', objectType.fixedVal, resourceType.fixedVal)
    //
    let newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '确认弹窗', objectType.method, resourceType.normalPopupWindow)
    ;(newnode as object_Method).inputParams.push({ name: '提示文字', obj: param, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '警告弹窗', objectType.method, resourceType.normalPopupWindow)
    ;(newnode as object_Method).inputParams.push({ name: '提示文字', obj: param, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '错误弹窗', objectType.method, resourceType.normalPopupWindow)
    ;(newnode as object_Method).inputParams.push({ name: '提示文字', obj: param, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    this.makeConfirm(groupinfo)
    //
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), 'Excel上传解析', objectType.method, resourceType.uploadFile)
    let node = pageSearchBase.actionFctory.makeObject(getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    let node2 = pageSearchBase.actionFctory.makeObject(getUuid(), '回调事件', objectType.callback, resourceType.callback) as object_callback
    node2.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '从第几行开始读取', obj: node, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '回调事件', obj: node2, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    ////////////////////////////////////////////////////////////////////////
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '通用上传文件', objectType.method, resourceType.uploadFile_all)
    let uln1 = pageSearchBase.actionFctory.makeObject(getUuid() + '&字符串', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln1 as object_FixedVal).val = '*'
    let uln2 = pageSearchBase.actionFctory.makeObject(getUuid() + '&整数', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln2 as object_FixedVal).val = 1
    let uln3 = pageSearchBase.actionFctory.makeObject(getUuid() + '&整数', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln3 as object_FixedVal).val = 10
    let uln4 = pageSearchBase.actionFctory.makeObject(getUuid(), '回调事件', objectType.callback, resourceType.callback) as object_callback
    uln4.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '文件类型', obj: uln1, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '最大文件个数', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '文件最大尺寸(MB)', obj: uln3, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '回调事件', obj: uln4, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '获取时间', objectType.method, resourceType.serverTimeNow)
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(getUuid() + '显示', '显示加载窗', objectType.method, resourceType.controlLoadingWindow)
    groupinfo.childrenObjs.push(newnode)
    newnode = pageSearchBase.actionFctory.makeObject(getUuid() + '关闭', '关闭加载窗', objectType.method, resourceType.controlLoadingWindow)
    groupinfo.childrenObjs.push(newnode)
    //
    let newnodedown = pageSearchBase.actionFctory.makeObject(getUuid(), '文件下载', objectType.method, resourceType.downloadFile)
    let nodep1 = pageSearchBase.actionFctory.makeObject(getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(newnodedown as object_Method).inputParams.push({ name: '文件链接', obj: nodep1, isModel: false })
    groupinfo.childrenObjs.push(newnodedown)
    //
    let newnodebreak = pageSearchBase.actionFctory.makeObject(getUuid(), '终止行为(当前)', objectType.method, resourceType.breakBehavior)
    groupinfo.childrenObjs.push(newnodebreak)
    //
    let newnodebreakall = pageSearchBase.actionFctory.makeObject(getUuid(), '终止行为(所有)', objectType.method, resourceType.breakBehaviorAll)
    groupinfo.childrenObjs.push(newnodebreakall)
    //
    let newnodeopenexe = pageSearchBase.actionFctory.makeObject(getUuid(), '打开本地程序', objectType.method, resourceType.callLocalProgram)
    uln1 = pageSearchBase.actionFctory.makeObject(getUuid() + '&字符串', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln1 as object_FixedVal).val = 'GenoAny'
    uln2 = pageSearchBase.actionFctory.makeObject(getUuid() + '&字符串', '文件路径', objectType.fixedVal, resourceType.fixedVal)
    ;(newnodeopenexe as object_Method).inputParams.push({ name: '本地程序名称', obj: uln1, isModel: false })
    ;(newnodeopenexe as object_Method).inputParams.push({ name: '参数', obj: uln2, isModel: false })
    groupinfo.childrenObjs.push(newnodeopenexe)
    //
    //打印模板设计
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '设计模板', objectType.method, resourceType.designReportTemplate)
    uln1 = pageSearchBase.actionFctory.makeObject(getUuid(), '报表数据源', objectType.fixedVal, resourceType.fixedVal)
    uln2 = pageSearchBase.actionFctory.makeObject(getUuid(), '报表模板模型', objectType.fixedVal, resourceType.fixedVal)
    uln3 = pageSearchBase.actionFctory.makeObject(getUuid(), '数据源模型结构', objectType.fixedVal, resourceType.fixedVal)
    uln4 = pageSearchBase.actionFctory.makeObject(getUuid(), '保存回调事件', objectType.callback, resourceType.callback) as object_callback
    uln4.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '报表模板id', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '保存回调事件', obj: uln4, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '报表数据源', obj: uln1, isModel: false })
    //;(newnode as object_Method).inputParams.push({ name: '数据源模型结构', obj: uln3, isModel: false })
    ;(newnode as object_Method).dynamic = true
    groupinfo.childrenObjs.push(newnode)
    //打印预览
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '打印预览', objectType.method, resourceType.reportPrintPreview)
    ;(newnode as object_Method).inputParams.push({ name: '报表模板id', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '报表数据源', obj: uln1, isModel: false })
    //;(newnode as object_Method).inputParams.push({ name: '数据源模型结构', obj: uln3, isModel: false })
    ;(newnode as object_Method).dynamic = true
    groupinfo.childrenObjs.push(newnode)
    //打印
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '打印', objectType.method, resourceType.reportPrint)
    ;(newnode as object_Method).inputParams.push({ name: '报表模板id', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '报表数据源', obj: uln1, isModel: false })
    //;(newnode as object_Method).inputParams.push({ name: '数据源模型结构', obj: uln3, isModel: false })
    ;(newnode as object_Method).dynamic = true
    groupinfo.childrenObjs.push(newnode)
    //打开网络文件(刘少彬特需)
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '本地预览网络文件', objectType.method, resourceType.openLocalExeToOpenFile)
    ;(newnode as object_Method).inputParams.push({ name: '文件相对路径', obj: uln2, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //删除报表
    newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '删除报表', objectType.method, resourceType.deleteReport)
    ;(newnode as object_Method).inputParams.push({ name: '报表id', obj: uln2, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    return groupinfo
  }

  private makeConfirm(group: groupNode) {
    var newnode = pageSearchBase.actionFctory.makeObject(getUuid(), '询问弹窗', objectType.method, resourceType.confirmPopup)
    var paramstr = pageSearchBase.actionFctory.makeObject(getUuid(), '提示文字', objectType.fixedVal, resourceType.fixedVal)
    var paramIsShowCancel = pageSearchBase.actionFctory.makeObject(getUuid() + '&布尔', '显示取消按钮', objectType.fixedVal, resourceType.fixedVal)
    paramIsShowCancel.ref = 'true'
    var surecb = pageSearchBase.actionFctory.makeObject(getUuid(), '取消回调', objectType.callback, resourceType.callback) as object_callback
    surecb.isChoosePageSource = false
    var cancelcb = pageSearchBase.actionFctory.makeObject(getUuid(), '取消回调', objectType.callback, resourceType.callback) as object_callback
    cancelcb.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '询问文字', obj: paramstr, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '是否显示取消按钮', obj: paramIsShowCancel, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '确认回调', obj: surecb, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '取消回调', obj: cancelcb, isModel: false })
    group.childrenObjs.push(newnode)
  }
}

@resourceSearchAttr(resourceSearchType.consoleSettings)
export class consoleSettingsSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('调试输出配置', resourceSearchType.pageContext)
    let newNode = pageSearchBase.actionFctory.makeObject(getUuid(), '调试输出', objectType.method, resourceType.consoleSettings) as object_Method
    newNode.inputParams = []
    let paramSign: string = '输出标记'
    let newObjParam = pageSearchBase.actionFctory.makeObject(getUuid(), paramSign, objectType.fixedVal, resourceType.fixedVal)
    newNode.inputParams.push({ name: paramSign, obj: newObjParam, isModel: false })
    let inParamName: string = '输出参数'
    let newObjParam2 = pageSearchBase.actionFctory.makeObject(getUuid(), inParamName, objectType.variable, resourceType.variables)
    newNode.inputParams.push({ name: inParamName, obj: newObjParam2, isModel: false })
    nodegroup.childrenObjs.push(newNode)
    return nodegroup
  }
}

@resourceSearchAttr(resourceSearchType.externalLinks)
export class externalLinkSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('外部链接', resourceSearchType.externalLinks)
    let newNode = pageSearchBase.actionFctory.makeObject(getUuid(), 'URL地址', objectType.method, resourceType.externalLinks) as object_Method
    newNode.inputParams = []
    let paramSign: string = 'URL地址'
    let newObjParam = pageSearchBase.actionFctory.makeObject(getUuid(), paramSign, objectType.fixedVal, resourceType.fixedVal)
    newNode.inputParams.push({ name: paramSign, obj: newObjParam, isModel: false })
    nodegroup.childrenObjs.push(newNode)
    return nodegroup
  }
}

var allSearches: pageSearchBase[] = [
  new behaviorInParamSearch(),
  new signsSearch(),
  new filterSignsSearch(),
  new fixedValSearch(),
  new variableSearch(),
  // new controlsSearch(),
  // new modelsSearch(),

  new normalPopupWindowSearch(),

  new consoleSettingsSearch(),
  new externalLinkSearch()
]

export function clearAllSearchCache() {
  allSearches.forEach((o) => o.clear())
}

export default function getSearchClass(resType: resourceSearchType): pageSearchBase {
  return allSearches.filter((o: any) => o.constructor.prototype.$Meta.resType == resType)[0]
}
