<template>
  <el-dialog ref="previewPopup" style="height: 400px; width: 600px; top: 100px" v-model="windowVisible" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-form :model="dictionary" label-width="120px">
      <el-form-item label="Desc">
        <el-input v-model="dictionary.desc" />
      </el-form-item>
      <el-form-item label="Key">
        <el-input v-model="dictionary.key" />
      </el-form-item>
      <el-form-item label="Value">
        <el-input v-model="dictionary.value" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="onSure">Sure</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'

import { AddOrUpdate } from '@common/apis/designDictionary'
import { Emit } from 'vue-property-decorator'

@Options({ components: {} })
export default class addOrUpdateDialog extends PageBase {
  private windowVisible: boolean = false

  private dictionary: any = {}

  mounted() {}
  public async show(data?) {
    if (data) {
      this.dictionary = data
    }

    this.windowVisible = true
  }

  // ************************************
  private onCancel() {
    this.windowVisible = false
  }

  @Emit('onSure')
  private async onSure() {
    await AddOrUpdate(this.dictionary)
    this.windowVisible = false
  }
}
</script>

<style lang="less">
.el-dialog__header {
  display: none !important;
}

.el-dialog__body {
  padding: 0px !important;
}
</style>
