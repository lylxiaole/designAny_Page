import common from '../commonMethod'

import PageBase from '../../05designerLayouts/PageBase'
import ComponentBase from '../../04designerComponents/ComponentBase'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { behavior, variable, action, actionDetail } from './behaviorTypes'
import {
  objectBase,
  objectType,
  resourceType,
  resourceSearchType,
  object_Method,
  object_Variable,
  allCuteSigns,
  allFilterSigns,
  resourceSearchAttr,
} from './01_actionCommon'
import factory from './03_actionFactory'
import { CurrentContext, CurrentApis, pagenNodeType } from '../../01designerContext'
import { Property } from '../commonClasses/LayoutProperty'
import { layoutMethod, param, paramType } from '../commonClasses/layoutEvent'
import paramInfo from '../commonClasses/pageInParamInfo'
import modelBingding, { getAllFilters, modelDataTypeEnum } from '../commonClasses/modelBingding'
import modelAnalysis, { modelTypeEnum } from '../impResourcesCache/modelAnalysis'
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
  newnode.key = common.getUuid()
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
    var newwfnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '入参', objectType.method, resourceType.behaviorInParam)
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
    let newObjParam = pageSearchBase.actionFctory.makeObject(
      pageSearchBase.currentPage.Id,
      '回调行为',
      objectType.callback,
      resourceType.callback
    ) as object_callback
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
      let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), context.contextCode, objectType.fixedVal, resourceType.fixedVal)
      obj.inputParams.push({ name: context.contextCode, obj: newObjParam, isModel: false })
    } else {
      let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), context.contextCode, objectType.fixedVal, resourceType.fixedVal)
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
      //   common.getUuid() + '&' + element.id,
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
        var newwfnode = pageSearchBase.actionFctory.makeObject(
          common.getUuid() + '&' + dictId + '&' + item.item_code,
          item.item_name,
          objectType.method,
          resourceType.systemDict
        )
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
    var newObjNode = pageSearchBase.actionFctory.makeObject(
      common.getUuid(),
      customFunction.func_code,
      objectType.method,
      resourceType.customFunctions
    ) as object_Method
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
        let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), key, objectType.fixedVal, resourceType.fixedVal)
        nodeinfo.inputParams.push({ name: key, obj: newObjParam, isModel: false })
      }
    } else {
      for (let index = 0; index < Object.values(jsonParam).length; index++) {
        const element = Object.values(jsonParam)[index] as any
        let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), element.name, objectType.fixedVal, resourceType.fixedVal)
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
      var newgroup = pageSearchBase.actionFctory.makeObject(
        common.getUuid() + '&' + element.id + '&' + element.file_name + '&' + element.file_url,
        element.file_name + '(下载)',
        objectType.method,
        resourceType.fileTemplate
      )
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
      //   common.getUuid() + '&' + element.id + '&' + element.storage_code + '&' + element.storage_name + '&' + element.expires,
      //   element.storage_name,
      //   objectType.method,
      //   resourceType.localStorage
      // )
      // group.childrenObjs.push(newgroup)
      var newgroup = makeGroupNode(element.storage_name, resourceSearchType.localStorage)
      let lsArry = [
        {
          lsName: '获取本地资源',
        },
        {
          lsName: '设置本地资源',
        },
        {
          lsName: '删除本地资源',
        },
      ]
      lsArry.forEach((item: any) => {
        var newwfnode = pageSearchBase.actionFctory.makeObject(
          common.getUuid() + '&' + element.id + '&' + element.storage_code + '&' + element.storage_name + '&' + element.expires,
          item.lsName,
          objectType.method,
          resourceType.localStorage
        )
        if (item.lsName === '设置本地资源') {
          let nodep1 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '手动固定值', objectType.fixedVal, resourceType.fixedVal)
          ;(newwfnode as object_Method).inputParams.push({ name: '设置值', obj: nodep1, isModel: false })
        }
        newgroup.childrenObjs.push(newwfnode)
      })
      group.childrenGroups.push(newgroup)
    }

    var newgroupcode = makeGroupNode('应用编码', resourceSearchType.localStorage)
    var appcode = pageSearchBase.actionFctory.makeObject(
      common.getUuid() + '&' + common.getUuid() + '&' + 'GenoAny-AppCode' + '&' + '应用编码',
      '获取本地资源',
      objectType.method,
      resourceType.localStorage
    )
    newgroupcode.childrenObjs.push(appcode)
    group.childrenGroups.push(newgroupcode)
    var newgroupuser = makeGroupNode('登录人员信息', resourceSearchType.localStorage)
    var usercode = pageSearchBase.actionFctory.makeObject(
      common.getUuid() + '&' + common.getUuid() + '&' + 'State_Info' + '&' + '登录人员信息',
      '获取本地资源',
      objectType.method,
      resourceType.localStorage
    )
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
      var newwfnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), sign.title, objectType.signs, resourceType.signs)
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
      var newwfnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), sign.title, objectType.signs, resourceType.filterSigns)
      nodegroup.childrenObjs.push(newwfnode)
    })
    return nodegroup
  }
}

@resourceSearchAttr(resourceSearchType.fixedVal)
export class fixedValSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupNode = makeGroupNode('固定值分组', resourceSearchType.fixedVal)
    var fixedValNode = pageSearchBase.actionFctory.makeObject(
      common.getUuid() + '&字符串',
      '固定值-字符串',
      objectType.fixedVal,
      resourceType.fixedVal
    )
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&布尔', '固定值-布尔', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&整数', '固定值-整数', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&浮点数', '固定值-浮点数', objectType.fixedVal, resourceType.fixedVal)
    groupNode.childrenObjs.push(fixedValNode)
    //
    fixedValNode = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&空值', '固定值-空值', objectType.method, resourceType.fixedVal)
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
    var createVaNode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '新建变量', objectType.variable, resourceType.variables)
    groupinfo.childrenObjs.push(createVaNode)
    /*****************************/
    var allVariables = this.findVariableActs(pageSearchBase.currentBehavior.actions)
    allVariables.filter((o) => {
      var objNode = pageSearchBase.actionFctory.makeObject(common.getUuid(), o.name, objectType.variable, resourceType.variables)
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

@resourceSearchAttr(resourceSearchType.pageContext)
export class pageContextSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    // window.console.log('组织页面上下文了')
    var nodegroup = makeGroupNode('当前页面上下文', resourceSearchType.pageContext)
    this.makePageContext(pageSearchBase.currentPage, nodegroup)
    return nodegroup
  }

  private makePageContext(page: PageBase, groupNode: groupNode) {
    //父页面
    if (page && page.parentPage) {
      var parentPageGroup = makeGroupNode('父页面', resourceSearchType.pageContext)
      this.makePageContext(page.parentPage, parentPageGroup)
      groupNode.childrenGroups.push(parentPageGroup)
    }
    //页面属性
    var compPropertiesTreeNode = makeGroupNode('属性', resourceSearchType.pageContext)
    this.cutePageProperties(compPropertiesTreeNode, page, page.LayoutProperties, page.Id)
    groupNode.childrenGroups.push(compPropertiesTreeNode)
    //组件方法
    var compMethodsTreeNode = makeGroupNode('方法', resourceSearchType.pageContext)
    this.cutePageMethos(compMethodsTreeNode, page, page.DesignerMethods, page.Id)
    groupNode.childrenGroups.push(compMethodsTreeNode)
    //页面入参
    var nodegroup = makeGroupNode('页面入参', resourceSearchType.pageContext)
    page.inParams.filter((o) => {
      var objNode = pageSearchBase.actionFctory.makeObject(o.key, o.paramName, objectType.method, resourceType.pageInParams, page.Id) as object_Method
      nodegroup.childrenObjs.push(objNode)
    })
    groupNode.childrenGroups.push(nodegroup)
    /**控件资源 */
    var compsnodegroup = makeGroupNode('控件资源', resourceSearchType.controlsInPage)
    this.cuteCompsGroup(page.layoutChildren, compsnodegroup, page.Id)
    groupNode.childrenGroups.push(compsnodegroup)
    /**模型实例 */
    var mbgroupinfo = makeGroupNode('模型实例', resourceSearchType.models)
    this.cutePageModelBinds(page, mbgroupinfo)
    groupNode.childrenGroups.push(mbgroupinfo)
    /**页面行为 */
    var behgroupinfo = makeGroupNode('行为列表', resourceSearchType.models)
    this.makePageBahaviors(page, behgroupinfo)
    groupNode.childrenGroups.push(behgroupinfo)
  }

  public cutePageProperties(group: groupNode, component: LayoutBase, properties: Property[], pageId?: string) {
    properties
      .filter((o) => o.canSetting == true)
      .filter((p) => {
        var objNode = pageSearchBase.actionFctory.makeObject(p.id, p.propertyName, objectType.method, resourceType.propertiesInPage, pageId)
        group.childrenObjs.push(objNode)
      })
    // })
  }
  public cutePageMethos(group: groupNode, component: LayoutBase, methods: layoutMethod[], pageId?: string) {
    methods.filter((method) => {
      var objNode = pageSearchBase.actionFctory.makeObject(
        common.getUuid(),
        method.eventName,
        objectType.method,
        resourceType.methodsInPage,
        pageId
      ) as object_Method
      if (method.inParams) {
        this.makeMethodInParams(objNode, method.inParams)
      }
      objNode.outParam = method.outParam
      group.childrenObjs.push(objNode)
    })
    // })
  }
  public cuteComsProperties(group: groupNode, component: LayoutBase, properties: Property[], pageId?: string) {
    properties
      .filter((o) => o.canSetting == true)
      .filter((p) => {
        var objNode = pageSearchBase.actionFctory.makeObject(p.id, p.propertyName, objectType.method, resourceType.controlProperties, pageId)
        group.childrenObjs.push(objNode)
      })
    // })
  }
  public cuteComsMethos(group: groupNode, component: LayoutBase, methods: layoutMethod[], pageId?: string) {
    methods.filter((method) => {
      var objNode = pageSearchBase.actionFctory.makeObject(
        component.Id,
        method.eventName,
        objectType.method,
        resourceType.controlMethods,
        pageId
      ) as object_Method
      if (method.inParams) {
        this.makeMethodInParams(objNode, method.inParams)
      }
      objNode.outParam = method.outParam
      //区分一下，只在特定的方法上面支持动态参数
      if (method.eventName == '新建报表' || method.eventName == '查看报表'){
        objNode.dynamic = true
      }
      else{
        objNode.dynamic = false
      }
      group.childrenObjs.push(objNode)
    })
    // })
  }
  public makeMethodInParams(obj: object_Method, params: param[], pageId?: string) {
    params.filter((mInparam) => {
      let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), mInparam.name, objectType.fixedVal, resourceType.fixedVal, pageId)
      obj.inputParams.push({ name: mInparam.name, obj: newObjParam, isModel: false })
    })
  }
  public cuteCompsGroup(comps: LayoutBase[], group: groupNode, pageId?: string) {
    comps.filter((comp) => {
      var compGroup = makeGroupNode(!comp.name ? '未命名' : comp.name, resourceSearchType.controlsInPage)
      //组件属性
      var compPropertiesTreeNode = makeGroupNode('属性', resourceSearchType.controlsInPage)
      this.cuteComsProperties(compPropertiesTreeNode, comp, comp.LayoutProperties, pageId)
      compGroup.childrenGroups.push(compPropertiesTreeNode)
      //组件方法
      var compMethodsTreeNode = makeGroupNode('方法', resourceSearchType.controlsInPage)
      this.cuteComsMethos(compMethodsTreeNode, comp, comp.DesignerMethods, pageId)
      compGroup.childrenGroups.push(compMethodsTreeNode)
      //子组件
      if (comp.layoutChildren.length > 0) {
        var childrenGroup = makeGroupNode('子组件', resourceSearchType.controlsInPage)
        this.cuteCompsGroup(comp.layoutChildren, childrenGroup, pageId)
        compGroup.childrenGroups.push(childrenGroup)
      }
      group.childrenGroups.push(compGroup)
    })
  }
  public cutePageModelBinds(page: PageBase, groupinfo: groupNode) {
    for (let index = 0; index < page.modelBindings.length; index++) {
      const modelBinding = page.modelBindings[index]
      let modelbdName = modelBinding.modelBindingName
      if (modelBinding.modelBindingType == 2) {
        let newnode = pageSearchBase.actionFctory.makeObject(modelbdName, modelbdName, objectType.method, resourceType.models, page.Id)
        groupinfo.childrenObjs.push(newnode)
      } else {
        var modelbindGroup = makeGroupNode(modelbdName, resourceSearchType.models)
        if (modelBinding.modelDetailInfo) {
          this.makeModelFilterPaths(modelbindGroup, modelBinding, page.Id)

          this.makeModelRulePaths(modelbindGroup, modelBinding, page.Id)
          this.makeModelPropertyPaths(modelbindGroup, modelBinding, page.Id)
        }
        groupinfo.childrenGroups.push(modelbindGroup)
      }
    }
  }
  private makeModelPropertyPaths(group: groupNode, modelbd: modelBingding, pageId?: string) {
    let jiegounode = pageSearchBase.actionFctory.makeObject(modelbd.modelBindingName, '结构', objectType.method, resourceType.modelsStructure, pageId)
    group.childrenObjs.push(jiegounode)

    let newnode = pageSearchBase.actionFctory.makeObject(modelbd.modelBindingName, '属性-全选', objectType.method, resourceType.models, pageId)
    group.childrenObjs.push(newnode)

    if (!modelbd.modelDetailInfo) {
      return
    }

    if (modelbd.modelDetailInfo.modelType == modelTypeEnum.TREE) {
      return
    }
    var properties = modelbd.modelDetailProperties
    properties.forEach((o) => {
      let resourceid = modelbd.modelBindingName + '&' + o.propertyCode
      let objname = '属性-[' + modelAnalysis.getModelPropertyShowName(o) + ']'
      let newnode = pageSearchBase.actionFctory.makeObject(resourceid, objname, objectType.method, resourceType.modelsProperty, pageId)

      group.childrenObjs.push(newnode)
    })
  }
  private makeModelFilterPaths(group: groupNode, modelbd: modelBingding, pageId?: string) {
    // window.console.log('---------计算模型实例的筛选条件:', modelbd)
    if (!modelbd.modelDetailInfo) {
      return
    }

    var properties = modelbd.modelDetailProperties

    modelbd.modelFilters.forEach((o) => {
      let resourceid = modelbd.modelBindingName + '&' + o.id
      var typestr = getAllFilters().find((f) => f.val == o.type).name
      var bdProp = properties.find((p) => p.propertyCode == o.code)
      if (bdProp) {
        var propertyName = bdProp.propertyName
        let objname = '筛选条件:' + '[' + propertyName + '-' + typestr + '-' + '筛选值]'
        let newnode = pageSearchBase.actionFctory.makeObject(resourceid, objname, objectType.method, resourceType.modelsFilter, pageId)
        group.childrenObjs.push(newnode)
      }
    })
  }

  private makeModelRulePaths(group: groupNode, modelbd: modelBingding, pageId?: string) {
    if (!modelbd.modelDetailInfo) {
      return
    }
    var properties = modelbd.modelDetailProperties

    properties.forEach((element) => {
      if (element.ruleId) {
        let resourceid = modelbd.modelBindingName + '&' + element.propertyCode
        let objname = '属性规则:[' + element.propertyName + ']'
        let newnode = pageSearchBase.actionFctory.makeObject(resourceid, objname, objectType.method, resourceType.modelsPropRule, pageId)
        group.childrenObjs.push(newnode)
      }
    })
  }

  private makePageBahaviors(page: PageBase, group: groupNode) {
    for (let index = 0; index < page.behaviors.length; index++) {
      let behav = page.behaviors[index]
      let newnode = pageSearchBase.actionFctory.makeObject(behav.id, behav.name, objectType.method, resourceType.behaviors, page.Id) as object_Method

      let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), '行为入参', objectType.fixedVal, resourceType.fixedVal)
      newnode.inputParams.push({ name: '行为入参', obj: newObjParam, isModel: false })
      group.childrenObjs.push(newnode)
    }
  }
}

@resourceSearchAttr(resourceSearchType.normalPopupWindow)
export class normalPopupWindowSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var groupinfo = makeGroupNode('全局通用方法', resourceSearchType.normalPopupWindow)
    var param = pageSearchBase.actionFctory.makeObject(common.getUuid(), '提示文字', objectType.fixedVal, resourceType.fixedVal)
    //
    let newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '确认弹窗', objectType.method, resourceType.normalPopupWindow)
    ;(newnode as object_Method).inputParams.push({ name: '提示文字', obj: param, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '警告弹窗', objectType.method, resourceType.normalPopupWindow)
    ;(newnode as object_Method).inputParams.push({ name: '提示文字', obj: param, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '错误弹窗', objectType.method, resourceType.normalPopupWindow)
    ;(newnode as object_Method).inputParams.push({ name: '提示文字', obj: param, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    this.makeConfirm(groupinfo)
    //
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), 'Excel上传解析', objectType.method, resourceType.uploadFile)
    let node = pageSearchBase.actionFctory.makeObject(common.getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    let node2 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '回调事件', objectType.callback, resourceType.callback) as object_callback
    node2.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '从第几行开始读取', obj: node, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '回调事件', obj: node2, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    ////////////////////////////////////////////////////////////////////////
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '通用上传文件', objectType.method, resourceType.uploadFile_all)
    let uln1 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&字符串', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln1 as object_FixedVal).val = '*'
    let uln2 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&整数', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln2 as object_FixedVal).val = 1
    let uln3 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&整数', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln3 as object_FixedVal).val = 10
    let uln4 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '回调事件', objectType.callback, resourceType.callback) as object_callback
    uln4.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '文件类型', obj: uln1, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '最大文件个数', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '文件最大尺寸(MB)', obj: uln3, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '回调事件', obj: uln4, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '获取时间', objectType.method, resourceType.serverTimeNow)
    groupinfo.childrenObjs.push(newnode)
    //
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid() + '显示', '显示加载窗', objectType.method, resourceType.controlLoadingWindow)
    groupinfo.childrenObjs.push(newnode)
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid() + '关闭', '关闭加载窗', objectType.method, resourceType.controlLoadingWindow)
    groupinfo.childrenObjs.push(newnode)
    //
    let newnodedown = pageSearchBase.actionFctory.makeObject(common.getUuid(), '文件下载', objectType.method, resourceType.downloadFile)
    let nodep1 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(newnodedown as object_Method).inputParams.push({ name: '文件链接', obj: nodep1, isModel: false })
    groupinfo.childrenObjs.push(newnodedown)
    //
    let newnodebreak = pageSearchBase.actionFctory.makeObject(common.getUuid(), '终止行为(当前)', objectType.method, resourceType.breakBehavior)
    groupinfo.childrenObjs.push(newnodebreak)
    //
    let newnodebreakall = pageSearchBase.actionFctory.makeObject(common.getUuid(), '终止行为(所有)', objectType.method, resourceType.breakBehaviorAll)
    groupinfo.childrenObjs.push(newnodebreakall)
    //
    let newnodeopenexe = pageSearchBase.actionFctory.makeObject(common.getUuid(), '打开本地程序', objectType.method, resourceType.callLocalProgram)
    uln1 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&字符串', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    ;(uln1 as object_FixedVal).val = 'GenoAny'
    uln2 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&字符串', '文件路径', objectType.fixedVal, resourceType.fixedVal)
    ;(newnodeopenexe as object_Method).inputParams.push({ name: '本地程序名称', obj: uln1, isModel: false })
    ;(newnodeopenexe as object_Method).inputParams.push({ name: '参数', obj: uln2, isModel: false })
    groupinfo.childrenObjs.push(newnodeopenexe)
    //
    //打印模板设计
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '设计模板', objectType.method, resourceType.designReportTemplate)
    uln1 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '报表数据源', objectType.fixedVal, resourceType.fixedVal)
    uln2 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '报表模板模型', objectType.fixedVal, resourceType.fixedVal)
    uln3 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '数据源模型结构', objectType.fixedVal, resourceType.fixedVal)
    uln4 = pageSearchBase.actionFctory.makeObject(common.getUuid(), '保存回调事件', objectType.callback, resourceType.callback) as object_callback
    uln4.isChoosePageSource = false
    ;(newnode as object_Method).inputParams.push({ name: '报表模板id', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '保存回调事件', obj: uln4, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '报表数据源', obj: uln1, isModel: false })
    //;(newnode as object_Method).inputParams.push({ name: '数据源模型结构', obj: uln3, isModel: false })
    ;(newnode as object_Method).dynamic = true
    groupinfo.childrenObjs.push(newnode)
    //打印预览
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '打印预览', objectType.method, resourceType.reportPrintPreview)
    ;(newnode as object_Method).inputParams.push({ name: '报表模板id', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '报表数据源', obj: uln1, isModel: false })
    //;(newnode as object_Method).inputParams.push({ name: '数据源模型结构', obj: uln3, isModel: false })
    ;(newnode as object_Method).dynamic = true
    groupinfo.childrenObjs.push(newnode)
    //打印
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '打印', objectType.method, resourceType.reportPrint)
    ;(newnode as object_Method).inputParams.push({ name: '报表模板id', obj: uln2, isModel: false })
    ;(newnode as object_Method).inputParams.push({ name: '报表数据源', obj: uln1, isModel: false })
    //;(newnode as object_Method).inputParams.push({ name: '数据源模型结构', obj: uln3, isModel: false })
    ;(newnode as object_Method).dynamic = true
    groupinfo.childrenObjs.push(newnode)
    //打开网络文件(刘少彬特需)
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '本地预览网络文件', objectType.method, resourceType.openLocalExeToOpenFile)
    ;(newnode as object_Method).inputParams.push({ name: '文件相对路径', obj: uln2, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    //删除报表
    newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '删除报表', objectType.method, resourceType.deleteReport)
    ;(newnode as object_Method).inputParams.push({ name: '报表id', obj: uln2, isModel: false })
    groupinfo.childrenObjs.push(newnode)
    return groupinfo
  }

  private makeConfirm(group: groupNode) {
    var newnode = pageSearchBase.actionFctory.makeObject(common.getUuid(), '询问弹窗', objectType.method, resourceType.confirmPopup)
    var paramstr = pageSearchBase.actionFctory.makeObject(common.getUuid(), '提示文字', objectType.fixedVal, resourceType.fixedVal)
    var paramIsShowCancel = pageSearchBase.actionFctory.makeObject(
      common.getUuid() + '&布尔',
      '显示取消按钮',
      objectType.fixedVal,
      resourceType.fixedVal
    )
    paramIsShowCancel.ref = 'true'
    var surecb = pageSearchBase.actionFctory.makeObject(common.getUuid(), '取消回调', objectType.callback, resourceType.callback) as object_callback
    surecb.isChoosePageSource = false
    var cancelcb = pageSearchBase.actionFctory.makeObject(common.getUuid(), '取消回调', objectType.callback, resourceType.callback) as object_callback
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
        appId: CurrentContext.AppID,
      },
      orders: [
        {
          direction: 'ASC',
          fieldName: 'orderIndex',
        },
        {
          direction: 'ASC',
          fieldName: 'modifyTime',
        },
      ],
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
        children: [],
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
    var node = pageSearchBase.actionFctory.makeObject(common.getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-宽度', obj: node, isModel: false })
    node = pageSearchBase.actionFctory.makeObject(common.getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-高度', obj: node, isModel: false })
    node = pageSearchBase.actionFctory.makeObject(common.getUuid(), '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-标题', obj: node, isModel: false })
    //
    const node3 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&布尔', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    obj.inputParams.push({ name: '弹窗样式-全屏', obj: node3, isModel: false })
    //
    node = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&布尔', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    node.ref = 'false'
    obj.inputParams.push({ name: '关闭图标触发回调', obj: node, isModel: false })
    //TODO 增加弹窗关闭回调事件
    const cnnode = pageSearchBase.actionFctory.makeObject(
      obj.resourceId,
      '弹窗关闭回调',
      objectType.callback,
      resourceType.callback
    ) as object_callback
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
        appId: CurrentContext.AppID,
      },
      orders: [
        {
          direction: 'ASC',
          fieldName: 'orderIndex',
        },
        {
          direction: 'ASC',
          fieldName: 'modifyTime',
        },
      ],
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
  //   let newObjParam2 = pageSearchBase.actionFctory.makeObject(common.getUuid(), inParamName, objectType.variable, resourceType.variables)
  //   obj.inputParams.push({ name: inParamName, obj: newObjParam2, isModel: false })
  // }

  private async initTreeNode(menuPage, res) {
    res.forEach((element) => {
      let menu = {
        id: element.tag && element.tag.pageId ? element.tag.pageId : element.key,
        text: element.title,
        type: element.leaf ? '1' : '0',
        obj: element.tag,
        children: [],
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
        appId: CurrentContext.AppID,
      },
      orders: [
        {
          direction: 'ASC',
          fieldName: 'orderIndex',
        },
        {
          direction: 'ASC',
          fieldName: 'modifyTime',
        },
      ],
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
        children: [],
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
        compares: [],
      },
      orders: [
        {
          direction: 'DESC',
          fieldName: 'modifyTime',
        },
      ],
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
    }
    if (searchstr) {
      queryParam.filter.compares.push({
        combine: 'OR',
        combined: true,
        compare1: {
          compare: 'ALL_LIKE',
          field: 'mapperCode',
          value: searchstr,
        },
        compare2: {
          compare: 'ALL_LIKE',
          field: 'mapperName',
          value: searchstr,
        },
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
    var newObjNode = pageSearchBase.actionFctory.makeObject(
      common.getUuid(),
      modelMapper.mapperCode,
      objectType.variable,
      resourceType.modelMapper
    ) as object_Variable
    modelMapperGroup.childrenObjs.push(newObjNode)
    return modelMapperGroup
  }
}
@resourceSearchAttr(resourceSearchType.consoleSettings)
export class consoleSettingsSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('调试输出配置', resourceSearchType.pageContext)
    let newNode = pageSearchBase.actionFctory.makeObject(
      common.getUuid(),
      '调试输出',
      objectType.method,
      resourceType.consoleSettings
    ) as object_Method
    newNode.inputParams = []
    let paramSign: string = '输出标记'
    let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), paramSign, objectType.fixedVal, resourceType.fixedVal)
    newNode.inputParams.push({ name: paramSign, obj: newObjParam, isModel: false })
    let inParamName: string = '输出参数'
    let newObjParam2 = pageSearchBase.actionFctory.makeObject(common.getUuid(), inParamName, objectType.variable, resourceType.variables)
    newNode.inputParams.push({ name: inParamName, obj: newObjParam2, isModel: false })
    nodegroup.childrenObjs.push(newNode)
    return nodegroup
  }
}

@resourceSearchAttr(resourceSearchType.externalLinks)
export class externalLinkSearch extends pageSearchBase {
  protected async search_inner(searchstr: string): Promise<groupNode> {
    var nodegroup = makeGroupNode('外部链接', resourceSearchType.externalLinks)
    let newNode = pageSearchBase.actionFctory.makeObject(common.getUuid(), 'URL地址', objectType.method, resourceType.externalLinks) as object_Method
    newNode.inputParams = []
    let paramSign: string = 'URL地址'
    let newObjParam = pageSearchBase.actionFctory.makeObject(common.getUuid(), paramSign, objectType.fixedVal, resourceType.fixedVal)
    newNode.inputParams.push({ name: paramSign, obj: newObjParam, isModel: false })
    nodegroup.childrenObjs.push(newNode)
    return nodegroup
  }
}

var allSearches: pageSearchBase[] = [
  new behaviorInParamSearch(),
  new pageContextSearch(),
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
  new externalLinkSearch(),
]

export function clearAllSearchCache() {
  allSearches.forEach((o) => o.clear())
}

export default function getSearchClass(resType: resourceSearchType): pageSearchBase {
  return allSearches.filter((o: any) => o.constructor.prototype.$Meta.resType == resType)[0]
}
