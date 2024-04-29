import { Property, Authority_Setting, JavaScriptCode_Setting, PageInParams_Setting, Behavior_Setting, PropertyGroupName, Number_Setting, Boolean_Setting } from './commonClasses/LayoutProperty'
import ComponentBase from './EngineComponent'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone, serialize, strZip, strUnZip, deserialize, closeLoading_Async, showLoading_Async } from '@common/utils'
import EngineLayout, { SaveInfo } from './EngineLayout'
import EngineContainer from './EngineContainer'
import { paramInfo } from './commonClasses/pageInParamInfo'
import { factory, resourceCode, objectType, object_Method, object_callback, objectBase } from '@behaviorEngine/index'
import { layoutEvent, layoutMethod } from './commonClasses/layoutEvent'
import { action, actionDetail, behavior, paramType, param } from '@behaviorEngine/index'

// import { GetPageDetail, SavePageDetail } from 'z_Designer/apis/designPage'
import { pageType, DesignPageDC, GetPageDetail, SavePageDetail } from '@common/apis/designPage'
import { BaseClass } from '@common/apis/apiDesignManager'

@Options({})
export default class EnginePage extends EngineContainer {
  /***************************** */
  /**行为列表*/
  public get behaviors(): behavior[] {
    var property = this.findPropertyByName(PropertyGroupName.normal, '行为列表')
    if (!property.value) {
      property.value = []
    }
    return property.value as behavior[]
  }
  public set behaviors(val: behavior[]) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '行为列表')
    if (!property.value) {
      property.value = []
      return
    }
    property.value = val
  }
  /**页面定时器 */
  public get tickTime(): number {
    var property = this.findPropertyByName(PropertyGroupName.normal, '定时器周期')
    if (!property || !property.value) {
      return 0
    }
    return property.value
  }
  public set tickTime(val: number) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '定时器周期')
    if (!property) {
      return
    }
    this.setPropertyVal(property.id, val)
  }
  /**页面入参 */
  public get inParams(): paramInfo[] {
    var property = this.findProperties(PropertyGroupName.normal, '行为列表')[0]
    if (!property.value) {
      property.value = []
    }
    return property.value as paramInfo[]
  }
  created() {
    this.registerProperty(PropertyGroupName.normal, '拓展js', new JavaScriptCode_Setting(), false, false)
    this.registerProperty(PropertyGroupName.normal, '页面入参', new PageInParams_Setting())
    this.registerProperty(PropertyGroupName.normal, '权限设置', new Authority_Setting())
    this.registerProperty(PropertyGroupName.normal, '模型实例', null, false, false)
    this.registerProperty(PropertyGroupName.normal, '行为列表', null, false, false)
    this.registerProperty(PropertyGroupName.normal, '定时器周期', new Number_Setting(1, 999999999, 1), 10, true, '秒')

    this.registerEvents('加载完成', '', [], null)
    this.registerEvents('定时器触发事件', '', [], null)

    this.registerMethods('关闭页面-触发回调', '', [], null)
    this.registerMethods('关闭页面-不触发回调', '', [], null)
  }

  mounted() {
    // window.setInterval(() => {
    //   console.log('页面定时器测试.................')
    // }, 1000)
  }
  unmounted() {
    $(window).unbind('resize', this.onWindowResize_Scale as any)
    $(window).unbind('resize', this.onWindowResize_NotScale as any)
  }
  // *******************************页面行为**************************************************************************************
  protected override async triggerEvent(name: string, inparam: any) {
    super.triggerEvent(name, inparam)
    if (this.isDesigning) {
      return
    }

    var event = this.designerEvents.find((o) => o.eventName == name)
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
  public async reLoadPageData(pageData: SaveInfo) {
    this.reLoadData(pageData)
    if (this.triggerEvent) {
      await this.triggerEvent('加载完成', [])
    }
  }
  public setPageInParams(params?: paramInfo[]) {
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
  public getPropertyInPageById(propertyId: string): Property {
    for (let compindex = 0; compindex < this.children.length; compindex++) {
      let comp = this.children[compindex]
      var property = comp.findPropertyById(propertyId)
      if (property) {
        return property
      }
    }
    return null
  }
  public getCompMethodById(compId: string, methodName: string, comps?: ComponentBase[]): layoutMethod {
    if (!comps) {
      comps = this.children as ComponentBase[]
    }
    for (let index = 0; index < comps.length; index++) {
      const comp = comps[index]
      if (comp.Id == compId) {
        return comp.designerMethods.find((o) => o.eventName == methodName)
      }
      if (comp.children) {
        var findMethod = this.getCompMethodById(compId, methodName, comp.children as ComponentBase[])
        if (findMethod) {
          return findMethod
        }
      }
    }
    return null
  }
  // *******************************页面缩放 **************************************************************************************
  //让页面按照指定尺寸进行缩放
  public adaptSize(newwidth, newheight) {
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
  //让页面按照指定比例进行缩放
  public scaleSize(sizechange: number) {
    var newsize = this.currentScaleSize + sizechange
    if (newsize < 0.01) {
      return
    }
    //千万不能用zoom缩放，不然缩放后的元素坐标，大小无法计算
    this.scaleToSize(newsize)
  }
  private onWindowResize_Scale(e: Event): void {
    let parentdom = $(this.$el).parent()
    window.setTimeout(() => {
      this.adaptSize(parentdom.width(), parentdom.height())
    }, 500)
  }
  private onWindowResize_NotScale(e: Event): void {
    let parentdom = $(this.$el).parent()
    window.setTimeout(() => {
      this.width = parentdom.width()
      this.height = parentdom.height()
      this.onScaleSized()
    }, 500)
  }
  private scaleToSize(size: number) {
    //return
    if (size < 0.01) {
      return
    }
    // 千万不能用zoom缩放，不然缩放后的元素坐标，大小无法计算
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
  // 窗口变化是，不使用缩放
  private watchWindowSize_NotScale() {
    this.onWindowResize_NotScale(window.event)
    $(window).bind('resize', this.onWindowResize_NotScale as any)
  }
  // 窗口变化是，使用缩放
  private watchWindowSize_Scale() {
    this.onWindowResize_Scale(window.event)
    $(window).bind('resize', this.onWindowResize_Scale as any)
  }
  // *******************************页面数据保存和加载 **************************************************************************************
  public async save(appId: string) {
    /**数据压缩 */
    var saveinfo = await this.getSaveData()
    window.console.log('save:', saveinfo)
    var saveinfoStr = serialize(saveinfo)
    saveinfoStr = strZip(saveinfoStr)
    try {
      await SavePageDetail({ appId: appId, id: this.Id, designDetail: saveinfoStr } as any)
      this.recursiveChangeNeedSave(this)
      this.onPageSaveSuccess(saveinfo.id)
    } catch (error) {
      alert('保存页面错误:' + (error as any).message)
    }
  }
  private async recursiveChangeNeedSave(layout: EngineLayout) {
    layout.isNeedSave = false

    for (let index = 0; index < layout.children.length; index++) {
      const element = layout.children[index]
      element.isNeedSave = false
      this.recursiveChangeNeedSave(element)
    }
  }

  public async loadPageById(pageId: string, params?: paramInfo[]): Promise<void> {
    let pageDC: DesignPageDC = await GetPageDetail(pageId)
    await this.loadPageByData(pageId, pageDC.designDetail, params)
  }
  public async loadPageByData(pageId: string, pageDataStr: string, params?: paramInfo[]) {
    let pageData: SaveInfo = null
    if (pageDataStr) {
      pageData = strUnZip(pageDataStr)
      pageData = deserialize(pageData)
    }

    let index = showLoading_Async(true)
    try {
      this.Id = pageId
      if (pageData) {
        await this.loadData(pageData)
      }
      //**组织页面参数 */
      this.setPageInParams(params)
      this.scaleSize(1 - this.currentScaleSize)
      await this.$nextTick()
      await this.triggerEvent('加载完成', [])
    } catch (error) {
      window.console.error(error)
    } finally {
      closeLoading_Async(index, true)
    }
  }

  // *********************************************************************************************************************
  private onPageSaveSuccess(pageId: string): void {}
  private onScaleSized(): void {}
}
