import { Options, Vue } from 'vue-class-component'
import { ref, h, render, onMounted } from 'vue'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import EngineLayout, { SaveInfo, Point } from './EngineLayout'

import { Property } from './commonClasses/PropertyInfo'
import { getUuid, deepClone, serialize } from '@common/utils'
import { findSystemCompByCode } from './commonClasses/ComponentInfo'
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

  created() {}
  mounted() {}
  /**********************************底层拖拽改变尺寸方法 ******************************/
  /**对外公布方法 尺寸向上变化*/
  private childSizeChange_Up(comp: EngineLayout, compParentEle: Element, ychanged: number, mousetop: number) {
    if ($(compParentEle).height() - ychanged >= 20) {
      comp.top = mousetop.toFixed(0) + 'px'
      comp.height = ($(compParentEle).height() - ychanged).toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸向下变化*/
  private childSizeChange_Down(comp: EngineLayout, compParentEle: Element, ychanged: number) {
    if ($(compParentEle).height() + ychanged >= 20) {
      comp.height = ($(compParentEle).height() + ychanged).toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸向左变化*/
  private childSizeChange_Left(comp: EngineLayout, compParentEle: Element, xchanged: number, mouseleft: number) {
    if ($(compParentEle).width() - xchanged >= 20) {
      comp.left = mouseleft.toFixed(0) + 'px'
      comp.width = ($(compParentEle).width() - xchanged).toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸向右变化*/
  private childSizeChange_Right(comp: EngineLayout, compParentEle: Element, xchanged: number) {
    let compLeft = $(compParentEle).position().left + $(compParentEle).width()

    if ($(compParentEle).width() + xchanged >= 20) {
      comp.width = ($(compParentEle).width() + xchanged).toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸左上变化*/
  private sizeChange_Up_Left(comp: EngineLayout, compParentEle: Element, ychanged: number, xchanged: number, mousetop: number, mouseleft: number) {
    this.childSizeChange_Up(comp, compParentEle, ychanged, mousetop)
    this.childSizeChange_Left(comp, compParentEle, xchanged, mouseleft)
  }
  /**对外公布方法 尺寸右上变化*/
  private sizeChange_Up_Right(comp: EngineLayout, compParentEle: Element, ychanged: number, xchanged: number, mousetop: number) {
    this.childSizeChange_Up(comp, compParentEle, ychanged, mousetop)
    this.childSizeChange_Right(comp, compParentEle, xchanged)
  }
  /**对外公布方法 尺寸左下变化*/
  private sizeChange_Down_Left(comp: EngineLayout, compParentEle: Element, ychanged: number, xchanged: number, mouseleft: number) {
    this.childSizeChange_Down(comp, compParentEle, ychanged)
    this.childSizeChange_Left(comp, compParentEle, xchanged, mouseleft)
  }
  /**对外公布方法 尺寸右下变化*/
  private sizeChange_Down_Right(comp: EngineLayout, compParentEle: Element, ychanged: number, xchanged: number) {
    this.childSizeChange_Down(comp, compParentEle, ychanged)
    this.childSizeChange_Right(comp, compParentEle, xchanged)
  }
  protected changeComponentSize(xchanged: number, ychanged: number, mouseleft: number, mousetop: number, compId: string, compParentEle: Element, position: string) {
    let comps = this.children.filter((o) => o.Id == compId)
    switch (position) {
      case 'you_xia':
        comps.filter((comp) => {
          this.sizeChange_Down_Right(comp, compParentEle, ychanged, xchanged)
        })
        break
      case 'zuo_xia':
        comps.filter((comp) => {
          this.sizeChange_Down_Left(comp, compParentEle, ychanged, xchanged, mouseleft)
        })
        break
      case 'you_shang':
        comps.filter((comp) => {
          this.sizeChange_Up_Right(comp, compParentEle, ychanged, xchanged, mousetop)
        })
        break
      case 'zuo_shang':
        comps.filter((comp) => {
          this.sizeChange_Up_Left(comp, compParentEle, ychanged, xchanged, mousetop, mouseleft)
        })
        break
      case 'shang':
        comps.filter((comp) => {
          this.childSizeChange_Up(comp, compParentEle, ychanged, mousetop)
        })
        break
      case 'xia':
        comps.filter((comp) => {
          this.childSizeChange_Down(comp, compParentEle, ychanged)
        })
        break
      case 'zuo':
        comps.filter((comp) => {
          this.childSizeChange_Left(comp, compParentEle, xchanged, mouseleft)
        })
        break
      case 'you':
        comps.filter((comp) => {
          this.childSizeChange_Right(comp, compParentEle, xchanged)
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
