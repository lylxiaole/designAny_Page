import { Component, Prop, Vue, Emit, Watch, Provide } from 'vue-property-decorator'
import { Property, TimePickerFile_Property, Authority_Property, BindingModels_Property, UploadFile_Property, JavaScriptCode_Property, PageInParams_Property, Behavior_Property, PropertyGroupName, Number_Property, Boolean_Property } from '../02common/commonClasses/LayoutProperty'

import { ModelInfo, modelSimpleInfo, modelDetailInfo, ModelProperty, propertyValidator, ModelBindingProperty, DecoratorOption, DecoratorRule, modelTypeEnum } from '../02common/impResourcesCache/modelAnalysis'

import { modelAnalysis, functionCache, dictCache, modelMapperCache, pageCache, pageContentTable, pageStatus } from '../02common/impResourcesCache'

import { ComponentBase } from '../04designerComponents'
import common from '../02common/commonMethod'
import LayoutBase, { SaveInfo } from '../03designerLayoutBase/LayoutBase'
import LayoutContainer from '../03designerLayoutBase/LayoutContainner'

import paramInfo from '../02common/commonClasses/pageInParamInfo'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, modelDataTypeEnum, modelFilter } from '../02common/commonClasses/modelBingding'
import { CurrentApis } from '../01designerContext'
import { behavior, factory, action, actionDetail, resourceType, objectType, object_Method, object_callback, objectBase } from '../02common/behavior'
import { layoutEvent, layoutMethod, param, paramType } from '../02common/commonClasses/layoutEvent'

class PopupInfo {
  popupId: any
  isCallback: boolean
}

class PageResourceType {
  pageId: string
  modelIds: string[] = []
  funcCodes: string[] = []
  dictIds: string[] = []
  mapperCodes: string[] = []
  localStorageIds: string[] = []
  fileTempIds: string[] = []
  workFlowIds: string[] = []
}

class pageResourceResult {
  dicts: any[]
  functions: any[]
  models: any[]
  mappers: any[]
  userComponents: any[]
}

class checkoutInfoClass {
  checkoutStatus: pageStatus = pageStatus.unCheckout
  checkoutUsername: string
}

export default class PageBase extends LayoutContainer {
  public parentPage: PageBase
  //是否是组件模板
  //如果正在以弹窗显示的话，就有这个字段
  public popupInfo: PopupInfo
  public isNeedSave: boolean = false
  public isReadyToDraw: boolean = false
  //签入签出信息
  public checkoutInfo: checkoutInfoClass = new checkoutInfoClass()
  /***************************** */
  /**模型实例名称，在一个页面内不可以重复 */
  get modelBindings(): modelBingding[] {
    return this.getMobindsFromPageProperty(this.LayoutProperties)
  }
  set modelBindings(binds: modelBingding[]) {
    var property = this.FindProperties(PropertyGroupName.normal, '模型实例')[0]
    if (!property.value) {
      property.value = []
    }
    this.SetPropertyVal(property.id, binds)
  }

  public permissions: any[]

  private getPermissions(routes: any[], targetPageId: string): any[] {
    if (!routes) {
      return null
    }

    for (let index = 0; index < routes.length; index++) {
      const element = routes[index]
      if (element.meta && element.meta.query && element.meta.query.tag && element.meta.query.tag.obj && element.meta.query.tag.obj.pageId && element.meta.query.tag.obj.pageId == targetPageId) {
        return element.meta.query.tag.obj.pagePermissionList
      }
      if (element.children) {
        var res = this.getPermissions(element.children, targetPageId)
        if (res) {
          return res
        }
      }
    }
  }

  /**行为列表*/
  public get behaviors(): behavior[] {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '行为列表')
    if (!property.value) {
      property.value = []
    }
    return property.value as behavior[]
  }
  public set behaviors(val: behavior[]) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '行为列表')
    if (!property.value) {
      property.value = []
      return
    }
    property.value = val
  }

  public get tickTime(): number {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '定时器周期')
    if (!property || !property.value) {
      return 0
    }
    return property.value
  }
  public set tickTime(val: number) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '定时器周期')
    if (!property) {
      return
    }
    this.SetPropertyVal(property.id, val)
  }

  created() {
    this.RegisterProperty('拓展js', PropertyGroupName.normal, new JavaScriptCode_Property(), false, false, false)
    this.RegisterProperty('页面入参', PropertyGroupName.normal, new PageInParams_Property())
    this.RegisterProperty('权限设置', PropertyGroupName.normal, new Authority_Property())
    this.RegisterProperty('模型实例', PropertyGroupName.normal, null, false, false)
    this.RegisterProperty('行为列表', PropertyGroupName.normal, new Behavior_Property(), false, false)
    this.RegisterProperty('定时器周期', PropertyGroupName.normal, new Number_Property(1, 999999999, 1), 10, true, true, '秒')

    this.RegisterEvents('加载完成', '页面加载完成时触发', [], null)
    this.RegisterMethods(
      '关闭页面-触发回调',
      '',
      () => {
        this.ClosePage(true)
      },
      [],
      null
    )
    this.RegisterMethods(
      '关闭页面-不触发回调',
      '',
      () => {
        this.ClosePage(false)
      },
      [],
      null
    )
    this.RegisterEvents('定时器触发事件', '定时器触发', [], null)
  }
  mounted() {
    if (this.IsDesigning) {
      this.onChangedScale_Event = (sizeChange: number): boolean => {
        this.scaleSize(sizeChange)
        return false
      }
      this.onDragSelf_Event = (xmove: number, ymove: number) => {
        this.left += xmove
        this.top += ymove
      }
      this.onClick_Event = (e: Event, comp: ComponentBase) => {
        this.chooseComps([])
        e.stopPropagation()
      }
      this.onBoxSelect_Event = this.OnBoxSelectEvent
      this.onPositionLeft_Event = () => {
        this.selectedCompsPositionChange(-1, 0)
      }
      this.onPositionRight_Event = () => {
        this.selectedCompsPositionChange(1, 0)
      }
      this.onPositionTop_Event = () => {
        this.selectedCompsPositionChange(0, -1)
      }
      this.onPositionBotton_Event = () => {
        this.selectedCompsPositionChange(0, 1)
      }
      this.onWidthSmall_Event = () => {
        this.selectedCompsSizeChange(-1, 0)
      }
      this.onWidthBig_Event = () => {
        this.selectedCompsSizeChange(1, 0)
      }
      this.onHeightSmall_Event = () => {
        this.selectedCompsSizeChange(0, -1)
      }
      this.onHeightBig_Event = () => {
        this.selectedCompsSizeChange(0, 1)
      }
      this.onMouseWheelInLayout_Event = (event: any) => {
        // window.console.log('onMouseWheelInLayout_Event', this.$el)
        //var wheelvalue = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        //e.originalEvent.wheelDelta => 120(up) or -120(down) 谷歌IE内核
        //e.originalEvent.detail => -3(up) or 3(down) 火狐内核
        var areaComponents: ComponentBase[] = []
        var mousex = event.clientX
        var mousey = event.clientY
        let allchildrensR = this.getAllChildrenRecursion(this.children)

        for (let index = 0; index < allchildrensR.length; index++) {
          const element = allchildrensR[index]
          if (!element.$el) {
            continue
          }

          var componentdom = $(element.$el)
          var componentleft = componentdom.offset().left
          var componenttop = componentdom.offset().top
          var componentRight = componentleft + componentdom.width() * this.currentScaleSize
          var componentBottom = componenttop + componentdom.height() * this.currentScaleSize
          if (mousex > componentleft && mousex < componentRight && mousey > componenttop && mousey < componentBottom) {
            areaComponents.push(element as ComponentBase)
          }
        }

        if (areaComponents.length < 1) {
          return false
        }
        var maxZIndexComp: ComponentBase = null
        for (var v in areaComponents) {
          if (areaComponents[v].wheelIndex == 49) {
            maxZIndexComp = areaComponents[v]
          }
        }
        if (maxZIndexComp == null) {
          maxZIndexComp = areaComponents[0]
        }
        maxZIndexComp.wheelIndex = 1

        var comIndex = areaComponents.indexOf(maxZIndexComp)
        if (comIndex == areaComponents.length - 1) {
          comIndex = 0
        } else {
          comIndex++
        }

        maxZIndexComp = areaComponents[comIndex]
        maxZIndexComp.wheelIndex = 49
        this.chooseComps([maxZIndexComp])
        event.stopPropagation()
        event.preventDefault()
      }
    }
  }

  beforeDestroy() {
    $(window).unbind('resize', this.onWindowResize as any)
  }
  // *******************************框选功能**************************************************************************************
  private OnBoxSelectEvent(e: MouseEvent) {
    //因为e.currentTarget是看板布局，它是会缩放的，所以要用它的父级来计算
    var left = this.eventsOptions.mousedownPointX < e.clientX ? this.eventsOptions.mousedownPointX : e.clientX
    var top = this.eventsOptions.mousedownPointY < e.clientY ? this.eventsOptions.mousedownPointY : e.clientY
    var right = this.eventsOptions.mousedownPointX < e.clientX ? e.clientX : this.eventsOptions.mousedownPointX
    var bottom = this.eventsOptions.mousedownPointY < e.clientY ? e.clientY : this.eventsOptions.mousedownPointY
    var width = right - left
    var height = bottom - top
    var centerx = (left + right) / 2
    var centery = (top + bottom) / 2

    $(this.eventsOptions.boxSelectBorder).css('left', left)
    $(this.eventsOptions.boxSelectBorder).css('top', top)
    $(this.eventsOptions.boxSelectBorder).css('width', width)
    $(this.eventsOptions.boxSelectBorder).css('height', height)

    let chooseCs: any[] = this.findAllSelectAreaComps(centerx, centery, width, height, this.children)
    this.chooseComps(chooseCs)
  }
  private findAllSelectAreaComps(centerx: number, centery: number, width: number, height: number, layouts: LayoutBase[]): LayoutBase[] {
    let chooseCs: any[] = []
    for (var v in layouts) {
      var comp = layouts[v]
      if (!$(comp.$el).offset()) {
        continue
      }
      var compCenterx = $(comp.$el).offset().left + (comp.width * this.currentScaleSize) / 2
      var compCentery = $(comp.$el).offset().top + (comp.height * this.currentScaleSize) / 2
      var centerxlength = Math.abs(centerx - compCenterx)
      var centerylength = Math.abs(centery - compCentery)
      if (centerxlength < (width + comp.width * this.currentScaleSize) / 2 && centerylength < (height + comp.height * this.currentScaleSize) / 2) {
        chooseCs.push(comp)
      }
      if (comp.layoutChildren) {
        var findchildren = this.findAllSelectAreaComps(centerx, centery, width, height, comp.layoutChildren)
        chooseCs = chooseCs.concat(findchildren)
      }
    }
    return chooseCs
  }

  private selectedCompsPositionChange(xChange: number, yChange: number) {
    var selectedChildren = this.FindSelectedLayoutsRecursion()
    for (let index = 0; index < selectedChildren.length; index++) {
      const element = selectedChildren[index]
      element.left += xChange
      element.top += yChange
    }
  }
  private selectedCompsSizeChange(xChange: number, yChange: number) {
    var selectedChildren = this.FindSelectedLayoutsRecursion()
    for (let index = 0; index < selectedChildren.length; index++) {
      const element = selectedChildren[index]
      if (element.width > 0) {
        element.width += xChange
      }
      if (element.height > 0) {
        element.height += yChange
      }
    }
  }
  // *******************************固定脚本**************************************************************************************
  private getAllChildrenRecursion(layouts: LayoutBase[]) {
    let res = []
    for (let index = 0; index < layouts.length; index++) {
      const element = layouts[index]
      res.push(element)
      let childrenss = this.getAllChildrenRecursion(element.layoutChildren)
      res = res.concat(childrenss)
    }
    return res
  }

  private initFirstData() {
    //***创建一个入参*************** */
    var parainfo = new paramInfo()
    parainfo.key = common.getUuid()
    parainfo.paramType = 2
    parainfo.paramName = '页面操作类型'
    parainfo.paramIsList = false
    parainfo.paramVal = 0
    this.inParams.push(parainfo)

    this.isNeedSave = true
  }
  //数据兼容
  private jianrongBehavior(acts: (action | actionDetail)[]) {
    for (let index = 0; index < acts.length; index++) {
      const actdetail = acts[index]
      if ((actdetail as actionDetail).isActionDetail) {
        for (let index = 0; index < (actdetail as actionDetail).objs.length; index++) {
          const obj = (actdetail as actionDetail).objs[index]
          this.jianrongPopupWindow(obj)
        }
      } else {
        this.jianrongBehavior((actdetail as action).actionDetails)
      }
    }
  }
  /**临时的兼容脚本 */
  private jianrongPopupWindow(newObj: objectBase) {
    if (newObj.resourceType != resourceType.pagePopupWindow) {
      return
    }
    var objj = newObj as object_Method

    // object_callback
    var callbackfind = objj.inputParams.find((o) => o.obj.resourceType == resourceType.callback)
    var callback = null
    if (callbackfind) {
      callback = callbackfind.obj as object_callback
    } else {
      return
    }

    if (callback && callback.behavior) {
      callback.pCallbacks = []
      callback.pCallbacks.push({ behaviorId_InMainPage: callback.behavior.id, modelBindName_InPopupPage: '', id: common.getUuid() })
      callback.behavior = null
    }
    callback.resourceId = objj.resourceId
  }

  public recordResources(pageData: SaveInfo) {
    this.resourceObj = new PageResourceType()
    /**汇总行为中的公式，模型映射，枚举 */
    if (this.behaviors) {
      this.findCacheFromBahaviors(this.behaviors)
    }
    /**汇总模型实例中的所有基础模型，已经模型属性中的枚举 */
    if (this.modelBindings) {
      this.cuteModelBindCache(this.modelBindings)
    }
  }

  ////预加载模型实例
  private preLoadModelBinds(preLoadConfigs: PageResourceType) {
    let pageConfig = (CurrentApis.GetPageConfig(preLoadConfigs) as unknown) as pageResourceResult
    this.personalCompSettings = pageConfig.userComponents
    /////////////////////
    for (let index = 0; index < pageConfig.dicts.length; index++) {
      const element = pageConfig.dicts[index]
      if (!element) {
        continue
      }
      dictCache.addCache(element.id, element.sysDictItemList)
    }
    //////////////////
    for (let index = 0; index < pageConfig.functions.length; index++) {
      const element = pageConfig.functions[index]
      if (!element) {
        continue
      }
      functionCache.addCache(element.func_code, element.func_content)
    }
    //////////////////
    for (let index = 0; index < pageConfig.mappers.length; index++) {
      const element = pageConfig.mappers[index]
      if (!element) {
        continue
      }
      modelMapperCache.addCache(element.mapperCode, element)
    }
    //////////////////
    let basicModels = pageConfig.models.filter((o) => o.modelType == modelTypeEnum.BASIC)
    let viewmodels = pageConfig.models.filter((o) => o.modelType == modelTypeEnum.VIEW)
    let treemodels = pageConfig.models.filter((o) => o.modelType == modelTypeEnum.TREE)
    for (let index = 0; index < basicModels.length; index++) {
      const element = basicModels[index]
      if (!element) {
        continue
      }
      modelAnalysis.addCache(element.id, element)
    }
    for (let index = 0; index < viewmodels.length; index++) {
      const element = viewmodels[index]
      if (!element) {
        continue
      }
      modelAnalysis.addCache(element.id, element)
    }
    for (let index = 0; index < treemodels.length; index++) {
      const element = treemodels[index]
      if (!element) {
        continue
      }
      modelAnalysis.addCache(element.id, element)
    }
  }

  private addReffrenceModelId(modelId: string, isFirst: boolean) {
    if (this.resourceObj.modelIds.indexOf(modelId) > -1) {
      return
    }
    if (isFirst) {
      this.resourceObj.modelIds.unshift(modelId)
    } else {
      this.resourceObj.modelIds.push(modelId)
    }
  }
  private addReffrenceDictId(dictId: string) {
    if (this.resourceObj.dictIds.indexOf(dictId) > -1) {
      return
    }
    this.resourceObj.dictIds.push(dictId)
  }
  private addReffrenceFuncCode(funcCode: string) {
    if (this.resourceObj.funcCodes.indexOf(funcCode) > -1) {
      return
    }
    this.resourceObj.funcCodes.push(funcCode)
  }
  private addReffrenceModelMapperCode(code: string) {
    if (this.resourceObj.mapperCodes.indexOf(code) > -1) {
      return
    }
    this.resourceObj.mapperCodes.push(code)
  }

  private addReffrenceLocalStorageId(localStorageId: string) {
    this.resourceObj.localStorageIds.push(localStorageId)
  }

  private addReffrenceFileTemp(fileTempId: string) {
    this.resourceObj.fileTempIds.push(fileTempId)
  }

  private addReffrenceWorkflowId(workflowId: string) {
    this.resourceObj.workFlowIds.push(workflowId)
  }

  private cuteModelBindCache(modelBinds: modelBingding[]) {
    for (let index = 0; index < modelBinds.length; index++) {
      const modelB = modelBinds[index]
      if (modelB.modelBindingType == 2) {
        continue
      }
      this.cuteModelBindCache_R(modelB.modelDetailInfo)
    }
  }

  private cuteModelBindCache_R(modle: ModelInfo) {
    if (modle.modelType == modelTypeEnum.BASIC) {
      this.addReffrenceModelId(modle.id, true)
      for (let index = 0; index < modle.modelPropertyList.length; index++) {
        const property = modle.modelPropertyList[index]
        if (property.dictId) {
          this.addReffrenceDictId(property.dictId)
        }
      }
    } else if (modle.modelType == modelTypeEnum.VIEW) {
      this.addReffrenceModelId(modle.id, false)
      for (let rindex = 0; rindex < modle.modelRelationList.length; rindex++) {
        const relation = modle.modelRelationList[rindex]
        let modelInfo = modelAnalysis.getModelInfoById(relation.modelId)
        this.cuteModelBindCache_R(modelInfo.modelIndo)
      }
    } else if (modle.modelType == modelTypeEnum.TREE) {
      this.addReffrenceModelId(modle.id, false)
      for (let rindex = 0; rindex < modle.modelTreeMapperList.length; rindex++) {
        const relation = modle.modelTreeMapperList[rindex]
        let modelInfo = modelAnalysis.getModelInfoById(relation.modelId)
        this.cuteModelBindCache_R(modelInfo.modelIndo)
      }
    }
  }

  private findCacheFromBahaviors(behavs: behavior[]) {
    for (let index = 0; index < behavs.length; index++) {
      const behav = behavs[index]
      for (let index = 0; index < behav.actions.length; index++) {
        const act = behav.actions[index]
        this.getCacgeInfoFromAction(act)
      }
    }
  }

  private getCacgeInfoFromAction(act: action) {
    if (act.judgingCondition && act.judgingCondition.length > 0) {
      for (let index = 0; index < act.judgingCondition.length; index++) {
        const obj = act.judgingCondition[index]
        this.addReffenceFromObj(obj)
      }
    }

    for (let index = 0; index < act.actionDetails.length; index++) {
      const actDetail = act.actionDetails[index]
      if ((actDetail as actionDetail).isActionDetail) {
        this.getCacheInfoFromActDetail(actDetail as actionDetail)
      } else {
        this.getCacgeInfoFromAction(actDetail as action)
      }
    }
  }

  private getCacheInfoFromActDetail(actd: actionDetail) {
    for (let index = 0; index < actd.objs.length; index++) {
      const obj = actd.objs[index]
      this.addReffenceFromObj(obj)
    }
  }

  private addReffenceFromObj(obj: objectBase) {
    if (obj.resourceType == resourceType.customFunctions) {
      this.addReffrenceFuncCode(obj.name)
    } else if (obj.resourceType == resourceType.modelMapper) {
      this.addReffrenceModelMapperCode(obj.name)
    } else if (obj.resourceType == resourceType.systemDict) {
      this.addReffrenceDictId(obj.resourceId.split('&')[1])
    } else if (obj.resourceType == resourceType.localStorage) {
      this.addReffrenceLocalStorageId(obj.resourceId.split('&')[1])
    } else if (obj.resourceType == resourceType.fileTemplate) {
      this.addReffrenceFileTemp(obj.resourceId.split('&')[1])
    } else if (obj.resourceType == resourceType.workflows) {
      let workflowId = obj.resourceId.split('&')[0]
      this.addReffrenceWorkflowId(workflowId)
    } else if (obj.resourceType == resourceType.workflowsAsync) {
      let workflowId = obj.resourceId.split('&')[0]
      this.addReffrenceWorkflowId(workflowId)
    }
    if ((obj as any).inputParams) {
      for (let index = 0; index < (obj as any).inputParams.length; index++) {
        const element = (obj as any).inputParams[index]
        this.addReffenceFromObj(element.obj)
      }
    }
  }

  // *******************************overrides **************************************************************************************
  protected async TriggeEvent(name: string, inparam: any) {
    if (this.IsDesigning == true) {
      return
    }
    var event = this.DesignerEvents.find((o) => o.eventName == name)
    if (!event) {
      window.console.error('事件[' + name + ']调用失败,该事件不存在')
      return
    }

    //TODO 在事件设计的数据中找到事件,并调用事件
    for (let index = 0; index < event.behaviorIds.length; index++) {
      let bid = event.behaviorIds[index]
      let behavior = this.behaviors.find((o) => o.id == bid)
      if (behavior) {
        behavior.inparam = null
        if (inparam) {
          behavior.inparam = inparam
        }
        let actfa = new factory(this, this, behavior)
        try {
          await actfa.exacteAction()
        } catch (error) {
          break
        } finally {
          behavior = null
          actfa = null
        }
      }
    }
    return
  }
  // *******************************privates **************************************************************************************
  private ClosePage(isCallback: boolean) {
    if (this.popupInfo) {
      this.popupInfo.isCallback = isCallback
      ;(window as any).layer.close(this.popupInfo.popupId)
    }
  }

  /**清除模型实例的数据，id */
  private clearModelBindDatas() {
    for (let index = 0; index < this.modelBindings.length; index++) {
      const element = this.modelBindings[index]
      if (element.modelBindingName == '树数据源') {
        //window.console.log('清除数据')
      }
      if (element.modelBindingType == 2) {
        continue
      }

      if (!element.val || !element.val.data) {
        continue
      }

      element.val.data = {}
      continue

      if (isArray(element.val.data)) {
        element.val.data.filter((o) => {
          o.id = null
        })
      } else {
        element.val.data.id = null
      }
    }
  }

  private createIdForModelBind(val: any, targetModelBind: modelBingding) {
    if (!val) {
      return
    }
    /**聚合模型不生成Id */
    if (targetModelBind.modelDetailInfo.modelType == modelTypeEnum.VIEW) {
      return val
    }

    if (isArray(val)) {
      let needIdCount = 0
      for (let index = 0; index < val.length; index++) {
        const element = val[index]
        if (!element.id) {
          needIdCount++
        }
      }
      if (needIdCount == 0) {
        return val
      }

      let ids = CurrentApis.GetUniqueIds(needIdCount)

      for (let index = 0; index < val.length; index++) {
        const element = val[index]
        if (!element.id && this.isHaveOtherPrperties(val)) {
          element.id = ids[0]
        }
        ids.splice(0, 1)
      }
    } else if (isObject(val) && !val.id && this.isHaveOtherPrperties(val)) {
      val.id = CurrentApis.GetServerUUID()
    }

    return val
  }

  //判断object数据是否有其它字段
  private isHaveOtherPrperties(obj: any) {
    // window.console.log('哦哦哦去哦去哦')
    if (!obj) {
      return false
    }
    var propertiesnames = Object.getOwnPropertyNames(obj)
    if (propertiesnames.length > 1) {
      return true
    } else {
      return false
    }
  }
  private onWindowResize(e: Event): void {
    let parentdom = $(this.$el).parent()

    window.setTimeout(() => {
      // window.console.log('onWindowResize:', parentdom.width())
      this.adaptSize(parentdom.width(), parentdom.height())
    }, 500)
  }
  private onWindowResize_NotScale(e: Event): void {
    let parentdom = $(this.$el).parent()
    window.console.log('onWindowResize_NotScale:', parentdom, this.$el)
    window.setTimeout(() => {
      this.width = parentdom.width()
      this.height = parentdom.height()
      this.onScaleSized()
    }, 500)
  }

  /**
   * 子组件递归重绘，目前只用于表格
   * @param childrendatas
   */
  public resizeChange(childrendatas: any[]) {
    if (childrendatas.length == 0) {
      return
    }
    for (let index = 0; index < childrendatas.length; index++) {
      if (childrendatas[index].isNeedRecalculate) {
        childrendatas[index].onAfterResize()
      }
      this.resizeChange(childrendatas[index].children)
    }
  }

  public adaptSize(newwidth, newheight) {
    if (this.IsDesigning == true) {
      return
    }
    newwidth = parseInt(newwidth)
    newheight = parseInt(newheight)

    var designWidth = this.width
    var designHeight = this.height
    //如果已经自适应尺寸，就直接返回了
    if (newwidth === designWidth && designHeight === newheight) {
      this.scaleToSize(1)
    }

    var widthrate = newwidth / designWidth
    var heightrate = newheight / designHeight
    this.scaleToSize(widthrate)
  }
  private scaleToSize(size: number) {
    //return
    if (size < 0.01) {
      return
    }
    //千万不能用zoom缩放，不然缩放后的元素坐标，大小无法计算
    $(this.$el).css('transform', 'scale(' + size + ')')
    $(this.$el).css('-webkit-transform', 'scale(' + size + ')')
    $(this.$el).css('-moz-transform', 'scale(' + size + ')')
    $(this.$el).css('-ms-transform', 'scale(' + size + ')')
    $(this.$el).css('-o-transform', 'scale(' + size + ')')

    $(this.$el).css('transform-origin', '0% 0%')
    $(this.$el).css('-webkit-transform-origin', '0% 0%')
    $(this.$el).css('-moz-transform-origin', '0% 0%')
    $(this.$el).css('-ms-transform-origin', '0% 0%')
    $(this.$el).css('-o-transform-origin', '0% 0%')
    this.currentScaleSize = size
    this.onScaleSized()
  }
  // *******************************publics **************************************************************************************
  //添加一个不用自适应的参数，窗口缩放的时候大小不变
  public StartShow(notadaptSize?: boolean, targetWidth?: number, targetHeight?: number) {
    if (!notadaptSize) {
      this.onWindowResize_NotScale(window.event)
      $(window).bind('resize', this.onWindowResize_NotScale as any)
    }
  }

  public StartShowNew(notadaptSize?: boolean, targetWidth?: number, targetHeight?: number) {
    if (!notadaptSize) {
      this.onWindowResize(window.event)
      $(window).bind('resize', this.onWindowResize as any)
    }
  }

  public scaleSize(sizechange: number) {
    var newsize = this.currentScaleSize + sizechange
    if (newsize < 0.01) {
      return
    }
    //千万不能用zoom缩放，不然缩放后的元素坐标，大小无法计算
    this.scaleToSize(newsize)
  }

  public Save(): void {
    this.clearModelBindDatas()
    var saveinfo = this.GetSaveData()
    //页面配置
    this.recordResources(saveinfo)
    //页面权限
    let allpermissions = this.collectAllPermissions([this])
    CurrentApis.SavePagePermissions(this.Id, allpermissions)
    var saveinfoStr = this.GetPageZipStr(saveinfo)
    if (this.IsComponentTemplate) {
      CurrentApis.SaveComponentTemplateDetail(this.Id, saveinfoStr).then((res) => {
        this.isNeedSave = false
        this.onPageSaveSuccess(saveinfo.id)
      })
    } else {
      CurrentApis.SavePageData(this.Id, saveinfoStr, this.resourceObj).then((res) => {
        this.isNeedSave = false
        this.onPageSaveSuccess(saveinfo.id)
      })
    }
  }

  public GetPageZipStr(saveInfo: any) {
    var saveinfoStr = common.serialize(saveInfo)
    return common.strZip(saveinfoStr)
  }

  public async Load(pageId: string, params?: paramInfo[], justLoadData: boolean = false, justLoadPageData = false): Promise<SaveInfo> {
    // let s1 = common.getMillionSecond()
    this.Id = pageId
    var pageData = null
    //需要判断一下是组件模板还是页面，数据查询方式不一样
    if (this.IsComponentTemplate) {
      pageData = this.getCompTemplateData(pageId)
      await this.LoadPageByData(pageId, pageData, params, justLoadData, justLoadPageData)
    } else {
      let pageDatafromdb = (await pageCache.getPageData(pageId)) as pageContentTable
      this.checkoutInfo.checkoutStatus = pageDatafromdb.checkoutStatus
      this.checkoutInfo.checkoutUsername = pageDatafromdb.checkoutUsername
      pageData = pageDatafromdb.content
      await this.LoadPageByData(pageId, pageData, params, justLoadData, justLoadPageData, pageDatafromdb.configs)
    }

    //触发组件的重绘，目前只用于表格 xww 2020-09-05
    this.resizeChange(this.children)
    return pageData
  }
  public async LoadPageByData(pageId: string, pageData: SaveInfo, params?: paramInfo[], justLoadData: boolean = false, justLoadPageData = false, preLoadConfigs: PageResourceType = null) {
    this.Id = pageId
    if (!preLoadConfigs) {
      preLoadConfigs = {
        modelIds: [],
        funcCodes: [],
        dictIds: [],
        mapperCodes: [],
        localStorageIds: [],
        fileTempIds: [],
        workFlowIds: [],
        pageId: undefined
      }
    }
    if (isNumber(pageId)) {
      preLoadConfigs.pageId = pageId
    }

    let index = common.showLoading_Async(true)
    try {
      //////////////////////////////////////////////
      this._loadPermissions(pageId)
      //////////////////////////////////////////////
      if (pageData) {
        this._loadPageData(pageId, pageData, justLoadPageData, preLoadConfigs)
      } else {
        //页面内容为空，初始化数据
        this.initFirstData()
      }
      //**组织页面参数 */
      this.SetPageInParams(params)
      this.scaleSize(1 - this.currentScaleSize)
      if (justLoadData == false) {
        await this.$nextTick()
        if (this.pageReadyToDraw) {
          this.pageReadyToDraw()
          this.isReadyToDraw = true
        }
        if (this.TriggeEvent) {
          await this.TriggeEvent('加载完成', [])
        }
      }
      this.Id = pageId
    } catch (error) {
      window.console.error(error)
    } finally {
      common.closeLoading_Async(index, true)
    }
  }

  public async upDataPageCheckStatus() {
    await pageCache.upDataPageCheckStatus(this.Id, this.checkoutInfo.checkoutUsername, this.checkoutInfo.checkoutStatus)
  }

  public async reLoadPageData(pageData: SaveInfo) {
    // window.console.log('reLoadPageData')
    this.ReLoadData(pageData)
    await this.$nextTick()
    if (this.TriggeEvent) {
      await this.TriggeEvent('加载完成', [])
    }
  }

  private _loadPageData(pageId: string, pageData: SaveInfo, justLoadPageData = false, preLoadConfigs: PageResourceType = null) {
    this.preLoadModelBinds(preLoadConfigs)
    if (justLoadPageData) {
      this.LoadingProperties(pageData.id, pageData.properties)
      return
    } else {
      this.LoadData(pageData)
    }

    this.Id = pageId
    //数据兼容
    var newbehaviors: behavior[] = []
    for (let index = 0; index < this.behaviors.length; index++) {
      const o = this.behaviors[index]
      for (let index = 0; index < o.actions.length; index++) {
        const act = o.actions[index]
        this.jianrongBehavior(act.actionDetails)
      }
      newbehaviors.push(o)
    }
    this.behaviors = newbehaviors
  }

  private _loadPermissions(pageId: string) {
    var routes = this.$store.getters.addRouters[0]
    // if (!this.parentPage) {
    //   window.console.log('_loadPermissions1：', routes)
    // }
    let res = this.getPermissions(routes.children, pageId)
    // if (!this.parentPage) {
    //   window.console.log('_loadPermissions2:', res, this.$el)
    // }
    if (!res) {
      return
    }
    let pagePermissionList = []
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      let permission: any = {}
      permission.id = element.id
      permission.permissionCode = element.permissionCode
      permission.permissionName = element.permissionName
      pagePermissionList.push(permission)
    }
    this.permissions = pagePermissionList
  }

  private collectAllPermissions(layouts: LayoutBase[]): string[] {
    let res: string[] = []

    for (let index = 0; index < layouts.length; index++) {
      const element = layouts[index] as any
      if (element.authorityCode && res.indexOf(element.authorityCode) < 0) {
        res.push(element.authorityCode)
      }
      let childrenres = this.collectAllPermissions((element as LayoutBase).layoutChildren)
      //window.console.log('------------element as LayoutBase',element as LayoutBase)
      res = this.mergeArray(res, childrenres)
    }
    return res
  }

  private mergeArray(arr1: any[], arr2: any[]): any[] {
    var _arr = new Array()
    for (var i = 0; i < arr1.length; i++) {
      _arr.push(arr1[i])
    }
    for (var i = 0; i < arr2.length; i++) {
      var flag = true
      for (var j = 0; j < arr1.length; j++) {
        if (arr2[i] == arr1[j]) {
          flag = false
          break
        }
      }
      if (flag) {
        _arr.push(arr2[i])
      }
    }
    return _arr
  }

  public SetPageInParams(params?: paramInfo[]) {
    if (!params) {
      return
    }
    for (let index = 0; index < params.length; index++) {
      const param = params[index]
      var inparamInPage = this.inParams.find((o) => o.key == param.key)
      if (!inparamInPage) {
        continue
      }
      inparamInPage.paramVal = param.paramVal
    }
  }
  // ***************************************************************
  public addModelBinding(modelbind: modelBingding) {
    var property = this.FindProperties(PropertyGroupName.normal, '模型实例')[0]
    if (!property.value) {
      property.value = []
    }
    ;(modelbind.val as modelBingValue).modelCode = modelbind.modelBindingInfo.modelCode
    property.value.push(modelbind)
  }
  public removeModelBinding(modelbindName: string) {
    var property = this.FindProperties(PropertyGroupName.normal, '模型实例')[0]
    var index = property.value.findIndex((o) => o.modelBindingName == modelbindName)
    property.value.splice(index, 1)
  }
  public updateModelBind(modelbind: modelBingding) {
    let mb = this.modelBindings.find((o) => o.modelBindingName == modelbind.modelBindingName) as modelBingding
    if (!mb) {
      return
    }
    mb.modelBindingName = modelbind.modelBindingName
    mb.modelBindingType = modelbind.modelBindingType
    mb.modelBindingInfo = modelbind.modelBindingInfo
    mb.modelDataType = modelbind.modelDataType
    mb.modelFilters = modelbind.modelFilters
    mb.modelOrders = modelbind.modelOrders
    mb.modelFuncColumns = modelbind.modelFuncColumns
    this.setModelBindVal(modelbind.modelBindingName, modelbind.val)
    this.modelBindings = this.modelBindings
  }
  /**根据模型信息，创建模型实例 */
  public createModelBindingByModel(modelInfo: ModelInfo, modelDataType: modelDataTypeEnum = modelDataTypeEnum.single): modelBingding {
    var newmodelbind: modelBingding = new modelBingding()
    newmodelbind.modelDataType = modelDataType
    newmodelbind.modelBindingType = 1
    newmodelbind.modelBindingName = '自动生成的模型实例-' + modelInfo.modelName + '-' + common.getUuid()
    newmodelbind.modelBindingInfo = { name: modelInfo.modelName, modelCode: modelInfo.modelCode, modelId: modelInfo.id }
    newmodelbind.modelDetailInfo = modelInfo
    this.addModelBinding(newmodelbind)
    return newmodelbind
  }

  /**获取模型实例 */
  public getModelBindInfo(bindingInfo: bindingModelVal_InProperty): modelBingding {
    //根据模型绑定信息，获取页面中的模型实例
    if (this.modelBindings && bindingInfo) {
      var modelBind = this.modelBindings.find((o) => o.modelBindingName == bindingInfo.modelName)
      return modelBind
    } else {
      return null
    }
  }
  /**设置模型绑定的值，会同步到绑定的属性的值
   * sourcePropertyId:通过修改属性，触发模型实例更改的，会传出changePropertyId，防止循环操作
   */
  public setModelBindVal(modelbindName: string, val: any, sourcePropertyId?: string) {
    var findModelBind = this.modelBindings.find((o) => o.modelBindingName == modelbindName)
    if (!findModelBind) {
      // '模型实例不存在'
      return
    }

    this.setModelBindFactory(val, findModelBind)

    for (let index = 0; index < this.layoutChildren.length; index++) {
      const comp = this.layoutChildren[index] as ComponentBase
      if (comp && comp.setModelBindInfo) {
        comp.setModelBindInfo(modelbindName, findModelBind, sourcePropertyId)
      }
    }
  }

  public getPropertyInPageById(propertyId: string): Property {
    for (let compindex = 0; compindex < this.layoutChildren.length; compindex++) {
      let comp = this.layoutChildren[compindex]
      var property = comp.FindPropertyById(propertyId)
      if (property) {
        return property
      }
    }
    return null
  }

  public getCompMethodById(compId: string, methodName: string, comps?: ComponentBase[]): layoutMethod {
    if (!comps) {
      comps = this.layoutChildren as ComponentBase[]
    }
    for (let index = 0; index < comps.length; index++) {
      const comp = comps[index]
      if (comp.Id == compId) {
        return comp.DesignerMethods.find((o) => o.eventName == methodName)
      }
      if (comp.layoutChildren) {
        var findMethod = this.getCompMethodById(compId, methodName, comp.layoutChildren as ComponentBase[])
        if (findMethod) {
          return findMethod
        }
      }
    }
    return null
  }
  // ***********************模型实例赋值转换********************************** */
  private setModelBindFactory(sourceVal: any, targetModelBind: modelBingding) {
    if (targetModelBind.modelBindingType == 2) {
      targetModelBind.val = sourceVal
      return
    } else if (targetModelBind.modelDetailInfo.modelType == modelTypeEnum.TREE) {
      targetModelBind.val.data = sourceVal
      return
    }
    if (!sourceVal) {
      /** */
      targetModelBind.val.data = sourceVal
      return
    }

    if (sourceVal.filter && sourceVal.orders) {
      /** */
      //sourceVal是模型实例数据,进行赋值前，需要把orders等数据去除
      sourceVal.filter = undefined
      sourceVal.orders = undefined
    }

    if (sourceVal.modelCode && sourceVal.data) {
      sourceVal = sourceVal.data
    }

    if (sourceVal.totalPages || sourceVal.content) {
      sourceVal.content = this.createIdForModelBind(sourceVal.content, targetModelBind)
      //数据是分页数据
      targetModelBind.val.data = sourceVal
    } else {
      if (!Object.getOwnPropertyNames(sourceVal).find((o) => o != '__ob__')) {
        var xxxx = 1
      } else if (isArray(sourceVal) && targetModelBind.modelDataType == modelDataTypeEnum.single) {
        window.console.warn('模型实例赋值失败,不能将数组类型的值赋给单例模型实例,模型实例名称:' + targetModelBind.modelBindingName)
      } else if (isArray(sourceVal) == false && (targetModelBind.modelDataType == modelDataTypeEnum.list || targetModelBind.modelDataType == modelDataTypeEnum.tree)) {
        window.console.warn('模型实例赋值失败,不能将单例类型的值赋给数组或树模型实例,模型实例名称:' + targetModelBind.modelBindingName)
      }
      targetModelBind.val.data = this.createIdForModelBind(sourceVal, targetModelBind)
    }
  }
  // ***********************protecteds********************************** */
  public loadComponentsData(data: any) {}
  public getCompnentsData(): any {}
  // *******************************对外公布事件**************************************************************************************
  @Emit('onPageSaveSuccess')
  private onPageSaveSuccess(pageId: string): void {}

  @Emit('pageReadyToDraw')
  private pageReadyToDraw(): void {}

  @Emit('onScaleSized')
  private onScaleSized(): void {}
}
