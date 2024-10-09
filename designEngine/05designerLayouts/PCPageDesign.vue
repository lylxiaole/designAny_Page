<template>
  <div :style="{ position: 'relative', width: width, height: height, left: left, top: top, background: backgroundCute, padding: '0px' }" oncontextmenu="self.event.returnValue=false" style="border-radius: 0px"></div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { deepClone, getUuid } from '@common/utils'
import DesignShell from './DesignShell.vue'
import DesignEvents, { DragItemData, DragItemTypeEnum } from './DesignEvents'

import { EnginePage, EngineLayout, EngineComponent, EngineContainer } from '@design-any/interface/dist/LayoutInterface'
import { findSystemCompByCode } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import paltform from '@design-any/interface/dist/enums/paltform'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import applicationContext from '../01designerContext/context'
import { toRaw } from 'vue'

enum stackType {
  propChanged = 'propChanged',
  addChild = 'addChild',
  removeChild = 'removeChild'
}

class changeStack {
  type: stackType
  layoutId: string
  propField: string | undefined
  childId: string | undefined
  val: any
}

@DPageAttr(paltform.webpc, 'design')
@Options({})
export default class PCPageDesign extends EnginePage {
  private get backgroundCute(): string {
    // window.console.log('backgroundCute:', this.background_img)
    if (!this.background_img || this.background_img.length < 1) {
      return this.background
    }
    return 'url("' + this.applicationContext.getFileApiAddr(this.background_img[0].uid) + '")'
  }
  public allShells: DesignShell[] = []
  public isDesigning: boolean = true
  private designEvets: DesignEvents = null

  mounted() {
    this.designEvets = new DesignEvents(this)
    this.designEvets.canDrag = false
    this.designEvets.canDrop = true
    this.designEvets.onDrop_Event = this.listenOnDrop
    this.designEvets.onDragMove_Event = this.listenOnDragMove
    this.designEvets.onDelete_Event = this.listenOnDeleteKey

    this.designEvets.onCut_Event = this.listenOnCut
    this.designEvets.onCopy_Event = this.listenOnCopy
    this.designEvets.onPaste_Event = this.listenOnPaste
    this.designEvets.onMouseMove_Event = this.listenOnMousemove
    this.designEvets.onClick_Event = this.listenOnClick
    this.designEvets.onChangedScale_Event = this.listenOnChangedScale_Event
    this.designEvets.onDragSelf_Event = this.listenOnDragSelf_Event
  }
  protected override loadCompleted(): void {
    super.loadCompleted()
    this.startListenEngineChange(this)
  }
  protected override async renderComponent(compCon: EngineComponent): Promise<EngineComponent> {
    if (!compCon) {
      debugger
    }
    let { virtualDom, vueComp } = designDrawDomVirtual(DesignShell, true, { applicationContext: applicationContext })
    this.allShells.push(vueComp as DesignShell)
    // ***************************************
    let resComp = (vueComp as DesignShell).addComponent(compCon)
    resComp.$once('onLYLMounted', () => {
      ;(vueComp as DesignShell).startListenItemDrag()
    })
    resComp.$once('onLYLDestroyed', () => {
      let findIndex = this.allShells.findIndex((o) => o == vueComp)
      this.allShells.splice(findIndex, 1)
      ;(vueComp as DesignShell).destorymethod()
    })
    // ***************************************
    $(this.$el).append(virtualDom)
    return resComp
  }
  /**********************************监听设计事件 ******************************/
  private listenOnMousemove(e: MouseEvent) {}

  private listenOnChangedScale_Event(sizechange: number): boolean {
    this.scaleSize(sizechange)
    this.designEvets.setCurrentScaleSize(sizechange)
    return false
  }

  private listenOnDragSelf_Event(xmove: number, ymove: number) {
    this.left += xmove
    this.top += ymove
    this.$forceUpdate()
  }
  private async listenOnDrop(el: Element, container: Element, screenLeft: number, screenTop: number, dragdata: DragItemData<any>): Promise<boolean> {
    // window.console.log('listenOnDrop:', 1)
    if (!dragdata) {
      return true
    }

    let compInfo = dragdata.dragData as any
    if (!compInfo) {
      return true
    }

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
      let persentleft = screenLeft / $(this.$el).width()
      dropcomp.left = (persentleft * 100).toFixed(1) + '%'

      let persenttop = screenTop / $(this.$el).height()
      dropcomp.top = (persenttop * 100).toFixed(1) + '%'
    }
    return false
  }
  protected listenOnDragMove(xchanged: number, ychanged: number, mouseleft: number, mousetop: number, el: Element, dragdata?: DragItemData<any>): boolean {
    // window.console.log('listenOnDragMove:', dragdata)
    if (!dragdata) {
      return true
    }
    let compInfo = dragdata.dragData as any
    if (!compInfo) {
      return true
    }
    let dragComp = this.findLayoutRecursion(compInfo.compId, this.children) as EngineLayout
    if (!dragComp) {
      return false
    }
    // console.log('-------------------------', left, $(this.$el).offset().left)
    if (dragdata.type == DragItemTypeEnum.dragmove_component_inpage) {
      this.changeComponentPosition(xchanged, ychanged, mouseleft, mousetop, compInfo.compId)
      return false
    } else if (dragdata.type == DragItemTypeEnum.drag_component_size) {
      // 在容器内拖拽组件大小
      let shell = this.allShells.find((o) => o.component.Id === compInfo.compId)
      this.changeComponentSize(xchanged, ychanged, mouseleft, mousetop, compInfo.compId, shell.$el, compInfo.position)
      return false
    }
    return true
  }
  // **************************************************************************
  private listenOnDeleteKey(e: Event) {
    e.preventDefault()
    if (this.selectedChildren.length > 0) {
      e.stopPropagation()
    }

    let selectedChildren = this.selectedChildren
    this.chooseComps([])
    for (let index = 0; index < selectedChildren.length; index++) {
      const comp = selectedChildren[index]
      this.removeChildRecursion(comp.Id)
    }
  }
  private listenOnCut(e) {
    if (this.selectedChildren && this.selectedChildren.length > 0) {
      DesignEvents.copyComp = this.selectedChildren[0] as EngineLayout
      // this.$message.success('组件已剪切', 2)
      DesignEvents.isCut = true
      e.stopPropagation()
    }
  }
  private listenOnCopy(e) {
    window.console.log('listenOnCopy:', e)
    if (this.selectedChildren && this.selectedChildren.length > 0) {
      DesignEvents.copyComp = this.selectedChildren[0] as EngineLayout
      // this.$message.success('组件已复制', 2)
      DesignEvents.isCut = false
      e.stopPropagation()
    }
  }
  private async listenOnPaste(e) {
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
    let newcopyComp = await this.insertComponentLayout(compclass, compData.meta, null, compData)

    let selfPosition = $(newcopyComp.$el).offsetParent().position() //offsetParent是因为DesignShell中的蒙版
    //定位
    let persentleft = (selfPosition.left + 5) / $(this.$el).width()
    newcopyComp.left = (persentleft * 100).toFixed(1) + '%'

    let persenttop = (selfPosition.top + 5) / $(this.$el).height()
    newcopyComp.top = (persenttop * 100).toFixed(1) + '%'

    this.chooseComps([newcopyComp])
    e.stopPropagation()
  }
  // *******************************监听数据变化,可用于撤销，前进,保存*********************
  private changeStack_left: changeStack[] = []
  private changeStack_right: changeStack[] = []
  private changeFromStack: boolean = false
  private propOldValCache: any[] = []
  private cacheOldVal(layoutId, fieldId, val) {
    val = JSON.stringify(val)
    let cacheval = this.propOldValCache.find((o) => o.layoutId === layoutId && o.fieldId === fieldId)
    if (!cacheval) {
      this.propOldValCache.push({ layoutId: layoutId, fieldId: fieldId, val: val })
    } else {
      cacheval.val = val
    }
  }
  private getCacheOldVal(layoutId, fieldId) {
    let cacheval = this.propOldValCache.find((o) => o.layoutId === layoutId && o.fieldId === fieldId)
    if (!cacheval) {
      throw '出问题了'
    } else {
      return JSON.parse(cacheval.val)
    }
  }
  private async startListenEngineChange(layout: EngineLayout) {
    await this.$nextTick()
    for (let index = 0; index < layout.properties.length; index++) {
      const property = layout.properties[index]
      let oldVal = layout[property.field]
      this.cacheOldVal(layout.Id, property.field, oldVal)
      layout.$watch(
        property.field,
        (newval) => {
          let oldVal = this.getCacheOldVal(layout.Id, property.field)
          this.whileLayoutPropertyValChanged(layout.Id, property.field, oldVal, newval)
          this.cacheOldVal(layout.Id, property.field, newval)
        },
        { deep: true }
      )
    }

    layout.$on('onLYLRemoveChild', this.whileLayoutRemoveChild)
    layout.$on('onLYLAddChild', this.whileLayoutAddChild)

    if (layout.children && layout.children.length > 0) {
      for (let index = 0; index < layout.children.length; index++) {
        const childrenLayout = layout.children[index]
        await this.startListenEngineChange(childrenLayout)
      }
    }
  }

  private whileLayoutPropertyValChanged(layoutId, field, oldval, newval) {
    this.isNeedSave = true
    if (this.changeFromStack) {
      return
    }
    console.log('whileLayoutPropertyValChanged:', layoutId, field, oldval, newval)
    this.changeStack_left.unshift({ type: stackType.propChanged, childId: undefined, layoutId: layoutId, propField: field, val: { oldval: oldval, newval: newval } })
  }
  private whileLayoutRemoveChild(layoutId, childId, childData) {
    this.isNeedSave = true
    if (this.changeFromStack) {
      return
    }
    console.log('whileLayoutRemoveChild:', layoutId, childId, childData)
    this.changeStack_left.unshift({ type: stackType.removeChild, childId: childId, layoutId: layoutId, propField: undefined, val: childData })
  }
  private whileLayoutAddChild(layoutId, childId, childData) {
    this.isNeedSave = true
    if (this.changeFromStack) {
      return
    }
    console.log('whileLayoutAddChild:', layoutId, childId, childData)
    this.changeStack_left.unshift({ type: stackType.addChild, childId: childId, layoutId: layoutId, propField: undefined, val: childData })
  }

  public get canToPreStack() {
    if (this.changeStack_left && this.changeStack_left.length > 0) {
      return true
    } else {
      return false
    }
  }
  public get canToNextStack() {
    if (this.changeStack_right && this.changeStack_right.length > 0) {
      return true
    } else {
      return false
    }
  }
  public async toPreStack() {
    if (this.changeStack_left && this.changeStack_left.length > 0) {
      this.changeFromStack = true
      try {
        let stack = this.changeStack_left[0]
        let findLayout = this.findLayoutRecursion(stack.layoutId, [this])
        console.log('toPreStack:', stack)
        if (stack.type === stackType.propChanged) {
          findLayout[stack.propField] = stack.val.oldval
        } else if (stack.type === stackType.addChild) {
          await findLayout.removeChildRecursion(stack.childId)
        } else if (stack.type === stackType.removeChild) {
          await findLayout.loadChildrenData([stack.val])
        }
        this.changeStack_left.splice(0, 1)
        this.changeStack_right.unshift(stack)
      } catch (error) {}
      await this.$nextTick()
      this.changeFromStack = false
    }
  }
  public async toNextStack() {
    if (this.changeStack_right && this.changeStack_right.length > 0) {
      this.changeFromStack = true
      try {
        let stack = this.changeStack_right[0]
        let findLayout = this.findLayoutRecursion(stack.layoutId, [this])
        if (stack.type === stackType.propChanged) {
          findLayout[stack.propField] = stack.val.newval
        } else if (stack.type === stackType.addChild) {
          await findLayout.loadChildrenData([stack.val])
        } else if (stack.type === stackType.removeChild) {
          await findLayout.removeChildRecursion(stack.childId)
        }

        this.changeStack_right.splice(0, 1)
        this.changeStack_left.unshift(stack)
      } catch (error) {}
      await this.$nextTick()
      this.changeFromStack = false
    }
  }
  // ******************************************************
  private listenOnClick(e: Event, target: any) {
    this.chooseComps([])
  }
  // ******************************************************
  public closeDesign() {
    this.destorymethod()
  }
}
</script>

<style lang="less" scoped>
// .container {
//   padding: 0px;
//   background: transparent;
//   border: none;
//   border-radius: 0px;
// }
</style>
