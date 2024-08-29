<template>
  <div :style="{position:'relative','width':width,'height':height,'left':left,'top':top ,'background':backgroundCute,'padding':'0px' }"
    oncontextmenu="self.event.returnValue=false" style="border-radius:0px">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import { EnginePage, EngineLayout, EngineComponent, DPageAttr } from '@design-any/interface/dist/index'
import ViewShell from './ViewShell.vue'
import { designDrawDomVirtual } from '../02common/drawVueDom'
@DPageAttr('pc', 'preview')
@Options({})
export default class PCPagePreview extends EnginePage {
  private get backgroundCute(): string {
    if (!this.background_img || this.background_img.length < 1) {
      return this.background
    }
    return 'url("' + this.designerContext.getFileApiAddr(this.background_img[0].uid) + '")'
  }
  public allShells: ViewShell[] = []

  created() {}
  mounted() {}

  protected override async renderComponent(compCon: EngineComponent): Promise<EngineLayout> {
    let { virtualDom, vueComp } = designDrawDomVirtual(ViewShell, false)
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