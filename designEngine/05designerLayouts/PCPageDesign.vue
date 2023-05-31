<template>
  <div
    :style="{position:'relative','width':width+'px','height':height+'px','left':left+'px','top':top+'px' ,'background':backgroundCute,'padding':'0px' }"
    oncontextmenu="self.event.returnValue=false" style="border-radius:0px">

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ref, h, render, onMounted } from 'vue'

import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineLayout, EngineComponent } from '../03designerLayoutBase'
import { drawVueOnVirtualDom, BuildingFileUrlForShow } from '@common/utils'
import DesignShell from './ComponentShells/DesignShell.vue'

@Options({})
export default class PCPageDesign extends EnginePage {
  public get isDesigning(): boolean {
    return true
  }
  private get backgroundCute(): string {
    // window.console.log('backgroundCute:', this.background_img)
    if (!this.background_img || !this.background_img.uid) {
      return this.background
    }
    return 'url("' + BuildingFileUrlForShow(this.background_img.uid) + '")'
  }
  public allShells: DesignShell[] = []

  created() {}
  mounted() {
    this.canDrag = false
    this.canDrop = true
  }

  protected async renderComponent(compCon: EngineComponent): Promise<EngineLayout> {
    // window.console.log('renderComponent:', compCon)
    let { virtualDom, vueComp } = drawVueOnVirtualDom(DesignShell)
    // this._dragHelper.makeDomCanDrag(shell.$el)
    this.allShells.push(vueComp)
    let res = vueComp.addComponent(compCon)
    //
    $(this.$el).append(virtualDom)
    return res
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