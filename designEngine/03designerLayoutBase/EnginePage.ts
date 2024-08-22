import { Property, PageInParams_Setting, PropertyGroupName, Number_Setting, Enum_Setting } from './commonClasses/PropertyInfo'
import ComponentBase from './EngineComponent'
import { Options, Vue } from 'vue-class-component'
import { getUuid, deepClone, serialize, strZip, strUnZip, deserialize, closeLoading_Async, showLoading_Async } from '@common/utils'
import EngineLayout, { SaveInfo } from './EngineLayout'
import EngineContainer from './EngineContainer'
import { factory } from '@behaviorEngine/index'
import { LayoutMethod } from './commonClasses/MethodInfo'
import { DEventAttr } from './commonClasses/EventInfo'
import { action, actionDetail, behavior, paramType, param } from '@behaviorEngine/index'
import { pageType, DesignPageDC, GetPageDetail, SavePageDetail } from '@common/apis/designPage'
import { DPropAttr } from './commonClasses/PropertyInfo'
import { PropertySetting, Text_Setting, Behavior_Setting } from './commonClasses/PropertyInfo'
import { Component, Emit, Watch, Prop, Ref } from 'vue-property-decorator'

@Options({})
export default class EnginePage extends EngineContainer {
  /***************************** */
  @DPropAttr(new Behavior_Setting('行为列表', PropertyGroupName.normal, false))
  public behaviors: behavior[] = []

  @DPropAttr(new Number_Setting('定时器周期', PropertyGroupName.normal, true, '秒', 1, 999999999, 1))
  public tickTime: number = 0

  @DPropAttr(new PageInParams_Setting('页面入参', PropertyGroupName.normal, true))
  public inParams: param[] = []

  @DPropAttr(new Enum_Setting('字体样式', PropertyGroupName.normal, true, null, true, ['微软雅黑', 'times new roman', '宋体', '楷体', '黑体', '隶书']))
  public fontFamily: string = '微软雅黑'

  mounted() {}
  unmounted() {
    $(window).unbind('resize', this.onWindowResize_Scale as any)
    $(window).unbind('resize', this.onWindowResize_NotScale as any)
  }
  // *******************************页面行为******************************************

  public async reLoadPageData(pageData: SaveInfo) {
    this.reLoadData(pageData)
  }
  public setPageInParams(params?: param[]) {
    if (!params) {
      return
    }
    for (let index = 0; index < params.length; index++) {
      const param = params[index]
      var inparamInPage = this.inParams.find((o) => o.key == param.key)
      if (!inparamInPage) {
        continue
      }
      inparamInPage.val = param.val
    }
  }
  public getPropertyInPageById(propertyId: string): PropertySetting {
    for (let compindex = 0; compindex < this.children.length; compindex++) {
      let comp = this.children[compindex]
      var property = comp.findPropertyById(propertyId)
      if (property) {
        return property
      }
    }
    return null
  }
  public getCompMethodById(compId: string, methodName: string, comps?: ComponentBase[]): LayoutMethod {
    if (!comps) {
      comps = this.children as ComponentBase[]
    }
    for (let index = 0; index < comps.length; index++) {
      const comp = comps[index]
      if (comp.Id == compId) {
        return comp.designerMethods.find((o) => o.methodName == methodName)
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
  // *******************************页面缩放 *******************************************
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
  public async loadPageById(pageId: string, params?: param[]): Promise<void> {
    let pageDC: DesignPageDC = await GetPageDetail(pageId)

    await this.loadPageByData(pageId, pageDC.designDetail, params)
  }
  public async loadPageByData(pageId: string, pageDataStr: string, params?: param[]) {
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

      await this.onLoadComplete()
    } catch (error) {
      window.console.error(error)
    } finally {
      closeLoading_Async(index, true)
    }
  }
  // ***************************************************************
  @DEventAttr({ eventName: '加载完成', description: '', inParams: [], hasOutParam: false })
  private onLoadComplete() {}
  // ******************************************************
  private onPageSaveSuccess(pageId: string): void {}
  private onScaleSized(): void {}

  @Emit('onLYLLeadToOtherPage')
  public onLYLLeadToOtherPage(pageId: string): void {}
}
