<template>
  <div :class="hoverClass" :style="{'width':Component==null?0:Component.width ,'height':Component==null?0:Component.height,'z-index':Component==null?0:Component.zIndex,'left':Component==null?0:Component.left ,'top':Component==null?0:Component.top ,
      'margin-left':Component==null?0:Component.margin_left+'px','margin-right':Component==null?0:Component.margin_right+'px','margin-top':Component==null?0:Component.margin_top+'px','margin-bottom':Component==null?0:Component.margin_bottom+'px',
      'padding-left':Component==null?0:Component.padding_left+'px','padding-right':Component==null?0:Component.padding_right+'px','padding-top':Component==null?0:Component.padding_top+'px','padding-bottom':Component==null?0:Component.padding_bottom+'px',
       'border':boarderStyle,'position':positionval==null?'absolute':positionval,'display':'block','tabindex':'1' }">
    <div :class="themeClass" style="width:100%;height:100%;tab-index:1" :style="{zIndex:0,'font-family':Component==null?'':Component.fontFamily }">
      <div style="tab-index:1" ref="compContent"></div>
    </div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="semove"
      style="width:16px;height:16px;right:-16px; bottom:-16px;position:absolute;cursor: se-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="swmove"
      style="width:16px;height:16px;left:-16px; bottom:-16px;position:absolute;cursor: sw-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="nemove"
      style="width:16px;height:16px;right:-16px; top:-16px;position:absolute;cursor: ne-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="nwmove"
      style="width:16px;height:16px;left:-16px; top:-16px;position:absolute;cursor: nw-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="nmove"
      style="width:96%;height:16px;left:2%; top:-16px;position:absolute;cursor:n-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="smove"
      style="width:96%;height:16px;left:2%; bottom:-16px;position:absolute;cursor:s-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="wmove"
      style="width:16px;height:96%;top:2%; left:-16px;position:absolute;cursor:w-resize;;z-index:2" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="emove"
      style="width:16px;height:96%;top:2%; right:-16px;position:absolute;cursor:e-resize;;z-index:2" draggable="true"></div>
    <!-- *************************** -->
    <div v-show="Component" type="drag" style="width:100%;height:100%;position:absolute;left:0px;top:0px;tab-index:1" @click="onCompClick"
      ref="dragmengb" class="dragmengb" :style="{zIndex:0 }"></div>

    <!-- <div ref="dragIcon" class="el-icon-rank" v-show="isSelectedArea===true"
      style="font-size:1.4em;color:#FAAD14;cursor:pointer;left:0;top:0;position:absolute;z-index:4">拖拽</div> -->
  </div>
</template>

<script lang="ts" >
import { Options, Vue } from 'vue-class-component'
import { ref, h, render, onMounted } from 'vue'
import dragHelper from '@designEngine/02common/dragHelper_new'

import { Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, BaseEvents, DragItemData, DragItemTypeEnum } from '../03designerLayoutBase'
import { deepClone } from '@common/utils'
@Options({})
export default class DesignShell extends Vue {
  public get isDesigning(): boolean {
    return true
  }
  private Component: EngineComponent = null
  public positionval: string = null

  get backGroundColor(): string {
    if (!this.Component) {
      return '#FFF'
    }
    if (this.Component.findPropertyByName('基础设置', '背景色')) {
      return this.Component.findPropertyByName('基础设置', '背景色').value as string
    } else {
      return '#FFF'
    }
  }
  get display(): boolean {
    if (!this.Component) {
      return true
    }
    return this.Component.display
  }
  /**是否是当前选中的区域 */
  get isSelectedArea(): boolean {
    if (!this.Component) {
      return false
    }
    if (this.Component.isSelected) {
      return true
    }
    if (this.Component.findSelectedLayoutsRecursion && this.Component.findSelectedLayoutsRecursion(this.Component.children).length > 0) {
      return true
    }

    return false
  }
  get hoverClass(): string {
    return 'gad-mengb'
  }
  get themeClass(): string {
    if (!this.Component) {
      return ''
    }
    return ''
  }
  /**当前组建壳子中的组件 */
  get InnerComponent() {
    return this.Component
  }
  get boarderStyle(): string {
    if (this.isSelectedArea == true) {
      return '#faad14 solid 0.3px'
    } else {
      return ''
    }
  }

  mounted() {
    // this.captureEvent()
    this._dragHelper = new dragHelper(this.$el)
    this._dragHelper.makeContainerCannotDrop()
    this._dragHelper.makeDomCannotDrag(this.$el)

    // this.onDrag_Event = this.onStartDrag
    // this.onClick_Event = (e: Event, target: any) => {
    //   // window.console.log('DesignShell onClick_Event')
    //   ;(this.Component.parentLayout as any).chooseComps([this.Component])
    //   $(this.$el).focus()
    //   e.stopPropagation()
    // }
  }

  destroyed() {
    this.$off()
    $(this.$el).remove()

    for (const key in (this as any).prototype) {
      delete (this as any).prototype[key]
    }
    for (const key in this) {
      delete this[key]
    }
  }

  private onCompClick(e) {
    e.stopPropagation()
    ;(this.Component.parentLayout as any).chooseComps([this.Component])
    $(this.$el).focus()
  }

  public addComponent(comp: EngineComponent) {
    if (this.Component != null) {
      this.Component.$destroy()
    }

    render(comp, this.$refs.compContent)
    this.Component = comp.component.proxy

    $(this.Component.$el).css('width', '100%')
    $(this.Component.$el).css('height', '100%')
    this.Component.$once('onDestroyed', () => {
      this.$destroy()
    })

    // this.startListenItemDrag()
    return this.Component
  }

  public startListenItemDrag() {
    window.console.log('startListenItemDrag:', this.$el)
    let dragdata: any = { type: DragItemTypeEnum.dragmove_component_inpage }
    dragdata.dragData = { compId: this.Component.Id }
    //
    let dragicon = this.$refs.dragmengb as Element
    this._dragHelper.makeDomCanDrag(dragicon)
    this._dragHelper.makeDragItemInfo(dragicon, deepClone(dragdata))
    // ******************************************
    let you_xia = this.$refs['semove'] as Element
    let zuo_xia = this.$refs['swmove'] as Element
    let you_shang = this.$refs['nemove'] as Element
    let zuo_shang = this.$refs['nwmove'] as Element
    let shang = this.$refs['nmove'] as Element
    let xia = this.$refs['smove'] as Element
    let zuo = this.$refs['wmove'] as Element
    let you = this.$refs['emove'] as Element
    dragdata = { type: DragItemTypeEnum.drag_component_size }
    //
    this._dragHelper.makeDomCanDrag(you_xia)
    dragdata.dragData = { position: 'you_xia', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(you_xia, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(zuo_xia)
    dragdata.dragData = { position: 'zuo_xia', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(zuo_xia, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(you_shang)
    dragdata.dragData = { position: 'you_shang', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(you_shang, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(zuo_shang)
    dragdata.dragData = { position: 'zuo_shang', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(zuo_shang, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(shang)
    dragdata.dragData = { position: 'shang', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(shang, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(xia)
    dragdata.dragData = { position: 'xia', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(xia, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(zuo)
    dragdata.dragData = { position: 'zuo', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(zuo, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(you)
    dragdata.dragData = { position: 'you', compId: this.Component.Id }
    this._dragHelper.makeDragItemInfo(you, deepClone(dragdata))
  }

  public onStartDrag(el: Element, dragdata: DragItemData<any>) {
    window.console.log('DesignShell onStartDrag:', el)
    if (el.className.indexOf('el-icon-rank') > -1 || el.className.indexOf('dragmengb') > -1) {
      dragdata.type = DragItemTypeEnum.dragmove_component_inpage
      dragdata.dragData = { compId: this.Component.Id }
      return
    } else {
      dragdata.type = DragItemTypeEnum.drag_component_size
    }
  }
}
</script>
 
<style lang="less" scoped>
.gad-mengb:hover {
  -webkit-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}

.dragbutton {
  background-color: #faad14;
  opacity: 0;
}
</style>