<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" top="0px" v-model="windowVisible" :before-close="onClose" :close-on-click-modal="false"
    :close-on-press-escape="false" destroy-on-close>
    <div class="renderContent" style="width:100%;height:100%"></div>
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
  public async show(virtualDom, vueComp) {
    this.windowVisible = true
    this.currentComp = vueComp
    $(this.$el).find('.renderContent').html('')
    $(this.$el).find('.renderContent').append(virtualDom)
  }
  // *********************************
  private onClose() {}
}
</script>

<style lang="less">
.el-dialog__header {
  display: none !important;
}

.el-dialog__body {
  padding: 0px !important;
}

.el-drawer {
  .el-drawer__header {
    background-color: green;
    margin-bottom: 0px;
    height: 50px;
    .el-drawer__title {
      color: white;
    }
  }
}
</style>
