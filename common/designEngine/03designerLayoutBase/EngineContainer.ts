import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import EngineLayout, { SaveInfo, Point } from './EngineLayout'
import { DragItemData, DragItemTypeEnum } from './BaseEvents'
import { Property } from './commonClasses/LayoutProperty'
import { getUuid, deepClone, serialize } from '@common/utils'
import { findSystemCompByCode } from './commonClasses/componentInfos'
import { EnginePage } from '.'
import dragHelper from '@common/designEngine/02common/dragHelper_new'

@Options({})
export default class EngineContainer extends EngineLayout {
  //横向尺子
  private horRule: Element = null
  //纵向尺子
  private verRule: Element = null
  //当前页面的缩放尺寸
  public currentScaleSize: number = 1
  private static copyComp: EngineLayout
  private static isCut: boolean = false

  private mouseX: number = 0
  private mouseY: number = 0
  created() {
    this.onDrop_Event = this.listenOnDrop
    this.onDragMove_Event = this.listenOnDragMove
    this.onDelete_Event = this.listenOnDeleteKey
    this.onDragEnd_Event = this.listenOnDragEnd
    this.onCut_Event = this.listenOnCut
    this.onCopy_Event = this.listenOnCopy
    this.onPaste_Event = this.listenOnPaste
    this.onMouseMove_Event = this.listenOnMousemove
  }

  mounted() {}
  /**********************************监听底层事件 ******************************/
  private listenOnMousemove(e: MouseEvent) {
    this.mouseX = e.offsetX
    this.mouseY = e.offsetY
  }
  private async listenOnDrop(el: Element, targetContainer: Element, screenLeft: number, screenTop: number, dragdata: DragItemData<any>): Promise<boolean> {
    // window.console.log('listenOnDrop:', 1)
    if (!dragdata) {
      return true
    }

    let compInfo = dragdata.dragData as any
    if (!compInfo) {
      return true
    }
    // window.console.log('listenOnDrop:', dragdata)
    screenLeft = dragHelper.currentDragX
    screenTop = dragHelper.currentDragY
    let dropcomp: EngineLayout = null

    switch (dragdata.type) {
      case DragItemTypeEnum.drop_system_component:
        {
          let compVue = findSystemCompByCode(compInfo.compCode)
          dropcomp = await this.insertComponentLayout(compVue, compInfo, dragdata.type)
        }
        break
      //暂时保留
      case DragItemTypeEnum.drop_component_template:
        {
          let compdata = this.getCompTemplateData(compInfo.sourceId)
          let compVue = findSystemCompByCode(compInfo.compCode)
          dropcomp = await this.insertComponentLayout(compVue, compInfo, dragdata.type, compdata)
        }
        break
      default:
        break
    }
    if (dropcomp) {
      dropcomp.left = (screenLeft - $(this.$el).offset().left) / this.currentScaleSize
      dropcomp.top = (screenTop - $(this.$el).offset().top) / this.currentScaleSize
    }

    return false
  }
  protected listenOnDragMove(xchanged: number, ychanged: number, left: number, top: number, el: Element, dragdata?: DragItemData<any>): boolean {
    if (!dragdata) {
      return true
    }
    let compInfo = dragdata.dragData as any
    if (!compInfo) {
      return true
    }
    let dragComp = this.findLayoutRecursion(compInfo.compId, this.children) as EngineLayout
    // window.console.log('*****感知拖拽，容器Id=' + this.Id + '***组件Id=', compInfo.compId)
    if (!dragComp) {
      return false
    }

    let parentPageCurrentScaleSize = (dragComp.topLayout as any as EnginePage).currentScaleSize
    // 在容器内拖拽组件位置
    if (dragdata.type == DragItemTypeEnum.dragmove_component_inpage) {
      window.console.log('dragmove_component_inpage:', (window.event as any).dataTransfer)
      let currentOffsetByPage = $(this.$el).offset()
      let afterMovedLeft = left - currentOffsetByPage.left
      let afterMovedTop = top - currentOffsetByPage.top

      let newleft = afterMovedLeft / parentPageCurrentScaleSize
      let newtop = afterMovedTop / parentPageCurrentScaleSize
      /**范围控制(拖拽不能超出容器范围) */
      if (newleft < 0) {
        newleft = 0
      } else if (newleft > this.width) {
        newleft = this.width - 1
      }

      if (afterMovedTop < 0) {
        newtop = 0
      } else if (newtop > this.height) {
        newtop = this.height - 1
      }

      dragComp.left = newleft
      dragComp.top = newtop
      return false
    }
    // 在容器内拖拽组件大小
    else if (dragdata.type == DragItemTypeEnum.drag_component_size) {
      xchanged = xchanged / parentPageCurrentScaleSize
      window.console.log(' DragItemTypeEnum.drag_component_size 1:', compInfo.position)
      ychanged = ychanged / parentPageCurrentScaleSize
      this.changeComponentSize(ychanged, xchanged, compInfo.compId, compInfo.position)
      // window.console.log(compInfo.position)
      return false
    }
    return true
  }
  private listenOnDragEnd() {
    this.clearHorRule()
    this.clearVerRule()
  }
  private listenOnDeleteKey(e: Event) {
    e.preventDefault()
    // window.console.log('按了删除键', this.name)

    if (this.selectedChildren.length > 0) {
      e.stopPropagation()
    }
    for (let index = 0; index < this.selectedChildren.length; index++) {
      const comp = this.selectedChildren[index]
      if (this.deleteChildComponents(comp.Id) == true) {
        this.removeChildRecursion(comp.Id)
      }
    }
  }
  private listenOnCut(e) {
    if (this.isDesigning) {
      if (this.selectedChildren && this.selectedChildren.length > 0) {
        EngineContainer.copyComp = this.selectedChildren[0] as EngineLayout
        // this.$message.success('组件已剪切', 2)
        EngineContainer.isCut = true
        e.stopPropagation()
      }
    }
  }
  private listenOnCopy(e) {
    window.console.log('listenOnCopy:', e)
    if (this.isDesigning) {
      if (this.selectedChildren && this.selectedChildren.length > 0) {
        EngineContainer.copyComp = this.selectedChildren[0] as EngineLayout
        // this.$message.success('组件已复制', 2)
        EngineContainer.isCut = false
        e.stopPropagation()
      }
    }
  }
  private async listenOnPaste(e) {
    if (!EngineContainer.copyComp) {
      return
    }
    // window.console.log('onPaste_Event')
    let compData = deepClone(await EngineContainer.copyComp.getSaveData())

    if (EngineContainer.isCut) {
      //剪切--删除原有组件
      let parentLayout = EngineContainer.copyComp.parentLayout as EngineContainer
      if (parentLayout.deleteChildComponents(EngineContainer.copyComp.Id) == true) {
        parentLayout.removeChildRecursion(EngineContainer.copyComp.Id)
      }
    } else {
      //复制操作需要给组件新Id
      compData.id = getUuid()
    }
    let compclass = findSystemCompByCode(compData.meta.compCode)
    //如果选中了一些容器类的子组件,就把当前组件复制到其中
    let findchildren = this.findSelectedLayoutsRecursion(this.children)
    let newcopyComp: EngineLayout = null
    for (let index = 0; index < findchildren.length; index++) {
      const element = findchildren[index]
      if (element.canDrop == true && (element as any).insertComponentLayout) {
        newcopyComp = await (element as EngineContainer).insertComponentLayout(compclass, compData.meta, null, compData)
        break
      }
    }
    // 如果没选中容器类的子组件, 就把当前组件复制到当前页面
    if (!newcopyComp) {
      newcopyComp = await this.insertComponentLayout(compclass, compData.meta, null, compData)
    }
    newcopyComp.loadData(compData)
    e.stopPropagation()
  }
  /**********************************底层方法 ******************************/
  private changeComponentSize(verchanged: number, horchanged: number, compId: string, position: string) {
    let comps = this.children.filter((o) => o.Id == compId)
    switch (position) {
      case 'you_xia':
        comps.filter((comp) => {
          comp.sizeChange_Down_Right(verchanged, horchanged)
        })
        break
      case 'zuo_xia':
        comps.filter((comp) => {
          comp.sizeChange_Down_Left(verchanged, horchanged)
        })
        break
      case 'you_shang':
        comps.filter((comp) => {
          comp.sizeChange_Up_Right(verchanged, horchanged)
        })
        break
      case 'zuo_shang':
        comps.filter((comp) => {
          comp.sizeChange_Up_Left(verchanged, horchanged)
        })
        break
      case 'shang':
        comps.filter((comp) => {
          comp.sizeChange_Up(verchanged)
        })
        break
      case 'xia':
        comps.filter((comp) => {
          comp.sizeChange_Down(verchanged)
        })
        break
      case 'zuo':
        comps.filter((comp) => {
          comp.sizeChange_Left(horchanged)
        })
        break
      case 'you':
        comps.filter((comp) => {
          comp.sizeChange_Right(horchanged)
        })
        break
      default:
        break
    }
  }
  /**********************************拖拽时的描边尺子 ******************************/
  private cuteNearbyPointInPage(x: number, y: number, target: EngineLayout): Point {
    let respoint: Point = { X: x, Y: y }
    for (let index = 0; index < this.children.length; index++) {
      const layout = this.children[index]
      if (layout.Id == target.Id) {
        continue
      }
      this.cuteNearbyPointToComp(layout, respoint)
    }
    return respoint
  }
  /**计算一个点相对于控件的四边，最近的距离 */
  private cuteNearbyPointToComp(childComp: EngineLayout, point: Point) {
    let size = 5
    let compLeft = childComp.left
    let compRight = childComp.left + childComp.width
    let compTop = childComp.top
    let compBottom = childComp.top + childComp.height
    if (Math.abs(point.X - compLeft) < size) {
      point.X = compLeft
      // window.console.log('感知到横向的匹配位置', point.X)
      this.drawVerRule(point.X)
    } else if (Math.abs(point.X - compRight) < size) {
      point.X = compRight
      // window.console.log('感知到横向的匹配位置', point.X)
      this.drawVerRule(point.X)
    } else {
      // this.clearVerRule()
    }

    if (Math.abs(point.Y - compTop) < size) {
      point.Y = compTop
      // window.console.log('感知到纵向的匹配位置', point.Y)
      this.drawHorRule(point.Y)
    } else if (Math.abs(point.Y - compBottom) < size) {
      point.Y = compBottom
      // window.console.log('感知到纵向的匹配位置', point.Y)
      this.drawHorRule(point.Y)
    } else {
      // this.clearHorRule()
    }
  }
  private drawHorRule(top: number) {
    if (!this.horRule) {
      let domid = getUuid()
      let dom = '<div id="' + domid + '" style="width:9999px;height:2px;background:red;position:absolute" z-index="999"></div>'
      $(this.$el).append(dom)
      this.horRule = $('#' + domid)[0]
    }
    $(this.horRule).show()
    $(this.horRule).css('top', top)
  }
  private drawVerRule(left: number) {
    if (!this.verRule) {
      let domid = getUuid()
      let dom = '<div id="' + domid + '" style="width:2px;height:9999px;background:red;position:absolute" z-index="999"></div>'
      // $(this.$el).append(dom)
      this.verRule = $('#' + domid)[0]
    }
    $(this.verRule).show()
    $(this.verRule).css('left', left)
  }
  private clearHorRule() {
    $(this.horRule).hide()
  }
  private clearVerRule() {
    $(this.verRule).hide()
  }
  // **********************************************************************
  /**添加一个组件 */
  private async insertComponentLayout(dropcompclass: any, compInfo: any, dragType?: DragItemTypeEnum, data?: SaveInfo): Promise<EngineLayout> {
    // window.console.log('绘制组件')
    // compInfo.compCode = dropcompclass.compCode
    dropcompclass.prototype.isDesigning = this.isDesigning
    let dropcomp = new dropcompclass() as EngineLayout
    dropcomp.parentLayout = this
    if (data) {
      await dropcomp.loadData(data)
    }
    dropcomp = await this.renderComponent(dropcomp)
    // window.console.error('绘制子组件失败,请不要保存!!!')
    // layerPopup.warning('绘制子组件失败,请不要保存!!!' + common.serialize(error))
    this.addChild(dropcomp)
    return dropcomp as EngineLayout
  }
  //选中子组件
  public chooseComps(comps: EngineLayout[]) {
    this.cancelCompSelected(this.children)
    comps.filter((o) => {
      o.isSelected = true
    })
  }
  //取消选中子组件
  private cancelCompSelected(comps: EngineLayout[]) {
    comps.filter((o) => {
      if (o.isSelected == true) {
        o.isSelected = false
      }
      this.cancelCompSelected(o.children)
    })
    this.isSelected = false
  }
  // *************************overrides**************************************
  protected async renderChildFromData(data: SaveInfo) {
    let compVue = findSystemCompByCode(data.meta.compCode)
    let comp = await this.insertComponentLayout(compVue, data.meta, null, data)
    await comp.loadData(data)
  }
  /*************容器渲染子组件的虚方法**********************/
  protected async renderComponent(compCon: EngineLayout): Promise<EngineLayout> {
    return compCon
  }
  protected getCompTemplateData(tempId: string): any {
    return null
  }
  //删除子级组件
  public deleteChildComponents(compId: string): boolean {
    return false
  }
}
