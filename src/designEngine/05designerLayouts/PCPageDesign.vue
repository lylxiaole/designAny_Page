<template>
  <div :style="{position:'relative','width':width+'px','height':height+'px','left':left+'px','top':top+'px' }" style="border-radius:0px">
    <div>我是设计器</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePage, EngineLayout, EngineComponent } from '../03designerLayoutBase'
import { drawVueOnVirtualDom } from '@src/utils'
import DesignShell from './ComponentShells/DesignShell.vue'

@Component
export default class PCPageDesign extends EnginePage {
  public get isDesigning(): boolean {
    return true
  }
  public allShells: DesignShell[] = []

  created() {}
  mounted() {
    this.canDrag = false
    this.canDrop = true
  }

  protected renderComponent(compCon: EngineComponent): EngineLayout {
    window.console.log('renderComponent:', compCon)
    let shell = new DesignShell()
    let fragment = drawVueOnVirtualDom(shell)
    window.console.log('renderComponent:', shell.$el)
    this._dragHelper.makeDomCanDrag(shell.$el)
    this.allShells.push(shell)
    shell.addComponent(compCon)
    //
    $(this.$el).append(fragment)
    return compCon
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