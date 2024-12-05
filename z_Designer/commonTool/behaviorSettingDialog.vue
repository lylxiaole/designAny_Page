<template style="height: 100%">
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="Behaviors Binding" style="height: 600px" width="800px" v-model="windowVisible" append-to-body :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="height: calc(100% - 50px); background: #fff; width: 100%">
      <behaviorList :platform="pform" :currentPage="currentPage" />
    </div>
    <template #footer>
      <el-row class="dialog-footer" style="height: 50px">
        <div class="steps-action">
          <el-button @click="onCancel">Cancel</el-button>
          <el-button :style="{ 'margin-left': '8px' }" type="primary" @click="onConfirm">Sure</el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import behaviorList from './behaviorList.vue'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import platform from '@design-any/interface/dist/enums/platform'

@Options({
  components: { behaviorList }
})
export default class behaviorSettingDialog extends Vue {
  private currentPage: EnginePage = null
  // ****************************************************
  private windowVisible: boolean = false
  private pform: platform = platform.universal

  public async show(page: EnginePage, pform: platform) {
    this.windowVisible = true
    this.currentPage = page
    this.pform = pform
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

<style scoped></style>
