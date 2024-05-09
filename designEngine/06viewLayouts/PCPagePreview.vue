<template>
  <div :style="{position:'relative','width':width,'height':height,'left':left,'top':top ,'background':backgroundCute,'padding':'0px' }"
    oncontextmenu="self.event.returnValue=false" style="border-radius:0px">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import { EnginePage, EngineLayout, EngineComponent, EngineContainer } from '../03designerLayoutBase'
import {   BuildingFileUrlForShow, deepClone, getUuid } from '@common/utils'
import ViewShell from './ViewShell.vue'
import {drawEngineLayoutVirtual} from '../02common/layoutDrawer'

@Options({})
export default class PCPagePreview extends EnginePage {
  private get backgroundCute(): string {
    // window.console.log('backgroundCute:', this.background_img)
    if (!this.background_img || !this.background_img.uid) {
      return this.background
    }
    return 'url("' + BuildingFileUrlForShow(this.background_img.uid) + '")'
  }
  public allShells: ViewShell[] = []

  created() {}
  mounted() {}

  protected override async renderComponent(compCon: EngineComponent): Promise<EngineLayout> {
    let { virtualDom, vueComp } = drawEngineLayoutVirtual(ViewShell)
    // this._dragHelper.makeDomCanDrag(shell.$el)
    this.allShells.push(vueComp as ViewShell)
    let resComp = (vueComp as ViewShell).addComponent(compCon)
    resComp.$once('onLYLDestroyed', () => {
      let findIndex = this.allShells.findIndex((o) => o == vueComp)
      this.allShells.splice(findIndex, 1)
      ;(vueComp as ViewShell).destorymethod()
    })

    // ;(vueComp as ViewShell).startListenItemDrag()
    $(this.$el).append(virtualDom)
    return resComp
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