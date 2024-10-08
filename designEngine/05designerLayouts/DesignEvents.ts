import dragHelper from '@designEngine/02common/dragHelper'
import { Options, Vue } from 'vue-class-component'
import { EnginePage, EngineContainer, EngineLayout, SaveInfo } from '@design-any/interface/dist/LayoutInterface'

import { findSystemCompByCode } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { getUuid, deepClone, serialize } from '@common/utils'

/**拖拽行为类型 */
export enum DragItemTypeEnum {
  drop_system_component = 'drop_system_component',
  dragmove_component_inpage = 'dragmove_component_inpage',
  drag_component_size = 'drag_component_size',
  drag_gridLayout_col = 'drag_gridLayout_col',
  /**拖拽组件模板 */
  drop_component_template = 'drop_component_template',
  functional_component = 'functional_component',
  /**拖拽模型组件 */
  drop_model_component = 'drop_modal_component',
  /**在拖拽表单内的组件 */
  drag_compInForm = 'drag_compInForm'
}
export class DragItemData<T> {
  type: DragItemTypeEnum
  dragData: T
}

class optionsClass {
  public isCaptureEvent: boolean = false

  public isMouseDown: boolean = false
  public boxSelectBorder: any = null
  public mousedownPointX: number = null
  public mousedownPointY: number = null
  public clickTimer: number = null
}

export default class DesignEvents {
  protected _dragHelper: dragHelper
  protected eventsOptions: optionsClass
  private _vueComp: EngineContainer
  public static isDraging: boolean = false

  private currentScaleSize: number = 1

  public setCurrentScaleSize(sizechange: number) {
    var newsize = this.currentScaleSize + sizechange
    if (newsize < 0.01) {
      return
    }

    this._dragHelper.currentScaleSize = newsize
    this.currentScaleSize = newsize
  }
  public static copyComp: EngineLayout
  public static isCut: boolean = false

  //是否正在设计
  set canDrop(can: boolean) {
    if (!this._dragHelper) {
      return
    }
    if (can) {
      // window.console.log('makeContainerCanDrop')
      this._dragHelper.makeContainerCanDrop()
    } else {
      this._dragHelper.makeContainerCannotDrop()
    }
  }
  get canDrop(): boolean {
    if (!this._dragHelper) {
      return false
    }

    return this._dragHelper.IsCanDrop()
  }
  set canDrag(can: boolean) {
    if (!this._dragHelper) {
      return
    }
    if (can) {
      // window.console.log('makeDomCanDrag')
      this._dragHelper.makeDomCanDrag(this._vueComp.$el)
    } else {
      this._dragHelper.makeDomCannotDrag(this._vueComp.$el)
    }
  }
  get canDrag(): boolean {
    if (!this._dragHelper) {
      return false
    }
    return this._dragHelper.IsCanDrag(this._vueComp.$el)
  }

  constructor(vueComp: EnginePage) {
    this._vueComp = vueComp
    this.eventsOptions = new optionsClass()
    this._dragHelper = new dragHelper(vueComp.$el)
    //
    if (this.canDrop) {
      this._dragHelper.makeContainerCanDrop()
    } else {
      this._dragHelper.makeContainerCannotDrop()
    }
    //
    if (this.canDrag) {
      this._dragHelper.makeDomCanDrag(this._vueComp.$el)
    } else {
      this._dragHelper.makeDomCannotDrag(this._vueComp.$el)
    }
    //
    this.captureEvent()
  }

  /**开始捕捉鼠标键盘 */
  protected captureEvent() {
    if (this.eventsOptions.isCaptureEvent == true) {
      return
    }
    this.eventsOptions.isCaptureEvent = true
    // window.console.log('捕捉鼠标键盘动作')
    this._vueComp.$el.addEventListener('click', this.pri_onClick)
    this._vueComp.$el.addEventListener('dblclick', this.pri_onDoubleClick)
    this._vueComp.$el.addEventListener('keyup', this.pri_onKeyUp)
    this._vueComp.$el.addEventListener('keydown', this.pri_onKeyDown)
    this._vueComp.$el.addEventListener('mousemove', this.pri_mouseMove)
    this._vueComp.$el.addEventListener('mouseup', this.pri_mouseUp)
    this._vueComp.$el.addEventListener('mousedown', this.pri_mouseDown)
    // $('html').bind('mousewheel', this.pri_onMouseWheel)
    $(this._vueComp.$el)[0].addEventListener('mousewheel', this.pri_onMouseWheel, { passive: false })
    $(window).bind('onbeforeunload', this.pri_onWindowUnload)
    this._dragHelper.makeDomContainer()
    this._dragHelper.registerOnDrag(this.pri_onDrag)
    this._dragHelper.registerOnDrop(this.pri_onDrop)
    this._dragHelper.registerOnDragMove(this.pri_onDragMove)
    this._dragHelper.registerOnDragEnd(this.pri_onDragEnd)
    this._dragHelper.registerOnDragOut(this.pri_onDragOut)
  }
  /**停止捕捉鼠标键盘 */
  protected realseEvent() {
    if (this.eventsOptions.isCaptureEvent == false) {
      return
    }
    // window.console.log('释放鼠标键盘动作')
    this.eventsOptions.isCaptureEvent = false
    if (this._vueComp.$el) {
      this._vueComp.$el.removeEventListener('click', this.pri_onClick)
      this._vueComp.$el.removeEventListener('dblclick', this.pri_onDoubleClick)
      this._vueComp.$el.removeEventListener('keyup', this.pri_onKeyUp)
      this._vueComp.$el.removeEventListener('keydown', this.pri_onKeyDown)
      this._vueComp.$el.removeEventListener('mousemove', this.pri_mouseMove)
      this._vueComp.$el.removeEventListener('mouseup', this.pri_mouseUp)
      this._vueComp.$el.removeEventListener('mousedown', this.pri_mouseDown)
      // $('html').unbind('mousewheel', this.pri_onMouseWheel)
      $(this._vueComp.$el)[0].removeEventListener('mousewheel', this.pri_onMouseWheel)
      $(window).unbind('beforeunload unload', this.pri_onWindowUnload)
      this._dragHelper.removeContainer()
    }
  }

  /********************Drag事件****************************************************** */
  private pri_onDrag = (el: Element, sourceContainer: Element) => {
    if (sourceContainer != this._vueComp.$el) {
      return
    }
    this.clearBoxSelectInfo(window.event)
    DesignEvents.isDraging = true
    //只有继承自BaseEvent的组件才能感知此事件
    // window.console.log('从本布局中开始拖拽一个东西出去了');
    var currentDragData = this._dragHelper.getDragItemInfo(el) as DragItemData<any>

    this.onDrag_Event(el, currentDragData)
    this._dragHelper.makeDragItemInfo(el, currentDragData)
    return true
  }
  private pri_onDrop = async (el: Element, targetContainer: Element, x: number, y: number): Promise<boolean> => {
    // window.console.log('pri_onDrop:', this)
    if (!this.canDrop || !this.onDrop_Event) {
      return true
    }

    // window.console.log('drop')
    var dragdata = this._dragHelper.getDragItemInfo(el) as DragItemData<any>
    return await this.onDrop_Event(el, targetContainer, x, y, dragdata)

    // this._dragHelper.dragCancel()
    // return true
  }
  private pri_onDragMove = (el: Element, targetContainer: Element, xchanged, ychanged, currentDragLeft, currentDragTop): boolean => {
    if (this.canDrop == false || !this.onDragMove_Event) {
      return true
    }
    if (!el) {
      return true
    }
    var dragdata = this._dragHelper.getDragItemInfo(el) as DragItemData<any>
    let iscontinue = this.onDragMove_Event(xchanged, ychanged, currentDragLeft, currentDragTop, el, dragdata)

    return iscontinue
  }
  private pri_onDragEnd = (el: Element) => {
    if (!this.onDragEnd_Event) {
      return
    }
    DesignEvents.isDraging = false
    this.onDragEnd_Event()
  }
  private pri_onDragOut = (el: Element, targetContainer: Element): boolean => {
    if (!this.onDragOut_Event) {
      return true
    }
    if (targetContainer != this._vueComp.$el) {
      return true
    }

    var res = this.onDragOut_Event(el, targetContainer)
    // if (res == false) {
    //   window.console.log('拖拽超出了范围', targetContainer)
    //   this._dragHelper.dragEnd()
    // }
  }
  /************************************************************************** */
  private pri_onClick = (e: Event) => {
    //window.console.log('最底层,pri_onClick')
    if (!this.onClick_Event) {
      return
    }
    e.stopPropagation()
    if (!this.eventsOptions.clickTimer) {
      return
    }
    window.clearTimeout(this.eventsOptions.clickTimer)
    this.eventsOptions.clickTimer = null
    //window.console.log('最底层,pri_onClick')
    this.onClick_Event(e, this)
  }
  private pri_onDoubleClick = (e: Event) => {
    if (!this.onDoubleClick_Event) {
      return
    }
    // e.stopPropagation()
    // window.console.log('点击')
    this.onDoubleClick_Event(e, this)
  }
  private pri_onKeyUp = (e: any) => {
    var keyCode = e.keyCode || e.which || e.charCode
    if (keyCode == 46 && this.onDelete_Event) {
      //删除
      e.preventDefault()
      this.onDelete_Event(e)
    }
  }
  private pri_onKeyDown = (e: any) => {
    var keyCode = e.keyCode || e.which || e.charCode
    var ctrlKey = e.ctrlKey || e.metaKey

    // window.console.log('pri_onKeyDown:', e.target)
    if (this.onKeyDown_Event) {
      this.onKeyDown_Event(e)
    }

    if (keyCode == 37 && ctrlKey == false && this.onPositionLeft_Event) {
      //左键
      // e.preventDefault()
      this.onPositionLeft_Event(e)
    } else if (keyCode == 38 && ctrlKey == false && this.onPositionTop_Event) {
      //上键
      // e.preventDefault()
      this.onPositionTop_Event(e)
    } else if (keyCode == 39 && ctrlKey == false && this.onPositionRight_Event) {
      //右键
      //  e.preventDefault()
      this.onPositionRight_Event(e)
    } else if (keyCode == 40 && ctrlKey == false && this.onPositionBotton_Event) {
      //下键
      //  e.preventDefault()
      this.onPositionBotton_Event(e)
    } else if (keyCode == 37 && ctrlKey == true && this.onWidthSmall_Event) {
      //ctrl+左键
      //  e.preventDefault()
      this.onWidthSmall_Event(e)
    } else if (keyCode == 38 && ctrlKey == true && this.onHeightSmall_Event) {
      //ctrl+上键
      // e.preventDefault()
      this.onHeightSmall_Event(e)
    } else if (keyCode == 39 && ctrlKey == true && this.onWidthBig_Event) {
      //ctrl+右键
      //  e.preventDefault()
      this.onWidthBig_Event(e)
    } else if (keyCode == 40 && ctrlKey == true && this.onHeightBig_Event) {
      //ctrl+下键
      //  e.preventDefault()
      this.onHeightBig_Event(e)
    } else if (keyCode == 48 && ctrlKey == true && this.onRestoreScale_Event) {
      //ctrl+0
      // e.preventDefault()
      this.onRestoreScale_Event(e)
    } else if (keyCode == 83 && ctrlKey == true && this.onSave_Event) {
      //ctrl+s
      //  e.preventDefault()
      this.onSave_Event(e)
    } else if (keyCode == 67 && ctrlKey == true && this.onCopy_Event) {
      //ctrl+c
      // e.preventDefault()
      this.onCopy_Event(e)
    } else if (keyCode == 88 && ctrlKey == true && this.onCut_Event) {
      //ctrl+x
      // e.preventDefault()
      this.onCut_Event(e)
    } else if (keyCode == 86 && ctrlKey == true && this.onPaste_Event) {
      //ctrl+v
      //  e.preventDefault()
      this.onPaste_Event(e)
    }
  }
  private pri_onMouseWheel = (e: any) => {
    var ctrlKey = e.ctrlKey || e.metaKey
    if (ctrlKey == true && this.onChangedScale_Event) {
      e.preventDefault()
      var wheelvalue = e.wheelDelta || -e.detail
      var scalesize = wheelvalue / 1000
      if (this.onChangedScale_Event(scalesize) == false) {
        e.stopPropagation()
      }
    } else if (this.onMouseWheelInLayout_Event) {
      //仅仅滚轮
      this.onMouseWheelInLayout_Event(e)
    }
  }
  private pri_mouseMove = (e: any) => {
    if (!this.onMouseMove_Event) {
      return true
    }
    if (DesignEvents.isDraging == true) {
      return
    }
    this.onMouseMove_Event(e)
    if (e.which === 1 && DesignEvents.isDraging == false && this.eventsOptions.isMouseDown == true) {
      //鼠标左键是按下状态
      // this.onSelectChanged.call(this, data)
      if (this.eventsOptions.boxSelectBorder == null && this.onBoxSelect_Event) {
        this.eventsOptions.boxSelectBorder = $('<div class="boxSelectBorder" style="border:1px solid red;position:absolute;background-color:transparent;z-index:199"></div>')
        this.eventsOptions.boxSelectBorder.bind('mousemove', this.pri_mouseMove)
        this.eventsOptions.boxSelectBorder.bind('mouseup', this.pri_mouseUp)
        $('body').append(this.eventsOptions.boxSelectBorder)
      }
      if (this.onBoxSelect_Event) {
        this.onBoxSelect_Event(e)
        // e.stopPropagation()
      }
      return
    } else if (e.which === 3 || e.which === 1) {
      //which 0: 无,1: 左键,2: 中间滚轮（如果有的话）,3: 右键
      if (e.which == 1 && this.onMouseDragMove_Event) {
        // window.console.log('**********开始左键拖拽:' )
        this.onMouseDragMove_Event(e, e.movementX, e.movementY)
      } else if (e.which == 3 && this.onDragSelf_Event) {
        this.onDragSelf_Event(e.movementX, e.movementY)
      }
      // this.startMouseDragPoint_left = currentDragLeft
      // this.startMouseDragPoint_top = currentDragTop
    }
  }
  private pri_mouseUp = (e: any) => {
    if (!this.onMoudeUp_Event) {
      return true
    }
    // window.console.log('最底层,mouseUp')
    /***************** */
    this.clearBoxSelectInfo(e)
    /********************** */
    this.eventsOptions.isMouseDown = false
    this.onMoudeUp_Event(e)
  }
  private clearBoxSelectInfo(e: any) {
    $('.boxSelectBorder').unbind('mousemove', this.pri_mouseMove)
    $('.boxSelectBorder').unbind('mouseup', this.pri_mouseUp)
    $('.boxSelectBorder').remove()
    if (this.eventsOptions.boxSelectBorder) {
      this.eventsOptions.boxSelectBorder = null
      this.eventsOptions.mousedownPointX = null
      this.eventsOptions.mousedownPointY = null
      e.stopPropagation()
    }
  }
  private pri_mouseDown = (e: any) => {
    this.eventsOptions.clickTimer = window.setTimeout(() => {
      window.clearTimeout(this.eventsOptions.clickTimer)
      this.eventsOptions.clickTimer = null
    }, 300)

    if (!this.onMoudeDown_Event) {
      return
    }

    this.eventsOptions.mousedownPointX = e.clientX
    this.eventsOptions.mousedownPointY = e.clientY
    this.eventsOptions.isMouseDown = true
    this.onMoudeDown_Event(e)
  }
  private pri_onWindowUnload = (e: any) => {
    if (this.onWindowUnload_Event) {
      this.onWindowUnload_Event(e)
    }
  }
  /**********************对外公布的事件 **********************************/
  onKeyDown_Event: (e: Event) => void
  onCut_Event(e: Event) {
    if (this._vueComp.selectedChildren && this._vueComp.selectedChildren.length > 0) {
      DesignEvents.copyComp = this._vueComp.selectedChildren[0] as EngineLayout
      // this.$message.success('组件已剪切', 2)
      DesignEvents.isCut = true
      e.stopPropagation()
    }
  }
  onCopy_Event(e: Event) {
    if (this._vueComp.selectedChildren && this._vueComp.selectedChildren.length > 0) {
      DesignEvents.copyComp = this._vueComp.selectedChildren[0] as EngineLayout
      // this.$message.success('组件已复制', 2)
      DesignEvents.isCut = false
      e.stopPropagation()
    }
  }
  async onPaste_Event(e: Event) {
    if (!DesignEvents.copyComp) {
      return
    }
    // window.console.log('onPaste_Event')
    let compData = deepClone(await DesignEvents.copyComp.getSaveData())

    if (DesignEvents.isCut) {
      //剪切--删除原有组件
      let parentLayout = DesignEvents.copyComp.parentLayout as EngineContainer
      parentLayout.removeChildRecursion(DesignEvents.copyComp.Id)
    } else {
      //复制操作需要给组件新Id
      compData.id = getUuid()
    }
    let compclass = findSystemCompByCode(compData.meta.compCode)
    //如果选中了一些容器类的子组件,就把当前组件复制到其中
    let findchildren = this._vueComp.findSelectedLayoutsRecursion(this._vueComp.children)
    let newcopyComp: EngineLayout = null
    for (let index = 0; index < findchildren.length; index++) {
      const element = findchildren[index]
      if ((element as any).insertComponentLayout) {
        newcopyComp = await (element as EngineContainer).insertComponentLayout(compclass, compData.meta, null, compData)
        break
      }
    }
    // 如果没选中容器类的子组件, 就把当前组件复制到当前页面
    if (!newcopyComp) {
      newcopyComp = await this._vueComp.insertComponentLayout(compclass, compData.meta, null, compData)
    }
    newcopyComp.loadData(compData)
    e.stopPropagation()
  }
  onDelete_Event(e: Event) {
    e.preventDefault()
    // window.console.log('按了删除键', this.name)

    if (this._vueComp.selectedChildren.length > 0) {
      e.stopPropagation()
    }
    for (let index = 0; index < this._vueComp.selectedChildren.length; index++) {
      const comp = this._vueComp.selectedChildren[index]
      this._vueComp.removeChildRecursion(comp.Id)
    }
  }
  onPositionLeft_Event: (e: Event) => void
  onPositionRight_Event: (e: Event) => void
  onPositionTop_Event: (e: Event) => void
  onPositionBotton_Event: (e: Event) => void
  onWidthSmall_Event: (e: Event) => void
  onWidthBig_Event: (e: Event) => void
  onHeightSmall_Event: (e: Event) => void
  onHeightBig_Event: (e: Event) => void
  onRestoreScale_Event: (e: Event) => void
  onSave_Event: (e: Event) => void
  onChangedScale_Event: (changedScaleSize: number) => boolean
  onMouseWheelInLayout_Event: (e: Event) => void
  onWindowUnload_Event: (e: Event) => void
  onWindowResize_Event: (e: Event) => void
  onClick_Event: (e: Event, target: any) => void
  onDoubleClick_Event: (e: Event, target: any) => void
  onDragSelf_Event: (xmove: number, ymove: number) => void
  onMouseDragMove_Event: (e: Event, xmove: number, ymove: number) => void
  onMouseMove_Event(e: MouseEvent) {}
  onMoudeDown_Event: (e: Event) => void
  onMoudeUp_Event: (e: Event) => void
  onBoxSelect_Event: (e: MouseEvent) => void
  onDragEnd_Event() {
    this._vueComp.clearHorRule()
    this._vueComp.clearVerRule()
  }
  onDragClone_Event: (el: Element) => void
  onDragOut_Event: (el: Element, targetContainer: Element) => boolean
  onDrag_Event: (el: Element, dragdata: DragItemData<any>) => void
  onDrop_Event: (el: Element, targetContainer: Element, screenLeft: number, screenTop: number, dragdata?: DragItemData<any>) => Promise<boolean>
  onDragMove_Event: (xChange: number, yChange: number, left: number, top: number, el: Element, dragdata?: DragItemData<any>) => boolean
}
