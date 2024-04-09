<template>
  <div :style="{position:'relative','width':width,'height':height,'left':left,'top':top ,'background':backgroundCute,'padding':'0px' }"
    oncontextmenu="self.event.returnValue=false" style="border-radius:0px">
  </div>
</template>

<script lang="ts" >
import { Options, Vue } from 'vue-class-component'
import { SaveInfo, Point } from '../03designerLayoutBase/EngineLayout'

import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineLayout, EngineComponent, EngineContainer } from '../03designerLayoutBase'
import { drawVueOnVirtualDom, BuildingFileUrlForShow, deepClone, getUuid } from '@common/utils'
import DesignShell from './DesignShell.vue'
import DesignEvents, { DragItemData, DragItemTypeEnum } from './DesignEvents'
import dragHelper from '@designEngine/02common/dragHelper_new'
import { findSystemCompByCode } from '@designEngine/03designerLayoutBase/commonClasses/componentInfos'
import { parseInt } from 'lodash-es'

@Options({})
export default class PCPageDesign extends EnginePage {
  private get backgroundCute(): string {
    // window.console.log('backgroundCute:', this.background_img)
    if (!this.background_img || !this.background_img.uid) {
      return this.background
    }
    return 'url("' + BuildingFileUrlForShow(this.background_img.uid) + '")'
  }
  public allShells: DesignShell[] = []
  public isDesigning: boolean = true
  private designEvets: DesignEvents = null

  created() {}
  mounted() {
    this.designEvets = new DesignEvents(this)
    this.designEvets.canDrag = false
    this.designEvets.canDrop = true
    this.designEvets.onDrop_Event = this.listenOnDrop
    this.designEvets.onDragMove_Event = this.listenOnDragMove
    this.designEvets.onDelete_Event = this.listenOnDeleteKey
    this.designEvets.onDragEnd_Event = this.listenOnDragEnd
    this.designEvets.onCut_Event = this.listenOnCut
    this.designEvets.onCopy_Event = this.listenOnCopy
    this.designEvets.onPaste_Event = this.listenOnPaste
    this.designEvets.onMouseMove_Event = this.listenOnMousemove
    this.designEvets.onClick_Event = this.listenOnClick
  }

  protected async renderComponent(compCon: EngineComponent): Promise<EngineLayout> {
    let { virtualDom, vueComp } = drawVueOnVirtualDom(DesignShell)
    // this._dragHelper.makeDomCanDrag(shell.$el)
    this.allShells.push(vueComp as DesignShell)
    let res = (vueComp as DesignShell).addComponent(compCon)

    // ;(vueComp as DesignShell).startListenItemDrag()

    $(this.$el).append(virtualDom)
    return res
  }
  /**********************************监听设计事件 ******************************/
  private mouseX: number = 0
  private mouseY: number = 0
  private listenOnMousemove(e: MouseEvent) {
    this.mouseX = e.offsetX
    this.mouseY = e.offsetY
  }
  private async listenOnDrop(
    el: Element,
    targetContainer: Element,
    screenLeft: number,
    screenTop: number,
    dragdata: DragItemData<any>
  ): Promise<boolean> {
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
      dropcomp.left = (screenLeft - $(this.$el).offset().left) / this.currentScaleSize + 'px'
      dropcomp.top = (screenTop - $(this.$el).offset().top) / this.currentScaleSize + 'px'
    }

    return false
  }

  private currentDragLeft: any = null
  private currentDragTop: any = null

  protected listenOnDragMove(
    xchanged: number,
    ychanged: number,
    mouseleft: number,
    mousetop: number,
    el: Element,
    dragdata?: DragItemData<any>
  ): boolean {
    // window.console.log('listenOnDragMove:', dragdata)
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
    // console.log('-------------------------', left, $(this.$el).offset().left)
    let parentPageCurrentScaleSize = (dragComp.topLayout as any as EnginePage).currentScaleSize
    // 在容器内拖拽组件位置
    if (dragdata.type == DragItemTypeEnum.dragmove_component_inpage) {
      let selfPosition = $(el).offsetParent().position() //offsetParent是因为DesignShell中的蒙版
      dragComp.left = (selfPosition.left + xchanged).toFixed(0) + 'px'
      dragComp.top = (selfPosition.top + ychanged).toFixed(0) + 'px'

      return false
    }
    // 在容器内拖拽组件大小
    else if (dragdata.type == DragItemTypeEnum.drag_component_size) {
      xchanged = xchanged / parentPageCurrentScaleSize
      window.console.log(' DragItemTypeEnum.drag_component_size 1:', compInfo.position)
      ychanged = ychanged / parentPageCurrentScaleSize
      this.changeComponentSize(xchanged, ychanged, compInfo.compId, compInfo.position)
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
      if (parentLayout.deleteChildComponents(DesignEvents.copyComp.Id) == true) {
        parentLayout.removeChildRecursion(DesignEvents.copyComp.Id)
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
    e.stopPropagation()
  }
  // ******************************************************
  private listenOnClick(e: Event, target: any) {
    this.chooseComps([])
  }
  // ******************************************************
  public closeDesign() {
    for (let index = 0; index < this.allShells.length; index++) {
      const element = this.allShells[index]
      element.destorymethod()
    }
    this.destorymethod()
  }
}
</script>
 
<style lang="less" scoped>
/deep/ .container {
  padding: 0px;
  background: transparent;
  border: none;
  border-radius: 0px;
}
</style>