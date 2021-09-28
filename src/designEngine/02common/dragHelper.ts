import dragula, { Drake } from 'dragula'
import * as common from '@src/utils'

export enum dragEnums {
  canDrop = 'lyl_candrop',
  canDrag = 'lyl_candrag',
  dropContainer = 'lyl_dropContainer',
  dargItem = 'lyl_dargItem',
  dragItem_Info = 'lyl_dragItem_Info'
}

type onDragEventType = (el: Element, sourceContainer: Element) => void
type onDropEventType = (el: Element, targetContainer: Element) => boolean
type onDragOverEventType = (el: Element, targetContainer: Element) => boolean
type onShadowEventType = (el: Element, targetContainer: Element) => void
type onClonedEventType = (clone: Element) => void
type onDragEndEventType = (el: Element) => void
type onDragMoveEventType = (el: Element, targetContainer: Element) => boolean
type onDragOutEventType = (el: Element, targetContainer: Element) => boolean

class dragulaContainerClass {
  constructor(contain: Element) {
    this.container = contain
  }
  public container: Element

  public dragEvent: onDragEventType
  public dropEvent: onDropEventType
  public overEvent: onDragOverEventType
  public shadowEvent: onShadowEventType //拖拽到目标容器中时，绘制副本时触发
  public clonedEvent: onClonedEventType //开始拖拽时触发
  public dragEndEvent: onDragEndEventType
  public dragMoveEvent: onDragMoveEventType
  public dragOutEvent: onDragOutEventType
}

class dragulaExtand {
  public static dragClone: Element
  public static dragSource: Element
  public static dragShadow: Element
  public static dragOverContainer: Element
  public static drag_third: Drake = dragula({
    direction: '',
    revertOnSpill: false, // 如果拖到容器外面是否复位、还是就近排序。
    removeOnSpill: false,
    copy: (el: Element, source: Element) => {
      return true
    }, // elements are moved by default, not copied
    invalid: (el, handle) => {
      //拖拽是否无效，如果无效，现实禁止标志：true拖拽无效,false拖拽有效
      if (dragulaExtand.IsCanDrag(el) == true) {
        return false //
      } else {
        return true //
      }
    },
    moves: function(el, source, handle, sibling) {
      if (dragulaExtand.IsCanDrag(el) == true) {
        return true //
      } else {
        return false //
      }
    },
    isContainer: function(el) {
      //当前拖拽的dom是不是容器，是容器的话，将不会触发drop。：true是容器，false：不是容器
      return false
    },
    accepts: function(el, targetContainer, sourceContainer, sibling) {
      //这个事件相当于DragMove事件，会实时触发
      window.console.log('最底层dragmove触发:', targetContainer)
      if (dragulaExtand.IsCanDrop(targetContainer) == false) {
        return false //
      }
      return true
    }
  })
    .on('drag', dragulaExtand._onDrag)
    .on('drop', dragulaExtand._onDrop)
    .on('over', dragulaExtand._onDragOver)
    .on('shadow', dragulaExtand._onDragShadow)
    .on('cloned', dragulaExtand._onDragClone)
    .on('dragend', dragulaExtand._onDragEnd)
    .on('out', dragulaExtand._onDragOut)

  private static _dragulaContainer: dragulaContainerClass[] = []
  public static registerContainer(container: Element): boolean {
    if (dragulaExtand.drag_third.containers.indexOf(container) > -1) {
      return false
    }
    dragulaExtand.drag_third.containers.push(container)
    /**添加dragMove事件拓展 */
    var dragulaContainer = new dragulaContainerClass(container)
    window.console.log('registerContainer:', container)
    dragulaExtand._dragulaContainer.push(dragulaContainer)
    dragulaExtand._dragulaContainer = dragulaExtand._dragulaContainer.sort((a, b) => {
      if ($(a.container).find(b.container).length > 0) {
        return 1
      } else {
        return -1
      }
    })
    return true
  }
  public static removeContainer(container: Element): boolean {
    if (dragulaExtand.drag_third.containers.indexOf(container) > -1) {
      dragulaExtand.drag_third.containers.splice(dragulaExtand.drag_third.containers.indexOf(container), 1)
      /**移除dragMove事件拓展 */
      var finddragulaContainer = dragulaExtand.getContainerDesc(container).filter((o) => o.container == container)[0]
      var finddragulaContainerIndex = dragulaExtand._dragulaContainer.indexOf(finddragulaContainer)
      dragulaExtand._dragulaContainer.splice(finddragulaContainerIndex, 1)
      // container.removeEventListener('mousemove', dragulaExtand._onMouseMove)
    }
    return true
  }
  public static IsCanDrop(targetContainer: Element): boolean {
    var candrop = $(targetContainer).attr(dragEnums.canDrop)
    if (candrop == 'true') {
      return true
    } else {
      return false
    }
  }
  public static IsCanDrag(dragItem: Element): boolean {
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
  /**当前注册的事件类 */
  public static getContainerDesc(container: Element): dragulaContainerClass[] {
    let res: any[] = []
    for (let index = 0; index < dragulaExtand._dragulaContainer.length; index++) {
      const element = dragulaExtand._dragulaContainer[index]
      if (element.container === container || $(element.container).find(container).length > 0) {
        res.push(element)
      }
    }
    /**理论上在注册的时候已经排序 */
    // return res.sort((a, b) => {
    //   if ($(a.container).find(b.container).length > 0) {
    //     return 1
    //   } else {
    //     return -1
    //   }
    // })
    return res
  }
  // **************监听dragula所有对外事件*****************************************************************************
  private static _onDrag(el: Element, sourceContainer: Element) {
    dragulaExtand.dragSource = el
    // window.console.log('拖拽最底层',el)
    var findDragMoveExtands = dragulaExtand.getContainerDesc(sourceContainer)
    if (findDragMoveExtands.length < 1) {
      return
    }

    for (let index = 0; index < findDragMoveExtands.length; index++) {
      const findDragMoveExtand = findDragMoveExtands[index]
      if (findDragMoveExtand.dragEvent) {
        findDragMoveExtand.dragEvent(el, findDragMoveExtand.container)
        return
      }
    }
  }
  //如果拖拽到其它容器中,targetContainer不为空,targetContainer_Self为空
  //如果拖拽到本身容器中,targetContainer为空,targetContainer_Self不为空
  private static _onDrop(el: Element, targetContainer: Element, sourceContainer: Element, targetContainer_Self: Element) {
    window.console.log('_onDrop:', targetContainer)
    var findDragMoveExtands = null
    if (targetContainer == null && targetContainer_Self != null) {
      findDragMoveExtands = dragulaExtand.getContainerDesc(targetContainer_Self)
    } else if (targetContainer != null && targetContainer_Self == null) {
      findDragMoveExtands = dragulaExtand.getContainerDesc(targetContainer)
    } else if (targetContainer != null && targetContainer_Self != null) {
      findDragMoveExtands = dragulaExtand.getContainerDesc(targetContainer)
    } else {
      // findDragMoveExtands = dragulaExtand.getContainerDesc(sourceContainer)
      return
    }

    if (findDragMoveExtands.length < 1) {
      return
    }

    var iscontinue = true
    findDragMoveExtands.filter((findDragMoveExtand) => {
      if (findDragMoveExtand.dropEvent && iscontinue) {
        iscontinue = findDragMoveExtand.dropEvent(dragulaExtand.dragSource, findDragMoveExtand.container)
        if (iscontinue == false) {
          return
        }
      }
    })
  }
  private static _onDragOver(el: Element, targetContainer: Element, sourceContainer: Element) {
    window.console.log('_onDragOver:', targetContainer)
    var findDragMoveExtands = dragulaExtand.getContainerDesc(targetContainer)
    if (findDragMoveExtands.length < 1) {
      return
    }
    dragulaExtand.dragOverContainer = targetContainer

    var iscontinue = true
    findDragMoveExtands.filter((findDragMoveExtand) => {
      if (findDragMoveExtand.overEvent && iscontinue) {
        iscontinue = findDragMoveExtand.overEvent(el, findDragMoveExtand.container)
        if (iscontinue == false) {
          return
        }
      }
    })
  }
  private static _onDragShadow(shadow: Element, targetContainer: Element, sourceContainer: Element) {
    dragulaExtand.dragShadow = shadow
    $(dragulaExtand.dragShadow).hide()
    var findDragMoveExtand = dragulaExtand.getContainerDesc(targetContainer).filter((o) => o.container == sourceContainer)[0]
    if (findDragMoveExtand && findDragMoveExtand.shadowEvent) {
      findDragMoveExtand.shadowEvent(shadow, targetContainer)
    }
  }
  private static _onDragClone(clone: Element, original: Element, type: string) {
    dragulaExtand.dragClone = clone
    dragulaExtand.dragClone.addEventListener('mousemove', dragulaExtand._onDragMove)
    dragulaExtand._dragulaContainer.filter((o) => {
      if (o.clonedEvent) {
        o.clonedEvent(clone)
      }
    })
    $(clone).css('z-index', '99999')
    $(clone).css('display', 'block')
    $(clone).css('position', 'absolute')
    $(clone).css('pointer-events', 'none')
  }
  private static _onDragOut(el: Element, targetContainer: Element, sourceContainer: Element) {
    var findDragMoveExtands = dragulaExtand.getContainerDesc(targetContainer)
    if (findDragMoveExtands.length < 1) {
      return
    }
    var iscontinue = true
    findDragMoveExtands.filter((findDragMoveExtand) => {
      if (findDragMoveExtand.dragOutEvent && iscontinue) {
        iscontinue = findDragMoveExtand.dragOutEvent(el, findDragMoveExtand.container)
        if (iscontinue == false) {
          return
        }
      }
    })
  }
  private static _onDragEnd(el: Element) {
    if (dragulaExtand.dragShadow) {
      $(dragulaExtand.dragShadow).remove()
    }
    if (dragulaExtand.dragClone) {
      dragulaExtand.dragClone.removeEventListener('mousemove', dragulaExtand._onDragMove)
    }
    dragulaExtand._dragulaContainer.filter((o) => {
      if (o.dragEndEvent) {
        o.dragEndEvent(el)
      }
    })
    dragulaExtand.dragSource = null
    dragulaExtand.dragClone = null
    dragulaExtand.dragShadow = null
    dragulaExtand.dragOverContainer = null
  }
  private static _onDragMove(e: Event) {
    // window.console.log(dragulaExtand.dragSource)
    if (!dragulaExtand.dragSource) {
      return
    }
    // window.console.log('**********最底层拖拽')
    var findDragMoveExtands = dragulaExtand.getContainerDesc(dragulaExtand.dragOverContainer)
    // window.console.log('**********最底层拖拽:', findDragMoveExtands.length)
    for (let index = 0; index < findDragMoveExtands.length; index++) {
      const findDragMoveExtand = findDragMoveExtands[index]
      if (!findDragMoveExtand.dragMoveEvent || !dragulaExtand.dragSource) {
        continue
      }

      var iscontinue = findDragMoveExtand.dragMoveEvent(dragulaExtand.dragSource, findDragMoveExtand.container)
      if (!iscontinue) {
        if (e) {
          e.stopPropagation()
          e.stopImmediatePropagation()
        }
        return false
      }
    }
    //window.console.log('accepts当前是容器，可以拖拽进来')
    return true //
  }
}

export default class dragHelper {
  /*********实例方法********************************************************* */
  private _container: Element
  constructor(container: Element) {
    this._container = container
  }
  get dragCloneElement(): Element {
    return dragulaExtand.dragClone
  }
  get currentContainer(): Element {
    return this._container
  }
  get currentEventClass(): dragulaContainerClass {
    return dragulaExtand.getContainerDesc(this._container).filter((o) => o.container == this._container)[0]
  }

  public dragEnd() {
    dragulaExtand.drag_third.end()
  }
  public dragCancel() {
    //不加true会触发drop
    dragulaExtand.drag_third.cancel(true)
  }
  /*********container操作********************************************************* */
  public IsCanDrop(): boolean {
    return dragulaExtand.IsCanDrop(this._container)
  }
  public makeContainerCanDrop() {
    $(this._container).attr(dragEnums.canDrop, 'true')
  }
  public makeContainerCannotDrop() {
    $(this._container).attr(dragEnums.canDrop, 'false')
  }
  public makeDomContainer() {
    if (dragulaExtand.registerContainer(this._container) == true) {
      $(this._container).attr('tabindex', -1)
      $(this._container).addClass('container')
      this.makeContainerCanDrop()
    }
  }
  public removeContainer() {
    this.makeContainerCannotDrop()
    $(this._container).removeAttr('tabindex')
    $(this._container).removeClass('container')
    dragulaExtand.removeContainer(this._container)
  }
  /***************dragItem操作*************************** */
  public IsCanDrag(dragItem: Element): boolean {
    return dragulaExtand.IsCanDrag(dragItem)
  }
  public makeDomCanDrag(dragItem: Element) {
    // window.console.log('makeDomCanDrag')
    $(dragItem).attr(dragEnums.canDrag, 'true')
  }
  public makeDomCannotDrag(dragItem: Element) {
    $(dragItem).attr(dragEnums.canDrag, 'false')
  }
  // *****************定义dragItem的附加内容*****************************************
  public makeDragItemInfo(dragItem: Element, Info: any): void {
    var infostr = common.serialize(Info)
    //window.console.log('infostr',infostr)
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
    if (this.currentEventClass) {
      this.currentEventClass.dragEvent = callback
    } else {
      //window.console.error('在注册dragmove事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDrop(callback: onDropEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.dropEvent = callback
    } else {
      //window.console.error('在注册Drop事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDragOver(callback: onDragOverEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.overEvent = callback
    } else {
      //window.console.error('在注册DragOver事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDragShadow(callback: onShadowEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.shadowEvent = callback
    } else {
      //window.console.error('在注册DragShadow事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDragClone(callback: onClonedEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.clonedEvent = callback
    } else {
      //window.console.error('在注册DragClone事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDragEnd(callback: onDragEndEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.dragEndEvent = callback
    } else {
      window.console.error('在注册DragEnd事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDragMove(callback: onDragMoveEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.dragMoveEvent = callback
    } else {
      window.console.error('在注册dragmove事件之前，请把当前container注册成拖拽组件')
    }
  }
  public registerOnDragOut(callback: onDragOutEventType) {
    if (this.currentEventClass) {
      this.currentEventClass.dragOutEvent = callback
    } else {
      window.console.error('在注册dragOut事件之前，请把当前container注册成拖拽组件')
    }
  }
}
