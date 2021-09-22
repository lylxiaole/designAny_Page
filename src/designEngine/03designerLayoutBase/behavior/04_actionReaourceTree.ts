import PageBase from '../PageBase'
import { getUuid } from '@src/utils'
import { ComponentBase } from '../../03designerLayoutBase'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { behavior, variable, action, actionDetail } from './behaviorTypes'
import { objectBase, objectType, resourceType, resourceSearchType, object_Method, object_Variable, allCuteSigns, allFilterSigns, resourceSearchAttr } from './01_actionCommon'
import factory from './03_actionFactory'
import { CurrentContext, CurrentApis, pagenNodeType } from '../../01designerContext'
import { Property } from '../commonClasses/LayoutProperty'
import { layoutMethod, param, paramType } from '../commonClasses/layoutEvent'
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

@resourceSearchAttr(resourceSearchType.workflows)
export class workflowSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('工作流', resourceSearchType.workflows)
    nodegroup.canScrollPage = true
    nodegroup.canSearch = true
    // window.console.log('workflowSearch')
    let result = CurrentApis.GetWorkOrderFlowList(this.pageIndex, this.pageSize, searchstr)
    this.totalPageNumber = (result as any).totalPages
    this.pageIndex = (result as any).pageNumber
    this.pageSize = (result as any).pageSize
    //
    let workflows = (result as any).content
    for (let index = 0; index < workflows.length; index++) {
      let workflow = workflows[index] //工作流
      workflow = CurrentApis.GetWorkOrderFlowDetail_Sync(workflow.id)
      var workflowgroup = this.makeWFGroupNode(workflow)
      nodegroup.childrenGroups.push(workflowgroup)
    }
    return nodegroup
  }

  private makeWFGroupNode(workflow: any): groupNode {
    var workflowgroup = makeGroupNode(workflow.wfName, resourceSearchType.workflows)
    // window.console.log('组织工作流资源', workflow)
    //返回所有数据的节点
    this.makeWorkflowAsync(null, null, workflow, workflowgroup)

    var resultes = this.makeWFContextNodeGroup(workflow.workflowContextList, workflow)
    workflowgroup.childrenGroups = resultes
    return workflowgroup
  }

  private makeWFContextNodeGroup(wfcontextList: any[], workflow: any): groupNode[] {
    var contexts_res = []
    for (let index = 0; index < wfcontextList.length; index++) {
      const context = wfcontextList[index]
      if (context.ownerType != 1) {
        continue
      }

      let find = contexts_res.find((o) => o.nodeId == context.nodeId)
      if (find) {
        find.contextCodes.push(context.contextCode)
      } else {
        contexts_res.push({ nodeName: context.contextName, nodeId: context.nodeId, contextCodes: [context.contextCode] })
      }
    }
    /** */
    let resGroup: groupNode[] = []
    for (let index = 0; index < contexts_res.length; index++) {
      const contx = contexts_res[index]
      let ngroup = makeGroupNode('节点:' + contx.nodeId, resourceSearchType.workflows)

      contx.contextCodes.filter((contextCode) => {
        let contextGroup = makeGroupNode(contextCode, resourceSearchType.workflows)
        this.makeWorkflowAsync(contx.nodeId, contextCode, workflow, contextGroup)
        ngroup.childrenGroups.push(contextGroup)
      })
      resGroup.push(ngroup)
    }
    return resGroup
  }

  private makeWorkflowAsync(nodeId: string, contextCode: string, workflow: any, parentGroup: groupNode) {
    let newObjId = workflow.id + ''
    if (nodeId) {
      newObjId = newObjId + '&' + nodeId
    }
    if (contextCode) {
      newObjId = newObjId + '&' + contextCode
    }
    // window.console.log('工作流名称', workflow.wfName)
    var newwfnode1 = pageSearchBase.actionFctory.makeObject(newObjId, '(同步)', objectType.method, resourceType.workflows) as object_Method
    this.makeWorkflowInParams(newwfnode1, workflow)
    parentGroup.childrenObjs.push(newwfnode1)
    /********************************** */
    var newwfnode2 = pageSearchBase.actionFctory.makeObject(newObjId, '(异步)', objectType.method, resourceType.workflowsAsync) as object_Method
    this.makeWorkflowInParams(newwfnode2, workflow)
    let newObjParam = pageSearchBase.actionFctory.makeObject(pageSearchBase.currentPage.Id, '回调行为', objectType.callback, resourceType.callback) as object_callback
    newObjParam.isChoosePageSource = false
    newwfnode2.inputParams.push({ name: '回调行为', obj: newObjParam, isModel: false })
    parentGroup.childrenObjs.push(newwfnode2)
  }

  public makeWorkflowInParams(nodeinfo: object_Method, workflow: any) {
    nodeinfo.inputParams = []
    for (let index = 0; index < workflow.workflowContextList.length; index++) {
      let context = workflow.workflowContextList[index]
      if (context.ownerType == 0) {
        this.inparamAlyze(nodeinfo, context)
      }
    }
    // window.console.log('***************工作流入参组织完毕***********', this.objectResources)
  }
  //组织工作流 初始时的入参信息
  private inparamAlyze(obj: object_Method, context: any) {
    if (parseInt(context.contextType) < 100000000) {
      //context.contextType< 100000000是简单类型，
      //简单类型
      let newObjParam = pageSearchBase.actionFctory.makeObject(getUuid(), context.contextCode, objectType.fixedVal, resourceType.fixedVal)
      obj.inputParams.push({ name: context.contextCode, obj: newObjParam, isModel: false })
    } else {
      let newObjParam = pageSearchBase.actionFctory.makeObject(getUuid(), context.contextCode, objectType.fixedVal, resourceType.fixedVal)
      obj.inputParams.push({ name: context.contextCode, obj: newObjParam, isModel: true })
    }
  }
}

@resourceSearchAttr(resourceSearchType.systemDict)
export class enumsSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('系统枚举', resourceSearchType.systemDict)
    nodegroup.canScrollPage = true
    nodegroup.canSearch = true

    var res = await CurrentApis.GetSysDictPage(this.pageIndex, this.pageSize, searchstr)
    this.totalPageNumber = (res as any).totalPages
    this.pageIndex = (res as any).pageNumber
    this.pageSize = (res as any).pageSize
    var alldicts = (res as any).content
    // window.console.log('*********************分页获取了系统枚举', alldicts)
    await this.dealAllDicts(alldicts, nodegroup)
    return nodegroup
  }

  private async dealAllDicts(alldicts: any[], group: groupNode) {
    for (let index = 0; index < alldicts.length; index++) {
      const element = alldicts[index]
      var newgroup = makeGroupNode(element.dict_name, resourceSearchType.systemDict)
      // var newwfnode = pageSearchBase.actionFctory.makeObject(
      //   getUuid() + '&' + element.id,
      //   element.dict_name,
      //   objectType.method,
      //   resourceType.systemDict
      // )
      await this.cuteAllDicItems(element.id, newgroup)
      group.childrenGroups.push(newgroup)
    }
  }

  private async cuteAllDicItems(dictId: string, group: groupNode) {
    var res = await CurrentApis.GetSysDictItems(dictId)
    if (res) {
      var dictItems = (res as any).sysDictItemList
      if (!dictItems || dictItems.length < 1) {
        return '枚举项找不到!'
      }

      for (let index = 0; index < dictItems.length; index++) {
        let item = dictItems[index]
        var newwfnode = pageSearchBase.actionFctory.makeObject(getUuid() + '&' + dictId + '&' + item.item_code, item.item_name, objectType.method, resourceType.systemDict)
        group.childrenObjs.push(newwfnode)
      }
    }
  }
}
@resourceSearchAttr(resourceSearchType.customFunctions)
export class customFunctionSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('公式库', resourceSearchType.customFunctions)
    nodegroup.canScrollPage = true
    nodegroup.canSearch = true
    let result = CurrentApis.GetSysFuncPage_Sync(this.pageIndex, this.pageSize, searchstr)
    //console.log('result公式库: ', result)
    this.totalPageNumber = (result as any).totalPages
    this.pageIndex = (result as any).pageNumber
    this.pageSize = (result as any).pageSize

    let customFunctions = (result as any).content
    if (customFunctions) {
      for (let index = 0; index < customFunctions.length; index++) {
        let customFunction = customFunctions[index]
        var customFunctionGroup = this.makeCFGroupNode(customFunction)
        nodegroup.childrenGroups.push(customFunctionGroup)
      }
    }

    return nodegroup
  }

  private makeCFGroupNode(customFunction: any): groupNode {
    var customFunctionGroup = makeGroupNode(customFunction.func_name, resourceSearchType.customFunctions)
    var newObjNode = pageSearchBase.actionFctory.makeObject(getUuid(), customFunction.func_code, objectType.method, resourceType.customFunctions) as object_Method
    newObjNode.dynamic = true
    this.makeCFInParams(newObjNode, customFunction.in_json_param)
    customFunctionGroup.childrenObjs.push(newObjNode)
    return customFunctionGroup
  }

  private makeCFInParams(nodeinfo: object_Method, jsonParam: any) {
    nodeinfo.inputParams = []
    if (jsonParam.properties) {
      let params = jsonParam.properties
      for (var key in params) {
        let newObjParam = pageSearchBase.actionFctory.makeObject(getUuid(), key, objectType.fixedVal, resourceType.fixedVal)
        nodeinfo.inputParams.push({ name: key, obj: newObjParam, isModel: false })
      }
    } else {
      for (let index = 0; index < Object.values(jsonParam).length; index++) {
        const element = Object.values(jsonParam)[index] as any
        let newObjParam = pageSearchBase.actionFctory.makeObject(getUuid(), element.name, objectType.fixedVal, resourceType.fixedVal)
        nodeinfo.inputParams.push({ name: element.name, obj: newObjParam, isModel: false })
      }
    }
  }
}

@resourceSearchAttr(resourceSearchType.fileTemplate)
export class fileTemplatesSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('文件模板下载', resourceSearchType.fileTemplate)
    nodegroup.canScrollPage = true
    nodegroup.canSearch = true

    var res = await CurrentApis.GetFileTemplatePage(this.pageIndex, this.pageSize, searchstr)
    this.totalPageNumber = (res as any).totalPages
    this.pageIndex = (res as any).pageNumber
    this.pageSize = (res as any).pageSize
    var allFileTemplates = (res as any).content
    await this.dealAllFileTemplates(allFileTemplates, nodegroup)
    return nodegroup
  }

  private async dealAllFileTemplates(allFileTemplates: any[], group: groupNode) {
    for (let index = 0; index < allFileTemplates.length; index++) {
      const element = allFileTemplates[index]
      var newgroup = pageSearchBase.actionFctory.makeObject(getUuid() + '&' + element.id + '&' + element.file_name + '&' + element.file_url, element.file_name + '(下载)', objectType.method, resourceType.fileTemplate)
      group.childrenObjs.push(newgroup)
    }
  }
}
@resourceSearchAttr(resourceSearchType.localStorage)
export class localStoragesSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('本地资源', resourceSearchType.localStorage)
    nodegroup.canScrollPage = true
    nodegroup.canSearch = true

    var res = await CurrentApis.GetLocalStoragePage(this.pageIndex, this.pageSize, searchstr)
    this.totalPageNumber = (res as any).totalPages
    this.pageIndex = (res as any).pageNumber
    this.pageSize = (res as any).pageSize
    var allLocalStorages = (res as any).content
    await this.dealAllLocalStorages(allLocalStorages, nodegroup)
    return nodegroup
  }

  private async dealAllLocalStorages(allLocalStorages: any[], group: groupNode) {
    for (let index = 0; index < allLocalStorages.length; index++) {
      const element = allLocalStorages[index]
      // var newgroup = pageSearchBase.actionFctory.makeObject(
      //   getUuid() + '&' + element.id + '&' + element.storage_code + '&' + element.storage_name + '&' + element.expires,
      //   element.storage_name,
      //   objectType.method,
      //   resourceType.localStorage
      // )
      // group.childrenObjs.push(newgroup)
      var newgroup = makeGroupNode(element.storage_name, resourceSearchType.localStorage)
      let lsArry = [
        {
          lsName: '获取本地资源'
        },
        {
          lsName: '设置本地资源'
        },
        {
          lsName: '删除本地资源'
        }
      ]
      lsArry.forEach((item: any) => {
        var newwfnode = pageSearchBase.actionFctory.makeObject(getUuid() + '&' + element.id + '&' + element.storage_code + '&' + element.storage_name + '&' + element.expires, item.lsName, objectType.method, resourceType.localStorage)
        if (item.lsName === '设置本地资源') {
          let nodep1 = pageSearchBase.actionFctory.makeObject(getUuid(), '手动固定值', objectType.fixedVal, resourceType.fixedVal)
          ;(newwfnode as object_Method).inputParams.push({ name: '设置值', obj: nodep1, isModel: false })
        }
        newgroup.childrenObjs.push(newwfnode)
      })
      group.childrenGroups.push(newgroup)
    }

    var newgroupcode = makeGroupNode('应用编码', resourceSearchType.localStorage)
    var appcode = pageSearchBase.actionFctory.makeObject(getUuid() + '&' + getUuid() + '&' + 'GenoAny-AppCode' + '&' + '应用编码', '获取本地资源', objectType.method, resourceType.localStorage)
    newgroupcode.childrenObjs.push(appcode)
    group.childrenGroups.push(newgroupcode)
    var newgroupuser = makeGroupNode('登录人员信息', resourceSearchType.localStorage)
    var usercode = pageSearchBase.actionFctory.makeObject(getUuid() + '&' + getUuid() + '&' + 'State_Info' + '&' + '登录人员信息', '获取本地资源', objectType.method, resourceType.localStorage)
    newgroupuser.childrenObjs.push(usercode)
    group.childrenGroups.push(newgroupuser)
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

@resourceSearchAttr(resourceSearchType.pagePopupWindow)
export class pagePopupSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupinfo = makeGroupNode('页面弹窗', resourceSearchType.pagePopupWindow)
    var param = {
      filter: {
        appId: CurrentContext.AppID
      },
      orders: [
        {
          direction: 'ASC',
          fieldName: 'orderIndex'
        },
        {
          direction: 'ASC',
          fieldName: 'modifyTime'
        }
      ]
    }
    var resourceArr = await CurrentApis.GetAppMenuTree(param)
    var treelist = []
    await this.initTreeNode(treelist, resourceArr)
    await this.pageNodeToTreeNode(treelist as any[], groupinfo, '')
    window.console.log('search_inner_____', groupinfo)
    return groupinfo
  }

  private async initTreeNode(menuPage, res) {
    res.forEach((element) => {
      let menu = {
        id: element.tag && element.tag.pageId ? element.tag.pageId : element.key,
        text: element.title,
        type: element.leaf ? '1' : '0',
        obj: element.tag,
        children: []
      }
      if (element.children && element.children.length > 0) {
        this.initTreeNode(menu.children, element.children)
      }
      menuPage.push(menu)
    })
  }

  private async pageNodeToTreeNode(nodes: any[], group: groupNode, description: string) {
    nodes.filter((n) => {
      if (!n.obj.pageId || n.obj.pageId == '0') {
        let newgroup = makeGroupNode(n.text, resourceSearchType.pagePopupWindow)
        if (n.children && n.children.length > 0) {
          var newdescript = description + newgroup.title + '/'
          this.pageNodeToTreeNode(n.children, newgroup, newdescript)
        }
        group.childrenGroups.push(newgroup)
      } else {
        let newnode = pageSearchBase.actionFctory.makeObject(n.id, n.text, objectType.method, resourceType.pagePopupWindow) as object_Method
        newnode.description = description + n.text
        this.makeParam(newnode)
        group.childrenObjs.push(newnode)
      }
    })
  }
  private makeParam(obj: object_Method) {
    var node = pageSearchBase.actionFctory.makeObject(getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-宽度', obj: node, isModel: false })
    node = pageSearchBase.actionFctory.makeObject(getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-高度', obj: node, isModel: false })
    node = pageSearchBase.actionFctory.makeObject(getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-标题', obj: node, isModel: false })
    //
    const node3 = pageSearchBase.actionFctory.makeObject(getUuid() + '&布尔', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-全屏', obj: node3, isModel: false })
    //
    node = pageSearchBase.actionFctory.makeObject(getUuid() + '&布尔', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    node.ref = 'false'
    obj.inputParams.push({ name: '关闭图标触发回调', obj: node, isModel: false })
    //TODO 增加弹窗关闭回调事件
    const cnnode = pageSearchBase.actionFctory.makeObject(obj.resourceId, '弹窗关闭回调', objectType.callback, resourceType.callback) as object_callback
    cnnode.isChoosePageSource = true
    // console.log('node: ', node)
    // console.log('obj: ', obj)
    obj.inputParams.push({ name: '弹窗关闭事件', obj: cnnode, isModel: false })
  }
}

@resourceSearchAttr(resourceSearchType.pageRoute)
export class pageRouteSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupinfo = makeGroupNode('页面跳转', resourceSearchType.pageRoute)
    var param = {
      filter: {
        appId: CurrentContext.AppID
      },
      orders: [
        {
          direction: 'ASC',
          fieldName: 'orderIndex'
        },
        {
          direction: 'ASC',
          fieldName: 'modifyTime'
        }
      ]
    }
    var resourceArr = await CurrentApis.GetAppMenuTree(param)
    var treelist = []
    await this.initTreeNode(treelist, resourceArr)
    await this.pageNodeToTreeNode(treelist as any[], groupinfo, '')
    window.console.log('----------------------treelist', treelist)
    window.console.log('search_inner_____', groupinfo)
    return groupinfo
  }

  private async pageNodeToTreeNode(nodes: any[], group: groupNode, description: string) {
    nodes.filter((n) => {
      //window.console.log('---------------------xxxxxxxx',n)
      if (!n.obj.pageId || n.obj.pageId == 0) {
        let newgroup = makeGroupNode(n.text, resourceSearchType.pageRoute)
        if (n.children && n.children.length > 0) {
          var newdescript = description + newgroup.title + '/'
          this.pageNodeToTreeNode(n.children, newgroup, newdescript)
        }
        group.childrenGroups.push(newgroup)
      } else if (n.obj.show) {
        let newnode = pageSearchBase.actionFctory.makeObject(n.id, n.text, objectType.method, resourceType.pageRoute) as object_Method
        newnode.description = description + n.text
        // this.makeParam(newnode)
        group.childrenObjs.push(newnode)
      }
    })
  }
  // private makeParam(obj: object_Method) {
  //   let inParamName: string = '页面跳转入参'
  //   let newObjParam2 = pageSearchBase.actionFctory.makeObject(getUuid(), inParamName, objectType.variable, resourceType.variables)
  //   obj.inputParams.push({ name: inParamName, obj: newObjParam2, isModel: false })
  // }

  private async initTreeNode(menuPage, res) {
    res.forEach((element) => {
      let menu = {
        id: element.tag && element.tag.pageId ? element.tag.pageId : element.key,
        text: element.title,
        type: element.leaf ? '1' : '0',
        obj: element.tag,
        children: []
      }
      if (element.children && element.children.length > 0) {
        this.initTreeNode(menu.children, element.children)
      }
      menuPage.push(menu)
    })
  }
}

@resourceSearchAttr(resourceSearchType.pageSources)
export class pageResourcesSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupinfo = makeGroupNode('页面资源', resourceSearchType.pageSources)
    var param = {
      filter: {
        appId: CurrentContext.AppID
      },
      orders: [
        {
          direction: 'ASC',
          fieldName: 'orderIndex'
        },
        {
          direction: 'ASC',
          fieldName: 'modifyTime'
        }
      ]
    }
    var resourceArr = await CurrentApis.GetAppMenuTree(param)
    var treelist = []
    await this.initTreeNode(treelist, resourceArr)
    await this.pageNodeToTreeNode(treelist as any[], groupinfo, '')
    window.console.log('----------------------treelist', treelist)
    window.console.log('search_inner_____', groupinfo)
    return groupinfo
  }

  private async pageNodeToTreeNode(nodes: any[], group: groupNode, description: string) {
    nodes.filter((n) => {
      //window.console.log('---------------------xxxxxxxx',n)
      if (!n.obj.pageId || n.obj.pageId == 0) {
        let newgroup = makeGroupNode(n.text, resourceSearchType.pageSources)
        if (n.children && n.children.length > 0) {
          var newdescript = description + newgroup.title + '/'
          this.pageNodeToTreeNode(n.children, newgroup, newdescript)
        }
        group.childrenGroups.push(newgroup)
      } else if (n.obj.show) {
        let newnode = pageSearchBase.actionFctory.makeObject(n.id, n.text, objectType.method, resourceType.pageSources) as object_Method
        newnode.description = description + n.text
        // this.makeParam(newnode)
        group.childrenObjs.push(newnode)
      }
    })
  }
  private async initTreeNode(menuPage, res) {
    res.forEach((element) => {
      let menu = {
        id: element.tag && element.tag.pageId ? element.tag.pageId : element.key,
        text: element.title,
        type: element.leaf ? '1' : '0',
        obj: element.tag,
        children: []
      }
      if (element.children && element.children.length > 0) {
        this.initTreeNode(menu.children, element.children)
      }
      menuPage.push(menu)
    })
  }
}

@resourceSearchAttr(resourceSearchType.modelMapper)
export class modelMapperSearch extends pageSearchBase {
  isNeedCache: boolean = true
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('模型映射', resourceSearchType.modelMapper)
    nodegroup.canScrollPage = true
    nodegroup.canSearch = true

    let queryParam = {
      filter: {
        compares: []
      },
      orders: [
        {
          direction: 'DESC',
          fieldName: 'modifyTime'
        }
      ],
      pageNumber: this.pageIndex,
      pageSize: this.pageSize
    }
    if (searchstr) {
      queryParam.filter.compares.push({
        combine: 'OR',
        combined: true,
        compare1: {
          compare: 'ALL_LIKE',
          field: 'mapperCode',
          value: searchstr
        },
        compare2: {
          compare: 'ALL_LIKE',
          field: 'mapperName',
          value: searchstr
        }
      })
      // queryParam.filter['mapperName'] = searchstr
      // queryParam.filter['mapperCode'] = searchstr
    }
    let result = CurrentApis.ModelMapperPageQuery_Sync(queryParam)
    this.totalPageNumber = (result as any).totalPages
    this.pageIndex = (result as any).pageNumber
    this.pageSize = (result as any).pageSize

    let modelMappers = (result as any).content
    if (modelMappers) {
      for (let index = 0; index < modelMappers.length; index++) {
        let modelMapper = modelMappers[index]
        var modelMapperGroup = this.makeMPGroupNode(modelMapper)
        nodegroup.childrenGroups.push(modelMapperGroup)
      }
    }

    return nodegroup
  }

  private makeMPGroupNode(modelMapper: any): groupNode {
    var modelMapperGroup = makeGroupNode(modelMapper.mapperName, resourceSearchType.modelMapper)
    var newObjNode = pageSearchBase.actionFctory.makeObject(getUuid(), modelMapper.mapperCode, objectType.variable, resourceType.modelMapper) as object_Variable
    modelMapperGroup.childrenObjs.push(newObjNode)
    return modelMapperGroup
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
  new workflowSearch(),
  new customFunctionSearch(),
  new signsSearch(),
  new filterSignsSearch(),
  new fixedValSearch(),
  new variableSearch(),
  // new controlsSearch(),
  // new modelsSearch(),
  new enumsSearch(),
  new fileTemplatesSearch(),
  new localStoragesSearch(),
  new normalPopupWindowSearch(),
  new pageResourcesSearch(),
  new pagePopupSearch(),
  new pageRouteSearch(),
  new modelMapperSearch(),
  new consoleSettingsSearch(),
  new externalLinkSearch()
]

export function clearAllSearchCache() {
  allSearches.forEach((o) => o.clear())
}

export default function getSearchClass(resType: resourceSearchType): pageSearchBase {
  return allSearches.filter((o: any) => o.constructor.prototype.$Meta.resType == resType)[0]
}
