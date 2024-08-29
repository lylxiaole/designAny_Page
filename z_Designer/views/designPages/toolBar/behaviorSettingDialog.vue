<template style="height:100%">
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为绑定" style="height:600px" width="800px" v-model="windowVisible" append-to-body
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="height:calc(100% - 50px);background:#FFF;width:100%">
      <behaviorList :currentPage="currentPage" />
    </div>
    <template #footer>
      <el-row class="dialog-footer" style="height:50px">
        <div class="steps-action">
          <el-button @click="onCancel">
            取消
          </el-button>
          <el-button :style="{'margin-left':'8px'}" type="primary" @click="onConfirm">
            确认
          </el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { behaviorList } from '@behaviorEngine/index'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'

@Options({
  components: { behaviorList }
})
export default class behaviorSettingDialog extends Vue {
  private currentPage: EnginePage = null
  // ****************************************************
  private windowVisible: boolean = false
  public async show(page: EnginePage) {
    this.windowVisible = true
    this.currentPage = page
  }
  private onClose() {
    this.windowVisible = false
  }
  private onConfirm() {
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
}
</script>

<style scoped>
</style>