import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import dragHelper, { dragulaExtand } from '../02common/dragHelper'
import common from '../02common/commonMethod'
import HookBase from './HookBase'
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
  public startDragMovePoint_left: number = NaN
  public startDragMovePoint_top: number = NaN
  public isMouseDown: boolean = false
  public boxSelectBorder: any = null
  public mousedownPointX: number = null
  public mousedownPointY: number = null
  public clickTimer: number = null
}

export default class BaseEvents extends HookBase {
  protected _dragHelper: dragHelper
  protected _currentDom: Element
  public IsDesigning: boolean = false
  public isDraging: boolean = false

  public isCaptureEvent: boolean = false
  public startDragMovePoint_left: number = NaN
  public startDragMovePoint_top: number = NaN
  public isMouseDown: boolean = false
  public boxSelectBorder: any = null
  public mousedownPointX: number = null
  public mousedownPointY: number = null
  public clickTimer: number = null

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
      this._dragHelper.makeDomCanDrag(this._currentDom)
    } else {
      this._dragHelper.makeDomCannotDrag(this._currentDom)
    }
  }
  get canDrag(): boolean {
    if (!this._dragHelper) {
      return false
    }
    return this._dragHelper.IsCanDrag(this._currentDom)
  }

  beforeCreate() {}

  mounted() {
    if (this.IsDesigning == true) {
      this._dragHelper = new dragHelper(this._currentDom)
      this._dragHelper.makeDomContainer()
    }
  }

  beforeDestroy() {
    this.RealseEvent()
  }
  created(): void {}
  beforeMount(): void {}
  beforeUpdate(): void {}
  updated(): void {}
  activated(): void {}
  deactivated(): void {}
  destroyed(): void {}
  errorCaptured(): void {}

  /**开始捕捉鼠标键盘 */
  protected CaptureEvent() {
    if (this.isCaptureEvent == true) {
      return
    }
    this.isCaptureEvent = true
    // window.console.log('捕捉鼠标键盘动作')
    this._currentDom.addEventListener('click', this._onClick)
    this._currentDom.addEventListener('dblclick', this._onDoubleClick)
    this._currentDom.addEventListener('keyup', this._onKeyUp)
    this._currentDom.addEventListener('keydown', this._onKeyDown)
    this._currentDom.addEventListener('mousemove', this._mouseMove)
    this._currentDom.addEventListener('mouseup', this._mouseUp)
    this._currentDom.addEventListener('mousedown', this._mouseDown)
    // $('html').bind('mousewheel', this._onMouseWheel)
    $(this._currentDom)[0].addEventListener('mousewheel', this._onMouseWheel, { passive: false })
    $(window).bind('onbeforeunload', this._onWindowUnload)
    this._dragHelper.makeDomContainer()
    this._dragHelper.registerOnDrag(this._onDrag)
    this._dragHelper.registerOnDrop(this._onDrop)
    this._dragHelper.registerOnDragShadow(this._onDragShadow)
    this._dragHelper.registerOnDragMove(this._onDragMove)
    this._dragHelper.registerOnDragOver(this._onDragOver)
    this._dragHelper.registerOnDragEnd(this._onDragEnd)
    this._dragHelper.registerOnDragOut(this._onDragOut)
    this._dragHelper.registerOnDragClone(this._onDragClone)
  }
  /**停止捕捉鼠标键盘 */
  protected RealseEvent() {
    if (this.isCaptureEvent == false) {
      return
    }
    // window.console.log('释放鼠标键盘动作')
    this.isCaptureEvent = false
    if (this._currentDom) {
      this._currentDom.removeEventListener('click', this._onClick)
      this._currentDom.removeEventListener('dblclick', this._onDoubleClick)
      this._currentDom.removeEventListener('keyup', this._onKeyUp)
      this._currentDom.removeEventListener('keydown', this._onKeyDown)
      this._currentDom.removeEventListener('mousemove', this._mouseMove)
      this._currentDom.removeEventListener('mouseup', this._mouseUp)
      this._currentDom.removeEventListener('mousedown', this._mouseDown)
      // $('html').unbind('mousewheel', this._onMouseWheel)
      $(this._currentDom)[0].removeEventListener('mousewheel', this._onMouseWheel)
      $(window).unbind('beforeunload unload', this._onWindowUnload)
      this._dragHelper.RemoveContainer()
    }
  }

  /********************Drag事件****************************************************** */

  private _onDrag(el: Element, sourceContainer: Element) {
    // window.console.log('从本布局中开始拖拽一个东西出去了')
    if (this.IsDesigning == false) {
      return
    }

    if (sourceContainer != this._currentDom) {
      return
    }
    this.clearBoxSelectInfo(window.event)
    this.isDraging = true
    //只有继承自BaseEvent的组件才能感知此事件
    if (this.canDrag && this.onDrag_Event) {
      // window.console.log('从本布局中开始拖拽一个东西出去了');
      var currentDragData = new DragItemData()
      this.onDrag_Event(el, currentDragData)
      this._dragHelper.makeDragItemInfo(el, currentDragData)
      return true
    } else {
      this._dragHelper.dragEnd()
    }
  }
  private _onDrop(el: Element, targetContainer: Element): boolean {
    if (this.IsDesigning == false) {
      return true
    }
    if (this.canDrop && this.onDrop_Event) {
      // window.console.log('drop')
      var dragdata = this._dragHelper.getDragItemInfo(el) as DragItemData<any>
      return this.onDrop_Event(el, targetContainer, this.startDragMovePoint_left, this.startDragMovePoint_top, dragdata)
    }
    this._dragHelper.dragCancel()
    return true
  }
  private _onDragOver(el: Element, targetContainer: Element): boolean {
    if (this.IsDesigning == false || !this.onDragOver_Event) {
      return true
    }
    if (targetContainer != this._currentDom) {
      return true
    }
    this.startDragMovePoint_left = $(el).offset().left
    this.startDragMovePoint_top = $(el).offset().top
    return this.onDragOver_Event(el)
    //只有继承自BaseEvent的组件才能感知此事件
    // window.console.log('dropover')
  }
  private _onDragShadow(shadow: Element, targetContainer: Element) {
    if (this.IsDesigning == false) {
      return
    }
  }

  private _onDragMove(el: Element, targetContainer: Element): boolean {
    if (this.IsDesigning == false || this.canDrop == false || !this.onDragMove_Event) {
      return true
    }
    if (!el) {
      return true
    }
    // window.console.log('最底层拖拽')
    var iscontinue: boolean = true
    var currentDragLeft = $(this._dragHelper.dragCloneElement).offset().left - $(targetContainer).offset().left
    var currentDragTop = $(this._dragHelper.dragCloneElement).offset().top - $(targetContainer).offset().top

    // window.console.log('********************drag:', $(el).offset().left, '****', $(el).offset().top)
    // window.console.log('********************clone:', currentDragLeft, '****', currentDragTop)

    //如果是刚开始拖拽，初始化drag的值
    if (isNaN(this.startDragMovePoint_left) || this.startDragMovePoint_left < 1) {
      this.startDragMovePoint_left = currentDragLeft
    }

    if (isNaN(this.startDragMovePoint_top) || this.startDragMovePoint_top < 1) {
      this.startDragMovePoint_top = currentDragTop
    }
    //如果前后值相等，就不触发事件了
    if (this.startDragMovePoint_left == currentDragLeft && this.startDragMovePoint_top == currentDragTop) {
      return iscontinue
    }
    var xchanged = currentDragLeft - this.startDragMovePoint_left
    var ychanged = currentDragTop - this.startDragMovePoint_top
    var dragdata = this._dragHelper.getDragItemInfo(el) as DragItemData<any>
    iscontinue = this.onDragMove_Event(xchanged, ychanged, currentDragLeft, currentDragTop, el, dragdata)
    this.startDragMovePoint_left = currentDragLeft
    this.startDragMovePoint_top = currentDragTop
    return iscontinue
  }

  private _onDragEnd(el: Element) {
    if (this.IsDesigning == false || !this.onDragEnd_Event) {
      return
    }
    this.clearCachePoint()
    this.isDraging = false
    // window.console.log('dragend')
    this.onDragEnd_Event()
  }

  private _onDragOut(el: Element, targetContainer: Element): boolean {
    if (this.IsDesigning == false || !this.onDragOut_Event) {
      return true
    }
    if (targetContainer != this._currentDom) {
      return true
    }

    var res = this.onDragOut_Event(el, targetContainer)
    // if (res == false) {
    //   window.console.log('拖拽超出了范围', targetContainer)
    //   this._dragHelper.dragEnd()
    // }
  }

  private _onDragClone(clone: Element) {
    if (this.IsDesigning == false || !this.onDragClone_Event) {
      return true
    }
    this.onDragClone_Event(clone)
  }
  /************************************************************************** */

  private _onClick(e: Event) {
    //window.console.log('最底层,_onClick')
    if (this.IsDesigning == false || !this.onClick_Event) {
      return
    }
    e.stopPropagation()
    if (!this.clickTimer) {
      return
    }
    window.clearTimeout(this.clickTimer)
    this.clickTimer = null
    //window.console.log('最底层,_onClick')
    this.onClick_Event(e, this)
  }

  private _onDoubleClick(e: Event) {
    if (this.IsDesigning == false || !this.onDoubleClick_Event) {
      return
    }
    // e.stopPropagation()
    // window.console.log('点击')
    this.onDoubleClick_Event(e, this)
  }

  private _onKeyUp(e: any) {
    // window.console.log('按了键盘')
    if (this.IsDesigning == false) {
      return true
    }

    var keyCode = e.keyCode || e.which || e.charCode
    if (keyCode == 46 && this.onDelete_Event) {
      //删除
      e.preventDefault()
      this.onDelete_Event(e)
    }
  }

  private _onKeyDown(e: any) {
    if (this.IsDesigning == false) {
      return true
    }
    var keyCode = e.keyCode || e.which || e.charCode
    var ctrlKey = e.ctrlKey || e.metaKey
    // window.console.log('_onKeyDown:', e.target)
    if (this.onKeyDown_Event) {
      this.onKeyDown_Event(e)
    }

    if (keyCode == 37 && ctrlKey == false && this.onPositionLeft_Event) {
      //左键
      e.preventDefault()
      this.onPositionLeft_Event(e)
    } else if (keyCode == 38 && ctrlKey == false && this.onPositionTop_Event) {
      //上键
      e.preventDefault()
      this.onPositionTop_Event(e)
    } else if (keyCode == 39 && ctrlKey == false && this.onPositionRight_Event) {
      //右键
      e.preventDefault()
      this.onPositionRight_Event(e)
    } else if (keyCode == 40 && ctrlKey == false && this.onPositionBotton_Event) {
      //下键
      e.preventDefault()
      this.onPositionBotton_Event(e)
    } else if (keyCode == 37 && ctrlKey == true && this.onWidthSmall_Event) {
      //ctrl+左键
      e.preventDefault()
      this.onWidthSmall_Event(e)
    } else if (keyCode == 38 && ctrlKey == true && this.onHeightSmall_Event) {
      //ctrl+上键
      e.preventDefault()
      this.onHeightSmall_Event(e)
    } else if (keyCode == 39 && ctrlKey == true && this.onWidthBig_Event) {
      //ctrl+右键
      e.preventDefault()
      this.onWidthBig_Event(e)
    } else if (keyCode == 40 && ctrlKey == true && this.onHeightBig_Event) {
      //ctrl+下键
      e.preventDefault()
      this.onHeightBig_Event(e)
    } else if (keyCode == 48 && ctrlKey == true && this.onRestoreScale_Event) {
      //ctrl+0
      e.preventDefault()
      this.onRestoreScale_Event(e)
    } else if (keyCode == 83 && ctrlKey == true && this.onSave_Event) {
      //ctrl+s
      e.preventDefault()
      this.onSave_Event(e)
    } else if (keyCode == 67 && ctrlKey == true && this.onCopy_Event) {
      //ctrl+c
      e.preventDefault()
      this.onCopy_Event(e)
    } else if (keyCode == 88 && ctrlKey == true && this.onCut_Event) {
      //ctrl+x
      e.preventDefault()
      this.onCut_Event(e)
    } else if (keyCode == 86 && ctrlKey == true && this.onPaste_Event) {
      //ctrl+v
      e.preventDefault()
      this.onPaste_Event(e)
    }
  }

  private _onMouseWheel(e: any) {
    if (this.IsDesigning == false) {
      return true
    }
    var ctrlKey = e.ctrlKey || e.metaKey
    if (ctrlKey == true && this.onChangedScale_Event) {
      //仅仅滚轮
      e.preventDefault()
      var wheelvalue = e.wheelDelta || -e.detail
      var scalesize = wheelvalue / 1000
      if (this.onChangedScale_Event(scalesize) == false) {
        e.stopPropagation()
      }
    } else if (this.onMouseWheelInLayout_Event) {
      this.onMouseWheelInLayout_Event(e)
    }
  }

  private _mouseMove(e: any) {
    if (this.IsDesigning == false || !this.onMouseMove_Event) {
      return true
    }
    if (this.isDraging == true) {
      return
    }
    this.onMouseMove_Event(e)

    if (e.which === 1 && this.isDraging == false && this.isMouseDown == true) {
      //鼠标左键是按下状态
      // this.onSelectChanged.call(this, data)
      if (this.boxSelectBorder == null && this.onBoxSelect_Event) {
        this.boxSelectBorder = $('<div class="boxSelectBorder" style="border:1px solid red;position:absolute;background-color:transparent;z-index:199"></div>')
        this.boxSelectBorder.bind('mousemove', this._mouseMove)
        this.boxSelectBorder.bind('mouseup', this._mouseUp)
        $('body').append(this.boxSelectBorder)
      }
      if (this.onBoxSelect_Event) {
        this.onBoxSelect_Event(e)
        // e.stopPropagation()
      }
      return
    } else if (e.which === 3 || e.which === 1) {
      //which 0: 无,1: 左键,2: 中间滚轮（如果有的话）,3: 右键
      if (e.which == 1 && this.onMouseDragMove_Event) {
        // window.console.log('**********开始左键拖拽:', this.currentScaleSize)
        this.onMouseDragMove_Event(e, e.movementX, e.movementY)
      } else if (e.which == 3 && this.onDragSelf_Event) {
        this.onDragSelf_Event(e.movementX, e.movementY)
      }
      // this.startMouseDragPoint_left = currentDragLeft
      // this.startMouseDragPoint_top = currentDragTop
    }
  }

  private _mouseUp(e: any) {
    if (this.IsDesigning == false || !this.onMoudeUp_Event) {
      return true
    }
    // window.console.log('最底层,mouseUp')
    /***************** */
    this.clearBoxSelectInfo(e)
    /********************** */
    this.isMouseDown = false
    this.clearCachePoint()
    this.onMoudeUp_Event(e)
  }

  private clearBoxSelectInfo(e: any) {
    $('.boxSelectBorder').unbind('mousemove', this._mouseMove)
    $('.boxSelectBorder').unbind('mouseup', this._mouseUp)
    $('.boxSelectBorder').remove()
    if (this.boxSelectBorder) {
      this.boxSelectBorder = null
      this.mousedownPointX = null
      this.mousedownPointY = null
      e.stopPropagation()
    }
  }

  private _mouseDown(e: any) {
    if (this.IsDesigning == false) {
      return true
    }
    this.clickTimer = window.setTimeout(() => {
      window.clearTimeout(this.clickTimer)
      this.clickTimer = null
    }, 300)

    if (!this.onMoudeDown_Event) {
      return
    }

    this.mousedownPointX = e.clientX
    this.mousedownPointY = e.clientY
    this.isMouseDown = true
    this.onMoudeDown_Event(e)
  }

  private _onWindowUnload(e: any) {
    if (this.onWindowUnload_Event) {
      this.onWindowUnload_Event(e)
    }
  }

  private _onWindowResize(e: any) {
    if (!this.onWindowResize_Event) {
      return
    }
    window.setTimeout(() => {
      this.onWindowResize_Event(e)
    }, 500)
  }

  private clearCachePoint() {
    this.startDragMovePoint_left = NaN
    this.startDragMovePoint_top = NaN
  }
  /**********************对外公布的事件 **********************************/
  onKeyDown_Event: (e: Event) => void

  onCut_Event: (e: Event) => void
  onCopy_Event: (e: Event) => void
  onPaste_Event: (e: Event) => void
  onDelete_Event: (e: Event) => void
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
  onMouseMove_Event: (e: Event) => void
  onMoudeDown_Event: (e: Event) => void
  onMoudeUp_Event: (e: Event) => void

  onBoxSelect_Event: (e: MouseEvent) => void

  onDragEnd_Event: () => void
  onDragOver_Event: (el: Element) => boolean
  onDragClone_Event: (el: Element) => void

  onDragOut_Event: (el: Element, targetContainer: Element) => boolean
  onDrag_Event: (el: Element, dragdata: DragItemData<any>) => void
  onDrop_Event: (el: Element, targetContainer: Element, screenLeft: number, screenTop: number, dragdata?: DragItemData<any>) => boolean

  // onDragMove_Event: (
  //   startLeft_screen: number,
  //   startTop_screen: number,
  //   endLeft_screen: number,
  //   endTop_screen: number,
  //   el: Element
  // ) => boolean = function() {
  //   return true
  // }

  onDragMove_Event: (xChange: number, yChange: number, left: number, top: number, el: Element, dragdata?: DragItemData<any>) => boolean
}
