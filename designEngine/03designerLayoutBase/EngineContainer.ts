import { Options, Vue } from 'vue-class-component'
import { ref, h, render, onMounted } from 'vue'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import EngineLayout, { SaveInfo, Point } from './EngineLayout'

import { Property } from './commonClasses/LayoutProperty'
import { getUuid, deepClone, serialize } from '@common/utils'
import { findSystemCompByCode } from './commonClasses/componentInfos'
import { EnginePage } from '.'
import dragHelper from '@designEngine/02common/dragHelper_new'

@Options({})
export default class EngineContainer extends EngineLayout {
  //横向尺子
  private horRule: Element = null
  //纵向尺子
  private verRule: Element = null
  //当前页面的缩放尺寸
  public currentScaleSize: number = 1

  created() {
    // this.onDrop_Event = this.listenOnDrop
    // this.onDragMove_Event = this.listenOnDragMove
    // this.onDelete_Event = this.listenOnDeleteKey
    // this.onDragEnd_Event = this.listenOnDragEnd
    // this.onCut_Event = this.listenOnCut
    // this.onCopy_Event = this.listenOnCopy
    // this.onPaste_Event = this.listenOnPaste
    // this.onMouseMove_Event = this.listenOnMousemove
  }

  mounted() {}

  /**********************************底层方法 ******************************/
  protected changeComponentSize(horchanged: number, verchanged: number, compId: string, position: string) {
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
  public clearHorRule() {
    $(this.horRule).hide()
  }
  public clearVerRule() {
    $(this.verRule).hide()
  }
  // **********************************************************************
  /**添加一个组件 */
  public async insertComponentLayout(dropcompclass: any, compInfo: any, dragType?: any, data?: SaveInfo): Promise<EngineLayout> {
    // window.console.log('绘制组件')
    // compInfo.compCode = dropcompclass.compCode
    // let dropcomp = new dropcompclass() as EngineLayout
    let dropcomp = h(dropcompclass) as any

    dropcomp = await this.renderComponent(dropcomp)

    dropcomp.parentLayout = this
    dropcomp.prototype = { $Meta: dropcompclass.prototype.$Meta }
    // window.console.error('绘制子组件失败,请不要保存!!!')
    // layerPopup.warning('绘制子组件失败,请不要保存!!!' + common.serialize(error))
    this.addChild(dropcomp)

    await dropcomp.loadData(data)

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
  protected override async renderChildFromData(data: SaveInfo) {
    await super.renderChildFromData(data)
    let compVue = findSystemCompByCode(data.meta.compCode)
    let comp = await this.insertComponentLayout(compVue, data.meta, null, data)
  }
  /*************容器渲染子组件的虚方法**********************/
  protected async renderComponent(compCon: EngineLayout): Promise<EngineLayout> {
    return compCon
  }
  protected getCompTemplateData(tempId: string): any {
    return null
  }
}
