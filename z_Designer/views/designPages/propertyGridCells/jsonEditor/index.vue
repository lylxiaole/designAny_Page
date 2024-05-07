 
 <template>
  <div>
    <el-button type="primary" @click="startEdit" size="small"
      style="width:118px;height:34px;background:rgba(0,103,138,0.1);border-color:rgba(0,103,138,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;">
      编辑
    </el-button>
    <el-dialog title="编辑" style="height:600px" width="800px" v-model="windowVisible" append-to-body :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row style="height:480px;width:100%;background:#FFF">
        <jsonEditorCommon ref="jsonEditor" style="width:100%;height:100%"></jsonEditorCommon>
      </el-row>
      <template #footer>
        <el-row class="dialog-footer">
          <div class="steps-action">
            <el-button @click="onCancel">
              取消
            </el-button>
            <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onConfirm">
              确认
            </el-button>
          </div>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import jsonEditorCommon from './jsonEditorCommon.vue'

import propertyCellBase from '../common'
import { propertyCellSettingAttr } from '../common'
import { PropertyTypeEnum, JsonContent_Setting } from '@designEngine/index'

@propertyCellSettingAttr(PropertyTypeEnum.jsonContent)
@Options({
  components: {
    jsonEditorCommon: jsonEditorCommon
  }
})
export default class index extends propertyCellBase<JsonContent_Setting> {
  private windowVisible: boolean = false
  private async startEdit() {
    this.windowVisible = true
    await this.$nextTick()
    if (!this.currentValue) {
      ;(this.$refs.jsonEditor as jsonEditorCommon).setJsonData('{}')
    } else {
      let val = JSON.stringify(this.currentValue)
      ;(this.$refs.jsonEditor as jsonEditorCommon).setJsonData(val)
    }
  }

  private onConfirm() {
    this.currentValue = (this.$refs.jsonEditor as jsonEditorCommon).getJsonData()
    debugger
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
}
</script>



<style scoped>
</style> 