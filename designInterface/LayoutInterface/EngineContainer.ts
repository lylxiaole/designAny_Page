import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, SaveInfo, Point } from './EngineLayout'

import { Property, findOrginProps } from '../LayoutAttr/PropertyInfo'
import { getUuid, deepClone } from '../utils/index'
import { findSystemCompByCode } from '../LayoutAttr/ComponentInfo'

@Options({})
export class EngineContainer extends EngineLayout {
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
    if ($(compParentEle).height() - ychanged < 20) {
      // 限定最小高度
      return
    }

    if (comp.top.toString().indexOf('%') > -1) {
      comp.top = this.lenthValueToPersent($(this.$el).height(), mousetop)
    } else {
      comp.top = mousetop.toFixed(0) + 'px'
    }

    let changedHeight = $(compParentEle).height() - ychanged
    if (comp.height.toString().indexOf('%') > -1) {
      comp.height = this.lenthValueToPersent($(this.$el).height(), changedHeight)
    } else {
      comp.height = changedHeight.toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸向下变化*/
  private childSizeChange_Down(comp: EngineLayout, compParentEle: Element, ychanged: number) {
    if ($(compParentEle).height() + ychanged < 20) {
      // 限定最小高度
      return
    }

    let changedHeight = $(compParentEle).height() + ychanged
    if (comp.height.toString().indexOf('%') > -1) {
      comp.height = this.lenthValueToPersent($(this.$el).height(), changedHeight)
    } else {
      comp.height = changedHeight.toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸向左变化*/
  private childSizeChange_Left(comp: EngineLayout, compParentEle: Element, xchanged: number, mouseleft: number) {
    if ($(compParentEle).width() - xchanged < 20) {
      //限定最小宽度
      return
    }
    //
    if (comp.left.toString().indexOf('%') > -1) {
      comp.left = this.lenthValueToPersent($(this.$el).width(), mouseleft)
    } else {
      comp.left = mouseleft.toFixed(0) + 'px'
    }
    //
    let changedWidth = $(compParentEle).width() - xchanged
    if (comp.width.toString().indexOf('%') > -1) {
      comp.width = this.lenthValueToPersent($(this.$el).width(), changedWidth)
    } else {
      comp.width = changedWidth.toFixed(0) + 'px'
    }
  }
  /**对外公布方法 尺寸向右变化*/
  private childSizeChange_Right(comp: EngineLayout, compParentEle: Element, xchanged: number) {
    if ($(compParentEle).width() + xchanged < 20) {
      //限定最小宽度
      return
    }

    let changedWidth = $(compParentEle).width() + xchanged
    if (comp.width.toString().indexOf('%') > -1) {
      comp.width = this.lenthValueToPersent($(this.$el).width(), changedWidth)
    } else {
      comp.width = changedWidth.toFixed(0) + 'px'
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

    var cuteposition = this.cuteNearbyPointInContainer(mouseleft, mousetop, compId)
    if (cuteposition) {
      mouseleft = cuteposition.X
      mousetop = cuteposition.Y
    }

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

  protected changeComponentPosition(xchanged: number, ychanged: number, mouseleft: number, mousetop: number, compId: string) {
    let dragComp = this.children.find((o) => o.Id == compId)
    var cuteposition = this.cuteNearbyPointInContainer(mouseleft, mousetop, compId)

    if (cuteposition) {
      mouseleft = cuteposition.X
      mousetop = cuteposition.Y
    }

    if (dragComp.left.indexOf('%') > -1) {
      //使用百分比值布局
      dragComp.left = this.lenthValueToPersent($(this.$el).width(), mouseleft)
    } else {
      //使用单位值布局，px,rem等
      dragComp.left = mouseleft.toFixed(0) + 'px'
    }

    if (dragComp.top.indexOf('%') > -1) {
      //使用百分比值布局
      dragComp.top = this.lenthValueToPersent($(this.$el).height(), mousetop)
    } else {
      //使用单位值布局，px,rem等
      dragComp.top = mousetop.toFixed(0) + 'px'
    }
  }

  private lenthValueToPersent(parentLength: number, targetLength: number) {
    let persent = targetLength / parentLength
    return (persent * 100).toFixed(1) + '%'
  }
  private lenthStrToNumber(parentLength: number, targetLengthStr: string): number {
    if (targetLengthStr.indexOf('%')) {
      let targetPersentNumber = Number.parseFloat(targetLengthStr.replace('%', '')) / 100
      return parentLength * targetPersentNumber
    } else {
      return Number.parseFloat(targetLengthStr.replace('px', ''))
    }
  }
  /**********************************拖拽时的描边尺子 ******************************/
  private cuteNearbyPointInContainer(x: number, y: number, compId: string): Point {
    let respoint: Point = { X: x, Y: y }

    let isHit = false
    for (let index = 0; index < this.children.length; index++) {
      const layout = this.children[index]
      if (layout.Id == compId) {
        continue
      }

      if (this.hitNearbyPointToComp(layout, respoint)) {
        isHit = true
      }
    }

    if (isHit) {
      return respoint
    } else {
      return null
    }
  }
  /**计算一个点相对于控件的四边，最近的距离 */
  private hitNearbyPointToComp(childComp: EngineLayout, point: Point): boolean {
    let size = 5
    console.log('hitNearbyPointToComp:', 1111)
    let compLeft = this.lenthStrToNumber($(this.$el).width(), childComp.left)
    let compRight = compLeft + this.lenthStrToNumber($(this.$el).width(), childComp.width)
    let compTop = this.lenthStrToNumber($(this.$el).height(), childComp.top)
    let compBottom = compTop + this.lenthStrToNumber($(this.$el).height(), childComp.height)

    let isHit = false
    if (Math.abs(point.X - compLeft) < size) {
      point.X = compLeft
      this.drawVerRule(point.X)
      isHit = true
    } else if (Math.abs(point.X - compRight) < size) {
      point.X = compRight
      this.drawVerRule(point.X)
      isHit = true
    }

    if (Math.abs(point.Y - compTop) < size) {
      point.Y = compTop
      this.drawHorRule(point.Y)
      isHit = true
    } else if (Math.abs(point.Y - compBottom) < size) {
      point.Y = compBottom
      this.drawHorRule(point.Y)
      isHit = true
    }

    if (isHit === false) {
      this.clearHorRule()
      this.clearVerRule()
    }
    return isHit
  }
  private drawHorRule(top: number) {
    if (!this.horRule) {
      let domid = getUuid()
      let dom = '<div id="' + domid + '" style="width:9999px;height:1px;background:red;position:absolute" z-index="999"></div>'
      $(this.$el).append(dom)
      this.horRule = $('#' + domid)[0]
    }
    $(this.horRule).show()
    $(this.horRule).css('top', top)
  }
  private drawVerRule(left: number) {
    if (!this.verRule) {
      let domid = getUuid()
      let dom = '<div id="' + domid + '" style="width:1px;height:9999px;background:red;position:absolute" z-index="999"></div>'
      $(this.$el).append(dom)
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
  // ************************* **************************************
  protected override async renderChildFromData(data: SaveInfo) {
    await super.renderChildFromData(data)
    let compVue = findSystemCompByCode(data.meta.compCode)
    await this.insertComponentLayout(compVue, data.meta, null, data)
  }

  public async insertComponentLayout(dropcompclass: any, compInfo: any, dragType?: any, data?: SaveInfo): Promise<EngineLayout> {
    let dropcomp = dropcompclass
    dropcomp = await this.renderComponent(dropcomp)
    dropcomp.parentLayout = this
    // window.console.error('绘制子组件失败,请不要保存!!!')
    // layerPopup.warning('绘制子组件失败,请不要保存!!!' + common.serialize(error))
    this.addChild(dropcomp)
    await dropcomp.loadData(data)
    return dropcomp as EngineLayout
  }
  /*************容器渲染子组件的虚方法**********************/
  protected async renderComponent(compCon: EngineLayout): Promise<EngineLayout> {
    return compCon
  }
  protected getCompTemplateData(tempId: string): any {
    return null
  }
}
