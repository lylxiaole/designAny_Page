import * as common from '@common/utils'

export enum dragEnums {
  canDrop = 'lyl_candrop',
  canDrag = 'draggable',
  dropContainer = 'lyl_dropContainer',
  dargItem = 'lyl_dargItem',
  dragItem_Info = 'lyl_dragItem_Info'
}

type onDragEventType = (el: Element, sourceContainer: Element) => void
type onDropEventType = (el: Element, targetContainer: Element, x: number, y: number) => Promise<boolean>
type onDragOverEventType = (el: Element, targetContainer: Element) => boolean
type onDragEndEventType = (el: Element) => void
type onDragMoveEventType = (el: Element, targetContainer: Element, xchanged, ychanged, mouseLeft, mouseTop, dragStartXtoTargetLeft, dragStartYtoTargetTop) => boolean
type onDragOutEventType = (el: Element, targetContainer: Element) => boolean
type onDragEnterEventType = (el: Element, targetContainer: Element) => boolean

export default class dragHelper {
  private onDragEventCallback: onDragEventType
  private onDropEventCallback: onDropEventType
  private onDragOverEventCallback: onDragOverEventType
  private onDragEndEventCallback: onDragEndEventType
  private onDragMoveEventCallback: onDragMoveEventType
  private onDragOutEventCallback: onDragOutEventType
  private onDragEnterEventCallback: onDragEnterEventType
  public currentScaleSize: number = 1
  public static dragClone: Element
  public static currentDragX: number = NaN
  public static currentDragY: number = NaN
  public static dragStartXtoTargetLeft: number = NaN
  public static dragStartYtoTargetTop: number = NaN

  get dragCloneElement(): Element {
    return dragHelper.dragClone
  }
  get currentContainer(): Element {
    return this._container
  }
  /*********实例方法********************************************************* */
  private _container: Element
  constructor(container: Element) {
    this._container = container
    this.currentScaleSize = 1
  }
  /*********container操作********************************************************* */
  public IsCanDrop(): boolean {
    var candrop = $(this._container).attr(dragEnums.canDrop)
    if (candrop == 'true') {
      return true
    } else {
      return false
    }
  }
  public makeContainerCanDrop() {
    $(this._container).attr(dragEnums.canDrop, 'true')
    $(this._container).on('drop', async (e: any) => {
      if (!this.onDropEventCallback) {
        return
      }

      let containeroffset = $(this._container).offset()
      let offsetX = e.clientX - containeroffset.left
      let offsetY = e.clientY - containeroffset.top
      let res = await this.onDropEventCallback(dragHelper.dragClone, this._container, offsetX, offsetY)
      if (res === false) {
        e.stopPropagation()
      }

      dragHelper.currentDragX = NaN
      dragHelper.currentDragY = NaN
      dragHelper.dragClone = null
    })
    $(this._container).on('dragover', (e: any) => {
      //同时注册drop和dragover时, 调用e.preventDefault()才能让容器的drop事件得以触发
      e.preventDefault()

      let containeroffset = $(this._container).offset()
      let offsetX = e.clientX - containeroffset.left
      let offsetY = e.clientY - containeroffset.top

      // console.log("$(this._container).on('dragover'", offsetY, dragHelper.dragStartY)
      if (isNaN(dragHelper.currentDragX) || isNaN(dragHelper.currentDragY)) {
        dragHelper.currentDragX = offsetX
        dragHelper.currentDragY = offsetY
      }

      let xchanged = offsetX - dragHelper.currentDragX
      let ychanged = offsetY - dragHelper.currentDragY
      dragHelper.currentDragX = offsetX
      dragHelper.currentDragY = offsetY

      if (!this.onDragMoveEventCallback) {
        return
      }

      // window.console.log('dragover:', e)
      let res = this.onDragMoveEventCallback(dragHelper.dragClone, this._container, xchanged, ychanged, offsetX, offsetY, dragHelper.dragStartXtoTargetLeft, dragHelper.dragStartYtoTargetTop)
      if (res === false) {
        e.stopPropagation()
      }
    })
    $(this._container).on('dragenter', (e: any) => {
      if (!this.onDragEnterEventCallback) {
        return
      }
      window.console.log('dragenter:', e)
      let res = this.onDragEnterEventCallback(dragHelper.dragClone, this._container)
      if (res === false) {
        e.stopPropagation()
      }
    })
    $(this._container).on('dragleave', (e: any) => {
      if (!this.onDragOutEventCallback) {
        return
      }
      let res = this.onDragOutEventCallback(dragHelper.dragClone, this._container)
      if (res === false) {
        e.stopPropagation()
      }
    })
  }
  public makeContainerCannotDrop() {
    $(this._container).attr(dragEnums.canDrop, 'false')
    $(this._container).off('drop')
    $(this._container).off('dragover')
    $(this._container).off('dragenter')
    $(this._container).off('dragleave')
  }
  public makeDomContainer() {
    $(this._container).attr('tabindex', 1)
    $(this._container).addClass('container')
  }
  public removeContainer() {
    this.makeContainerCannotDrop()
    $(this._container).removeAttr('tabindex')
    $(this._container).removeClass('container')
    $(this._container).off()
  }
  /***************dragItem操作*************************** */
  public IsCanDrag(dragItem: Element): boolean {
    var candrag = $(dragItem).attr(dragEnums.canDrag)
    if (candrag == 'true') {
      return true
    } else if (candrag == null || candrag == undefined) {
      //如果未声明的话，就让它可以拖拽。因为初始化容器的时候，不会对所有节点操作
      return true
    } else {
      return false
    }
  }
  public makeDomCanDrag(dragItem: Element) {
    // window.console.log('makeDomCanDrag')
    $(dragItem).attr(dragEnums.canDrag, 'true')

    $(dragItem).on('dragend', (e: any) => {
      if (this.onDragEndEventCallback) {
        this.onDragEndEventCallback(dragItem)
      }

      dragHelper.currentDragX = NaN
      dragHelper.currentDragY = NaN
      dragHelper.dragClone = null
    })
    $(dragItem).on('dragstart', (e: any) => {
      e.stopPropagation()
      dragHelper.dragClone = e.delegateTarget

      let containeroffset = $(this._container).offset()
      let dragStartX = e.clientX - containeroffset.left
      let dragStartY = e.clientY - containeroffset.top

      dragHelper.dragStartXtoTargetLeft = dragStartX - $(e.delegateTarget).position().left
      dragHelper.dragStartYtoTargetTop = dragStartY - $(e.delegateTarget).position().top
      // console.log('dragstart:', dragXtoTargetLeft, dragYtoTargetTop)
      if (this.onDragEventCallback) {
        this.onDragEventCallback(e.target, this._container)
      }
    })
  }
  public makeDomCannotDrag(dragItem: Element) {
    $(dragItem).attr(dragEnums.canDrag, 'false')
    $(dragItem).off('drag')
    $(dragItem).off('dragend')
    $(dragItem).off('dragstart')
  }
  // *****************定义dragItem的附加内容*****************************************
  public makeDragItemInfo(dragItem: Element, Info: any): void {
    var infostr = common.serialize(Info)
    $(dragItem).attr(dragEnums.dragItem_Info, infostr)
  }
  public getDragItemInfo(dragItem: Element): any {
    var infostr = $(dragItem).attr(dragEnums.dragItem_Info)
    if (!infostr) {
      return null
    }
    var info = common.deserialize(infostr)
    return info
  }
  // *******************注册事件*********************************************************************
  public registerOnDrag(callback: onDragEventType) {
    this.onDragEventCallback = callback
  }
  public registerOnDrop(callback: onDropEventType) {
    this.onDropEventCallback = callback
  }

  public registerOnDragEnd(callback: onDragEndEventType) {
    this.onDragEndEventCallback = callback
  }
  public registerOnDragMove(callback: onDragMoveEventType) {
    this.onDragMoveEventCallback = callback
  }

  public registerOnDragOut(callback: onDragOutEventType) {
    this.onDragOutEventCallback = callback
  }
  public registerOnDragEnter(callback: onDragEnterEventType) {
    this.onDragEnterEventCallback = callback
  }
}
