<template>
  <el-dialog class="xxx" style="padding:0px !important;" v-model="windowVisible" :style="{width:dialogWidth}" :before-close="onClose"
    :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
    <div ref="renderContent" style="width:100%;" :style="{height:dialogHeight }">
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'

@Options({
  components: {}
})
export default class pageDialog extends PageBase {
  private windowVisible: boolean = false
  private currentComp: any = null
  // *********************************
  private dialogWidth: string = '0px'
  private dialogHeight: string = '0px'
  // *********************************
  public async show(virtualDom, vueComp) {
    this.dialogWidth = vueComp.width
    this.dialogHeight = vueComp.height

    this.windowVisible = true
    this.currentComp = vueComp
    await this.$nextTick()
    $(this.$refs.renderContent).html('')
    $(this.$refs.renderContent).append(virtualDom)
  }
  public async close() {
    this.currentComp.destorymethod()
    this.windowVisible = false
  }

  // *********************************
  private onClose() {}
}
</script>

<style lang="less">
.dialogbox {
  .el-dialog__header {
    display: none !important;
  }

  .el-dialog__body {
    padding: 0px !important;
  }
}
</style>
