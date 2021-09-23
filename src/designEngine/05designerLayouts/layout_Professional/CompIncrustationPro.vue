<template>
  <div :class="hoverClass"
    :style="{'width':Component==null?0:Component.width+'px','height':Component==null?0:Component.height+'px','z-index':Component==null?0:Component.zIndex,'left':Component==null?0:Component.left+'px','top':Component==null?0:Component.top+'px',
      'margin-left':Component==null?0:Component.margin_left+'px','margin-right':Component==null?0:Component.margin_right+'px','margin-top':Component==null?0:Component.margin_top+'px','margin-bottom':Component==null?0:Component.margin_bottom+'px',
      'padding-left':Component==null?0:Component.padding_left+'px','padding-right':Component==null?0:Component.padding_right+'px','padding-top':Component==null?0:Component.padding_top+'px','padding-bottom':Component==null?0:Component.padding_bottom+'px',
       'border':boarderStyle,'position':positionval==null?'absolute':positionval,'display':(IsDesigning===true||display===true)?'block':'none','tabindex':'1' }">
    <div :class="themeClass" style="width:100%;height:100%;tab-index:1"
      :style="{zIndex:IsDesigning===true?0:3,'font-family':Component==null?'':Component.fontFamily }">
      <div style="tab-index:1" ref="compContent"></div>
    </div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="semove"
      style="width:16px;height:16px;right:-16px; bottom:-16px;position:absolute;cursor: se-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="swmove"
      style="width:16px;height:16px;left:-16px; bottom:-16px;position:absolute;cursor: sw-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="nemove"
      style="width:16px;height:16px;right:-16px; top:-16px;position:absolute;cursor: ne-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="nwmove"
      style="width:16px;height:16px;left:-16px; top:-16px;position:absolute;cursor: nw-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="nmove"
      style="width:96%;height:16px;left:2%; top:-16px;position:absolute;cursor:n-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="smove"
      style="width:96%;height:16px;left:2%; bottom:-16px;position:absolute;cursor:s-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="wmove"
      style="width:16px;height:96%;top:2%; left:-16px;position:absolute;cursor:w-resize;;z-index:2" draggable="true"></div>
    <div v-if="isSelectedArea===true&&IsDesigning===true" class="dragbutton" ref="emove"
      style="width:16px;height:96%;top:2%; right:-16px;position:absolute;cursor:e-resize;;z-index:2" draggable="true"></div>
    <div v-if="Component&&Component.disabled===true" ref="dragmengb" type="drag"
      style="width:100%;height:100%;position:absolute;left:0px;top:0px;tab-index:1" :style="{zIndex:IsDesigning===true?0:3 }"></div>
    <a-icon ref="dragIcon" type="drag" v-if="isSelectedArea===true&&IsDesigning===true"
      style="font-size:1.4em;color:#FAAD14;cursor:pointer;left:0;top:0;position:absolute;z-index:4" />
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import BaseEvent from '@src/designEngine/03designerLayoutBase/BaseEvents'
import { ComponentBase } from '@src/designEngine/03designerLayoutBase'
import { DragItemData, DragItemTypeEnum } from '@src/designEngine/03designerLayoutBase/BaseEvents'

// @Component
export default class CompIncrustationPro extends BaseEvent {
  private Component: ComponentBase = null
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
    if (this.IsDesigning) {
      if (!this.Component) {
        return false
      }
      if (this.Component.isSelected) {
        return true
      }
      if (this.Component.findSelectedLayoutsRecursion && this.Component.findSelectedLayoutsRecursion().length > 0) {
        return true
      }
    }
    return false
  }

  get hoverClass(): string {
    if (this.IsDesigning == true) {
      return 'gad-mengb'
    } else {
      return ''
    }
  }

  get themeClass(): string {
    if (!this.Component) {
      return ''
    }
    if (this.Component.isUseTheme) {
      return 'designerThemeStyle'
    }
    return ''
  }

  /**当前组建壳子中的组件 */
  get InnerComponent() {
    return this.Component
  }

  get boarderStyle(): string {
    if (this.IsDesigning == true && this.isSelectedArea == true) {
      return '#faad14 solid 1px'
    } else {
      return ''
    }
  }

  mounted() {
    if (this.IsDesigning == true) {
      this.CaptureEvent()
      this.canDrop = false
      this.canDrag = true
      this.onDrag_Event = this.onDragSize
      this.onClick_Event = (e: Event, target: any) => {
        if (this.IsDesigning) {
          if (this.Component.parentPage) {
            this.Component.parentPage.chooseComps([])
          }
          ;(this.Component.parentLayout as any).chooseComps([this.Component])
          // $(this.$el).focus()
          e.stopPropagation()
        }
      }
    }
  }

  destroyed() {
    // this.$off()
    // $(this.$el).remove()
    // for (const key in (this as any).prototype) {
    //   delete (this as any).prototype[key]
    // }
    // for (const key in this) {
    //   delete this[key]
    // }
  }

  public AddComponent(comp: ComponentBase) {
    if (this.Component != null) {
      this.Component.destory()
    }
    this.Component = comp
    // this.Component.$mount(this.$refs.compContent as Element)
    // $(this.Component.$el).css('width', '100%')
    // $(this.Component.$el).css('height', '100%')
    // this.Component.$once('onDestroyed', () => {
    //   this.$destroy()
    // })
  }

  public onDragSize(el: Element, dragdata: DragItemData<any>) {
    //   if (el == this.$refs['dragIcon'] || el == this.$refs['dragmengb']) {
    //     dragdata.type = DragItemTypeEnum.dragmove_component_inpage
    //     dragdata.dragData = { compId: this.Component.Id }
    //     return
    //   }
    //   dragdata.type = DragItemTypeEnum.drag_component_size
    //   let you_xia = this.$refs['semove'] as Element
    //   let zuo_xia = this.$refs['swmove'] as Element
    //   let you_shang = this.$refs['nemove'] as Element
    //   let zuo_shang = this.$refs['nwmove'] as Element
    //   let shang = this.$refs['nmove'] as Element
    //   let xia = this.$refs['smove'] as Element
    //   let zuo = this.$refs['wmove'] as Element
    //   let you = this.$refs['emove'] as Element
    //   if (el == you_xia) {
    //     this._dragHelper.makeDomCanDrag(you_xia)
    //     dragdata.dragData = { position: 'you_xia', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(you_xia, deepClone(deepClone(dragdata)))
    //   } else if (el == zuo_xia) {
    //     this._dragHelper.makeDomCanDrag(zuo_xia)
    //     dragdata.dragData = { position: 'zuo_xia', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(zuo_xia, deepClone(dragdata))
    //   } else if (el == you_shang) {
    //     this._dragHelper.makeDomCanDrag(you_shang)
    //     dragdata.dragData = { position: 'you_shang', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(you_shang, deepClone(dragdata))
    //   } else if (el == zuo_shang) {
    //     this._dragHelper.makeDomCanDrag(zuo_shang)
    //     dragdata.dragData = { position: 'zuo_shang', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(zuo_shang, deepClone(dragdata))
    //   } else if (el == shang) {
    //     this._dragHelper.makeDomCanDrag(shang)
    //     dragdata.dragData = { position: 'shang', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(shang, deepClone(dragdata))
    //   } else if (el == xia) {
    //     this._dragHelper.makeDomCanDrag(xia)
    //     dragdata.dragData = { position: 'xia', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(xia, deepClone(dragdata))
    //   } else if (el == zuo) {
    //     this._dragHelper.makeDomCanDrag(zuo)
    //     dragdata.dragData = { position: 'zuo', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(zuo, deepClone(dragdata))
    //   } else if (el == you) {
    //     this._dragHelper.makeDomCanDrag(you)
    //     dragdata.dragData = { position: 'you', compId: this.Component.Id }
    //     this._dragHelper.makeDragItemInfo(you, deepClone(dragdata))
    //   }
  }
}
</script>


<style lang="less" scoped>
.gad-mengb:hover {
  -webkit-box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.1);
}

.dragbutton {
  background-color: #faad14;
  opacity: 0;
}
</style>