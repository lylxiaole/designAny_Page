<template>
  <div :class="hoverClass" :style="{'width':component==null?0:component.width ,'height':component==null?0:component.height,'z-index':component==null?0:component.zIndex,'left':component==null?0:component.left ,'top':component==null?0:component.top ,
      'margin-left':component==null?0:component.margin_left+'px','margin-right':component==null?0:component.margin_right+'px','margin-top':component==null?0:component.margin_top+'px','margin-bottom':component==null?0:component.margin_bottom+'px',
      'padding-left':component==null?0:component.padding_left+'px','padding-right':component==null?0:component.padding_right+'px','padding-top':component==null?0:component.padding_top+'px','padding-bottom':component==null?0:component.padding_bottom+'px',
       'border':boarderStyle,'position':positionval==null?'absolute':positionval,'display':'block','tabindex':'1' }">

    <div ref="compContent" :class="themeClass" style="width:100%;height:100%;tab-index:1"
      :style="{zIndex:0,'font-family':component==null?'':component.fontFamily }"> </div>

    <div v-show="isSelectedArea===true" class="dragbutton" ref="semove"
      style="width:16px;height:16px;right:-16px; bottom:-16px;position:absolute;cursor: se-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="swmove"
      style="width:16px;height:16px;left:-16px; bottom:-16px;position:absolute;cursor: sw-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="nemove"
      style="width:16px;height:16px;right:-16px; top:-16px;position:absolute;cursor: ne-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="nwmove"
      style="width:16px;height:16px;left:-16px; top:-16px;position:absolute;cursor: nw-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="nmove"
      style="width:96%;height:16px;left:2%; top:-16px;position:absolute;cursor:n-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="smove"
      style="width:96%;height:16px;left:2%; bottom:-16px;position:absolute;cursor:s-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="wmove"
      style="width:16px;height:96%;top:2%; left:-16px;position:absolute;cursor:w-resize;;z-index:99" draggable="true"></div>
    <div v-show="isSelectedArea===true" class="dragbutton" ref="emove"
      style="width:16px;height:96%;top:2%; right:-16px;position:absolute;cursor:e-resize;;z-index:99" draggable="true"></div>
    <!-- *************************** -->
    <div v-show="component" type="drag" style="width:100%;height:100%;position:absolute;left:0px;top:0px;tab-index:1;z-index:99" @click="onCompClick"
      ref="dragmengb" class="dragmengb" :style="{zIndex:3 }"></div>

    <!-- <div ref="dragIcon" class="el-icon-rank" v-show="isSelectedArea===true"
      style="font-size:1.4em;color:#FAAD14;cursor:pointer;left:0;top:0;position:absolute;z-index:4">拖拽</div> -->
  </div>
</template>

<script lang="ts" >
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { ref, h, render, onMounted } from 'vue'
import dragHelper from '@designEngine/02common/dragHelper_new'

import { DragItemData, DragItemTypeEnum } from './DesignEvents'
import { EngineComponent } from '../03designerLayoutBase'
import { deepClone } from '@common/utils'
@Options({})
export default class DesignShell extends Vue {
  public renderContainer: any = {}

  private _dragHelper: dragHelper = null

  public component: EngineComponent = null
  public positionval: string = null

  get backGroundColor(): string {
    if (!this.component) {
      return '#FFF'
    }
    return this.component.background
  }
  get display(): boolean {
    if (!this.component) {
      return true
    }
    return this.component.display
  }
  /**是否是当前选中的区域 */
  get isSelectedArea(): boolean {
    if (!this.component) {
      return false
    }
    if (this.component.isSelected) {
      return true
    }
    if (this.component.findSelectedLayoutsRecursion && this.component.findSelectedLayoutsRecursion(this.component.children).length > 0) {
      return true
    }

    return false
  }
  get hoverClass(): string {
    return 'gad-mengb'
  }
  get themeClass(): string {
    if (!this.component) {
      return ''
    }
    return ''
  }
  /**当前组建壳子中的组件 */
  get InnerComponent() {
    return this.component
  }
  get boarderStyle(): string {
    if (this.isSelectedArea == true) {
      return '#faad14 solid 0.3px'
    } else {
      return ''
    }
  }

  mounted() {
    this._dragHelper = new dragHelper(this.$el)
    this._dragHelper.makeContainerCannotDrop()
    this._dragHelper.makeDomCannotDrag(this.$el)
  }

  destorymethod() {
    render(null, this.renderContainer)
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
    ;(this.component.parentLayout as any).chooseComps([this.component])
    $(this.$el).focus()
  }

  public addComponent(comp: any) {
    if (this.component != null) {
      this.component.destorymethod()
    }
    comp = h(comp)
    render(comp, this.$refs.compContent as any)
    this.component = comp.component.proxy
    comp.component.proxy.renderContainer = this.$refs.compContent
    comp.component.proxy.isDesigning = true
    $(this.component.$el).css('width', '100%')
    $(this.component.$el).css('height', '100%')
    return this.component
  }

  public startListenItemDrag() {
    let dragdata: any = { type: DragItemTypeEnum.dragmove_component_inpage }
    dragdata.dragData = { compId: this.component.Id }
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
    dragdata.dragData = { position: 'you_xia', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(you_xia, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(zuo_xia)
    dragdata.dragData = { position: 'zuo_xia', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(zuo_xia, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(you_shang)
    dragdata.dragData = { position: 'you_shang', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(you_shang, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(zuo_shang)
    dragdata.dragData = { position: 'zuo_shang', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(zuo_shang, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(shang)
    dragdata.dragData = { position: 'shang', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(shang, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(xia)
    dragdata.dragData = { position: 'xia', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(xia, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(zuo)
    dragdata.dragData = { position: 'zuo', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(zuo, deepClone(dragdata))
    //
    this._dragHelper.makeDomCanDrag(you)
    dragdata.dragData = { position: 'you', compId: this.component.Id }
    this._dragHelper.makeDragItemInfo(you, deepClone(dragdata))
  }

  public onStartDrag(el: Element, dragdata: DragItemData<any>) {
    window.console.log('DesignShell onStartDrag:', el)
    if (el.className.indexOf('el-icon-rank') > -1 || el.className.indexOf('dragmengb') > -1) {
      dragdata.type = DragItemTypeEnum.dragmove_component_inpage
      dragdata.dragData = { compId: this.component.Id }
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