<template>
  <div :style="{'width':component==null?0:component.width ,'height':component==null?0:component.height,'z-index':component==null?0:component.zIndex,'left':component==null?0:component.left ,'top':component==null?0:component.top ,
      'margin-left':component==null?0:component.margin_left+'px','margin-right':component==null?0:component.margin_right+'px','margin-top':component==null?0:component.margin_top+'px','margin-bottom':component==null?0:component.margin_bottom+'px',
      'padding-left':component==null?0:component.padding_left+'px','padding-right':component==null?0:component.padding_right+'px','padding-top':component==null?0:component.padding_top+'px','padding-bottom':component==null?0:component.padding_bottom+'px',
      'position':'absolute','display':'block','tabindex':'1' }">
    <div :class="themeClass" style="width:100%;height:100%;tab-index:1" :style="{zIndex:0,'font-family':component==null?'':component.fontFamily }">
      <div style="tab-index:1" ref="compContent"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { ref, h, render, onMounted } from 'vue'
import { EngineComponent } from '../03designerLayoutBase'
import { deepClone } from '@common/utils'
@Options({})
export default class ViewShell extends Vue {
  public renderContainer: any = {}
  public component: EngineComponent = null
  public positionval: string = null

  get themeClass(): string {
    if (!this.component) {
      return ''
    }
    return ''
  }

  mounted() {}

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

  public addComponent(comp: any) {
    if (this.component != null) {
      this.component.destorymethod()
    }

    render(comp, this.$refs.compContent as any)
    this.component = comp.component.proxy
    comp.component.proxy.renderContainer = this.$refs.compContent
    comp.component.proxy.isDesigning = true
    $(this.component.$el).css('width', '100%')
    $(this.component.$el).css('height', '100%')

    return this.component
  }
}
</script>
 
<style scoped>
</style>