import LayoutBase, { SaveInfo, Point } from './LayoutBase'
import { DragItemData, DragItemTypeEnum } from './BaseEvents'
import { Component, Prop, Vue, Emit, Watch, Provide } from 'vue-property-decorator'

import { Property } from './commonClasses/LayoutProperty'
import common from '../02common/commonMethod'
import { ComponentBase } from '../03designerLayoutBase'
import { findSystemComp, findSystemCompByCode } from '../04designerComponents'

export default class LayoutContainer extends LayoutBase {
  //横向尺子
  private horRule: Element = null
  //纵向尺子
  private verRule: Element = null
  //当前页面的缩放尺寸
  public currentScaleSize: number = 1
  private static copyComp: ComponentBase
  private static isCut: boolean = false

  private mouseX: number = 0
  private mouseY: number = 0

  mounted() {
    if (this.IsDesigning) {
      this.onDrop_Event = this.listenOnDrop
      this.onDragMove_Event = this.listenOnDragMove
      this.onDelete_Event = this.onDeleteKey
      this.onDragEnd_Event = this.listenOnDragEnd

      this.onCut_Event = (e) => {
        if (this.IsDesigning) {
          if (this.selectedChildren && this.selectedChildren.length > 0) {
            LayoutContainer.copyComp = this.selectedChildren[0] as ComponentBase
            // this.$message.success('组件已剪切', 2)
            LayoutContainer.isCut = true
            e.stopPropagation()
          }
        }
      }
      this.onCopy_Event = (e) => {
        if (this.IsDesigning) {
          if (this.selectedChildren && this.selectedChildren.length > 0) {
            LayoutContainer.copyComp = this.selectedChildren[0] as ComponentBase
            // this.$message.success('组件已复制', 2)
            LayoutContainer.isCut = false
            e.stopPropagation()
          }
        }
      }
      this.onPaste_Event = (e) => {
        if (!LayoutContainer.copyComp) {
          return
        }
        // window.console.log('onPaste_Event')
        let compData = common.clone(LayoutContainer.copyComp.GetSaveData())

        if (LayoutContainer.isCut) {
          //剪切--删除原有组件
          let parentLayout = LayoutContainer.copyComp.parentLayout as LayoutContainer
          if (parentLayout.deleteChildComponents(LayoutContainer.copyComp.Id) == true) {
            parentLayout.RemoveChildRecursion(LayoutContainer.copyComp.Id)
          }
        } else {
          //复制操作需要给组件新Id
          compData.id = common.getUuid()
        }
        let compclass = findSystemComp(compData.layoutInfo.groupName, compData.layoutInfo.name)
        //为了准确性
        let findchildren = this.FindSelectedLayoutsRecursion()
        let newcopyComp: LayoutBase = null
        for (let index = 0; index < findchildren.length; index++) {
          const element = findchildren[index]
          if (element.canDrop == true && (element as any).insertComponentLayout) {
            newcopyComp = (element as any).insertComponentLayout(compclass, compData.layoutInfo, null, compData)
            break
          }
        }

        if (!newcopyComp) {
          newcopyComp = this.insertComponentLayout(compclass, compData.layoutInfo, null, compData)
        }
        newcopyComp.LoadData(compData)

        // newcopyComp.$once('onMounted', (layout: ComponentBase) => {
        //   if (LayoutContainer.isCut == false) {
        //     /**粘贴操作需要重新刷新所有Id,并让组件的Id跟渲染钱一致 */
        //     newcopyComp.RefreshAllIdRecursion()
        //     newcopyComp.Id = compData.id
        //   }

        //   newcopyComp.top = this.mouseY
        //   newcopyComp.left = this.mouseX
        //   // this.$message.success('组件已粘贴', 2)
        //   LayoutContainer.copyComp = null
        // })
        e.stopPropagation()
      }
      this.onMouseMove_Event = this.onMouseMoveE
    }
  }

  /**********************************privates ******************************/
  private onMouseMoveE(e: MouseEvent) {
    this.mouseX = e.offsetX
    this.mouseY = e.offsetY
  }

  private listenOnDrop(el: Element, targetContainer: Element, screenLeft: number, screenTop: number, dragdata: DragItemData<any>): boolean {
    //window.console.log('listenOnDrop', dragdata)
    if (!dragdata) {
      return true
    }
    let compInfo = dragdata.dragData as any
    if (!compInfo) {
      return true
    }
    // window.console.log('$(this._dragHelper.dragCloneElement).offset()', $(this._dragHelper.dragCloneElement).offset())
    screenLeft = $(this._dragHelper.dragCloneElement).offset().left
    screenTop = $(this._dragHelper.dragCloneElement).offset().top
    let dropcomp: LayoutBase = null

    switch (dragdata.type) {
      case DragItemTypeEnum.drop_system_component:
        {
          let compclass = findSystemComp(compInfo.groupName, compInfo.name)
          if (!compclass) {
            break
          }
          dropcomp = this.insertComponentLayout(compclass, compInfo, dragdata.type)
          if (dropcomp) {
            dropcomp.LoadData(null)
          }
        }
        break
      case DragItemTypeEnum.drop_component_template:
        {
          let compclass = findSystemComp(compInfo.groupName, compInfo.name)
          if (!compclass) {
            break
          }
          dropcomp = this.insertComponentLayout(compclass, compInfo, dragdata.type)
          let compdata = this.getCompTemplateData(compInfo.sourceId)
          if (dropcomp) {
            dropcomp.LoadData(compdata)
            // dropcomp.$once('onMounted', (layout: LayoutBase) => {
            //   dropcomp.RefreshAllIdRecursion()
            // })
          }
        }
        break
      case DragItemTypeEnum.drag_gridLayout_col:
        {
          let compId = compInfo['compId']
          if (!compId) {
            return true
          }
          let oldcomp = this.FindLayoutRecursion(compId)

          let compclass = findSystemComp(compInfo.groupName, compInfo.name)
          if (!compclass) {
            break
          }
          dropcomp = this.insertComponentLayout(compclass, compInfo, dragdata.type)
          if (dropcomp) {
            dropcomp.LoadData(null)
            this.RemoveChildRecursion(compId)
          }
        }
        break
      case DragItemTypeEnum.drop_model_component:
        {
          compInfo.groupName = '内容展示'
          compInfo.name = '表单'
          let compclass = findSystemComp(compInfo.groupName, compInfo.name)
          if (!compclass) {
            break
          }
          dropcomp = this.insertComponentLayout(compclass, compInfo, dragdata.type)
          if (dropcomp) {
            dropcomp.LoadData(null)
          }
          // window.console.log('模型组件', compInfo.modelDetail)
          // dropcomp = this.insertModelComponentLayout(compInfo.modelDetail)
          // dropcomp.layoutInfo = new LayoutInfo(LayoutType.system_component, '内容展示', '表单', null, 'icon-kapian')
          // dropcomp.$once('onMounted', () => {
          //   dropcomp.makeFormByModelDetail(compInfo.modelDetail)
          // })
        }
        break
      default:
        break
    }
    if (dropcomp) {
      // dropcomp.left = (screenLeft - $(this.$el).offset().left) / this.currentScaleSize
      // dropcomp.top = (screenTop - $(this.$el).offset().top) / this.currentScaleSize
    }
    // window.console.log('感知到drop', this.Id)
    return false
  }

  public onDeleteKey(e: Event) {
    e.preventDefault()
    // window.console.log('按了删除键', this.name)

    if (this.selectedChildren.length > 0) {
      e.stopPropagation()
    }
    for (let index = 0; index < this.selectedChildren.length; index++) {
      const comp = this.selectedChildren[index]
      if (this.deleteChildComponents(comp.Id) == true) {
        this.RemoveChildRecursion(comp.Id)
      }
    }
  }

  protected listenOnDragMove(xchanged: number, ychanged: number, left: number, top: number, el: Element, dragdata?: DragItemData<any>): boolean {
    //  window.console.log('listenOnDragMove')
    if (!dragdata) {
      return true
    }
    let compInfo = dragdata.dragData as any
    if (!compInfo) {
      return true
    }
    /** */
    let dragComp = this.FindLayout(compInfo.compId) as ComponentBase
    // window.console.log('*****感知拖拽，容器Id=' + this.Id + '***组件Id=', compInfo.compId)
    if (!dragComp) {
      return false
    }

    let parentPageCurrentScaleSize = dragComp.parentPage.currentScaleSize
    /**do */
    if (dragdata.type == DragItemTypeEnum.dragmove_component_inpage) {
      /**范围控制 */
      if (left + dragComp.width * parentPageCurrentScaleSize < 10) {
        left = 10
      } else if (left > this.width * parentPageCurrentScaleSize - 10) {
        left = this.width * parentPageCurrentScaleSize - 10
      }

      if (top + dragComp.height * parentPageCurrentScaleSize < 10) {
        top = 10
      } else if (top > this.height * parentPageCurrentScaleSize - 10) {
        // window.console.log('this.height=', this.height)
        top = this.height * parentPageCurrentScaleSize - 10
        // window.console.log('cute top=', top)
      }
      // window.console.log('currentScaleSize=', parentPageCurrentScaleSize)
      left = left / parentPageCurrentScaleSize
      top = top / parentPageCurrentScaleSize
      dragComp.left = left
      dragComp.top = top
      // window.console.log('before cute end point' + dragComp.left + '-' + dragComp.top + '')
      let newpoint = this.cuteNearbyPointInPage(left, top, dragComp)
      dragComp.left = newpoint.X
      dragComp.top = newpoint.Y
      // window.console.log('after cute end point' + dragComp.left + '-' + dragComp.top + '')
      return false
    } else if (dragdata.type == DragItemTypeEnum.drag_component_size) {
      xchanged = xchanged / parentPageCurrentScaleSize
      ychanged = ychanged / parentPageCurrentScaleSize
      this.changeComponentSize(ychanged, xchanged, compInfo.compId, compInfo.position)
      // window.console.log(compInfo.position)
      return false
    }
    //else {
    //   return this.onListenDragMoveExtand(xchanged, ychanged, left, top, el, dragdata)
    // }
    return true
  }

  private changeComponentSize(verchanged: number, horchanged: number, compId: string, position: string) {
    let comps = this.children.filter((o) => o.Id == compId)
    switch (position) {
      case 'you_xia':
        comps.filter((comp) => {
          comp.SizeChange_Down_Right(verchanged, horchanged)
        })
        break
      case 'zuo_xia':
        comps.filter((comp) => {
          comp.SizeChange_Down_Left(verchanged, horchanged)
        })
        break
      case 'you_shang':
        comps.filter((comp) => {
          comp.SizeChange_Up_Right(verchanged, horchanged)
        })
        break
      case 'zuo_shang':
        comps.filter((comp) => {
          comp.SizeChange_Up_Left(verchanged, horchanged)
        })
        break
      case 'shang':
        comps.filter((comp) => {
          comp.SizeChange_Up(verchanged)
        })
        break
      case 'xia':
        comps.filter((comp) => {
          comp.SizeChange_Down(verchanged)
        })
        break
      case 'zuo':
        comps.filter((comp) => {
          comp.SizeChange_Left(horchanged)
        })
        break
      case 'you':
        comps.filter((comp) => {
          comp.SizeChange_Right(horchanged)
        })
        break
      default:
        break
    }
  }

  private cuteNearbyPointInPage(x: number, y: number, target: LayoutBase): Point {
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
  private cuteNearbyPointToComp(childComp: LayoutBase, point: Point) {
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
      let domid = common.getUuid()
      let dom = '<div id="' + domid + '" style="width:9999px;height:2px;background:red;position:absolute" z-index="999"></div>'
      // $(this.$el).append(dom)
      this.horRule = $('#' + domid)[0]
    }
    $(this.horRule).show()
    $(this.horRule).css('top', top)
  }

  private drawVerRule(left: number) {
    if (!this.verRule) {
      let domid = common.getUuid()
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

  private listenOnDragEnd() {
    this.clearHorRule()
    this.clearVerRule()
  }

  /************************************publics***********************/
  public chooseComps(comps: LayoutBase[]) {
    this.cancelCompSelected(this.children)

    comps.filter((o) => {
      o.isSelected = true
    })
  }

  private cancelCompSelected(comps: LayoutBase[]) {
    comps.filter((o) => {
      if (o.isSelected == true) {
        o.isSelected = false
      }
      this.cancelCompSelected(o.children)
    })
    this.isSelected = false
  }

  // *************************overrides****************************************************************************
  protected renderChildFromData(data: SaveInfo) {
    // let compclass = findSystemComp(data.layoutInfo.groupName, data.layoutInfo.name)
    // if (!compclass) {
    //   return
    // }
    // let comp = this.insertComponentLayout(compclass, data.layoutInfo, null, data)
    // if (comp) {
    //   comp.LoadData(data)
    // }
  }

  /************************************virtuals***********************/
  protected renderComponent(compCon: LayoutBase, layoutInfo: any, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    return compCon
  }

  public deleteChildComponents(compId: string): boolean {
    return false
  }

  protected onListenDragMoveExtand(xchanged: number, ychanged: number, left: number, top: number, el: Element, dragdata?: DragItemData<any>): boolean {
    return true
  }

  /************************************protected***********************/
  protected getCompTemplateData(tempId: string): any {
    return null
  }

  /**添加一个组件 */
  public insertComponentLayout(dropcompclass: any, compInfo: any, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    // window.console.log('绘制组件')
    compInfo.compCode = dropcompclass.compCode
    let dropcomp = new dropcompclass()
    dropcomp.parentLayout = this
    dropcomp.layoutInfo = compInfo

    dropcomp = this.renderComponent(dropcomp, compInfo, dragType, data)
    if (!dropcomp.parentPage) {
      window.console.warn('绘制子组件异常！')
      return null
    }
    // window.console.error('绘制子组件失败,请不要保存!!!')
    // layerPopup.warning('绘制子组件失败,请不要保存!!!' + common.serialize(error))
    this.addChild(dropcomp)
    if (dropcomp) {
      dropcomp.$on('onChildrenCountChange', this.onComponentChildrenCountChange)
      dropcomp.$on('onComponentChildrenCountChange', this.onComponentChildrenCountChange)
      dropcomp.$on('onPropertyChanged', this.onComponentPropertyChanged)
      dropcomp.$on('onComponentPropertyChanged', this.onComponentPropertyChanged)
    }

    return dropcomp as LayoutBase
  }

  /************************************Emits***********************/

  protected onComponentPropertyChanged(propertyId: string, property: Property, comp: LayoutBase): void {}

  protected onComponentChildrenCountChange(): void {}

  //是否需要重绘，目前只有表格组件需要重绘
  protected isNeedRecalculate: boolean = false

  //缩放结束事件
  protected onAfterResize(): void {}
}
