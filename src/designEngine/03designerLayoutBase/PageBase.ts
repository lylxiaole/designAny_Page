import { Property, TimePickerFile_Property, Authority_Property, BindingModels_Property, UploadFile_Property, JavaScriptCode_Property, PageInParams_Property, Behavior_Property, PropertyGroupName, Number_Property, Boolean_Property } from './commonClasses/LayoutProperty'

import ComponentBase from './ComponentBase'
import common from '../02common/commonMethod'
import LayoutBase, { SaveInfo } from '../03designerLayoutBase/LayoutBase'
import LayoutContainer from '../03designerLayoutBase/LayoutContainner'
import paramInfo from './commonClasses/pageInParamInfo'
import { behavior, factory, action, actionDetail, resourceType, objectType, object_Method, object_callback, objectBase } from './behavior'
import { layoutEvent, layoutMethod, param, paramType } from './commonClasses/layoutEvent'

export default class PageBase extends LayoutContainer {
  public parentPage: PageBase
  public isNeedSave: boolean = false
  public isReadyToDraw: boolean = false
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
    var property = this.findProperties(PropertyGroupName.normal, '页面入参')[0]
    if (!property.value) {
      property.value = []
    }
    return property.value as paramInfo[]
  }

  created() {
    this.registerProperty('拓展js', PropertyGroupName.normal, new JavaScriptCode_Property(), false, false, false)
    this.registerProperty('页面入参', PropertyGroupName.normal, new PageInParams_Property())
    this.registerProperty('权限设置', PropertyGroupName.normal, new Authority_Property())
    this.registerProperty('模型实例', PropertyGroupName.normal, null, false, false)
    this.registerProperty('行为列表', PropertyGroupName.normal, new Behavior_Property(), false, false)
    this.registerProperty('定时器周期', PropertyGroupName.normal, new Number_Property(1, 999999999, 1), 10, true, true, '秒')

    this.registerEvents('加载完成', '页面加载完成时触发', [], null)
    this.registerMethods(
      '关闭页面-触发回调',
      '',
      () => {
        // this.ClosePage(true)
      },
      [],
      null
    )
    this.registerMethods(
      '关闭页面-不触发回调',
      '',
      () => {
        // this.ClosePage(false)
      },
      [],
      null
    )
    this.registerEvents('定时器触发事件', '定时器触发', [], null)
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
    }
  }

  beforeDestroy() {
    $(window).unbind('resize', this.onWindowResize as any)
  }
  // *******************************overrides **************************************************************************************
  protected async triggeEvent(name: string, inparam: any) {
    if (this.IsDesigning == true) {
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
  // *******************************privates **************************************************************************************

  private onWindowResize(e: Event): void {
    // let parentdom = $(this.$el).parent()
    // window.setTimeout(() => {
    //   // window.console.log('onWindowResize:', parentdom.width())
    //   this.adaptSize(parentdom.width(), parentdom.height())
    // }, 500)
  }
  private onWindowResize_NotScale(e: Event): void {
    // let parentdom = $(this.$el).parent()
    // window.console.log('onWindowResize_NotScale:', parentdom, this.$el)
    // window.setTimeout(() => {
    //   this.width = parentdom.width()
    //   this.height = parentdom.height()
    //   this.onScaleSized()
    // }, 500)
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
    // $(this.$el).css('transform', 'scale(' + size + ')')
    // $(this.$el).css('-webkit-transform', 'scale(' + size + ')')
    // $(this.$el).css('-moz-transform', 'scale(' + size + ')')
    // $(this.$el).css('-ms-transform', 'scale(' + size + ')')
    // $(this.$el).css('-o-transform', 'scale(' + size + ')')

    // $(this.$el).css('transform-origin', '0% 0%')
    // $(this.$el).css('-webkit-transform-origin', '0% 0%')
    // $(this.$el).css('-moz-transform-origin', '0% 0%')
    // $(this.$el).css('-ms-transform-origin', '0% 0%')
    // $(this.$el).css('-o-transform-origin', '0% 0%')
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
    var saveinfo = this.GetSaveData()
    var saveinfoStr = this.GetPageZipStr(saveinfo)

    // CurrentApis.SavePageData(this.Id, saveinfoStr, null).then((res) => {
    //   this.isNeedSave = false
    //   this.onPageSaveSuccess(saveinfo.id)
    // })
  }

  public GetPageZipStr(saveInfo: any) {
    var saveinfoStr = common.serialize(saveInfo)
    return common.strZip(saveinfoStr)
  }

  public async loadPageById(pageId: string, params?: paramInfo[], justLoadData: boolean = false, justLoadPageData = false): Promise<SaveInfo> {
    // let s1 = common.getMillionSecond()
    this.Id = pageId
    var pageData = null
    //需要判断一下是组件模板还是页面，数据查询方式不一样
    let pageDatafromdb = {} as any
    pageData = pageDatafromdb.content
    await this.LoadPageByData(pageId, pageData, params)
    //触发组件的重绘，目前只用于表格 xww 2020-09-05
    this.resizeChange(this.children)
    return pageData
  }
  public async LoadPageByData(pageId: string, pageData: SaveInfo, params?: paramInfo[]) {
    this.Id = pageId

    let index = common.showLoading_Async(true)
    try {
      //////////////////////////////////////////////
      if (pageData) {
        this.LoadData(pageData)
      }
      //**组织页面参数 */
      this.SetPageInParams(params)
      this.scaleSize(1 - this.currentScaleSize)

      if (this.triggeEvent) {
        await this.triggeEvent('加载完成', [])
      }
      this.Id = pageId
    } catch (error) {
      window.console.error(error)
    } finally {
      common.closeLoading_Async(index, true)
    }
  }
  public async ReLoadPageData(pageData: SaveInfo) {
    // window.console.log('reLoadPageData')
    this.ReLoadData(pageData)
    if (this.triggeEvent) {
      await this.triggeEvent('加载完成', [])
    }
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
  public getPropertyInPageById(propertyId: string): Property {
    for (let compindex = 0; compindex < this.children.length; compindex++) {
      let comp = this.children[compindex]
      var property = comp.FindPropertyById(propertyId)
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
  // ***********************protecteds********************************** */
  public loadComponentsData(data: any) {}
  public getCompnentsData(): any {}
  // *******************************对外公布事件**************************************************************************************
  private onPageSaveSuccess(pageId: string): void {}
  private onScaleSized(): void {}
}
