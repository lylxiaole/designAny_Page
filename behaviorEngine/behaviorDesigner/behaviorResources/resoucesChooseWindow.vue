 <template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="选择资源" style="height:600px" width="100%" v-model="isVisible"
    @ok="onOk" @cancel="handleCancel" append-to-body>
    <div style="width:100%;height:480px">
      <el-row style="height:54px;padding:0px 0px 8px 0px;background:#FFF;">
        <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6" class="flexHorilanLayout">
          <div style="background:#18aeb7;width:6px;height:46px;"></div>
          <span style="margin-left:9px;float:left;fontSize:18px">资源库</span>
        </div>
      </el-row>
      <resouceChooseComp ref="resourceTree" style="height:calc(100% - 54px);overflow-x:auto;overflow-y:hidden;border:1px solid #ccc"
        @onSelectedObj="onSelectedObj" />
    </div>
    <template #footer>
      <el-row class="dialog-footer">
        <div class="steps-action">
          <el-button @click="handleCancel">
            取消
          </el-button>
          <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onOk">
            确认
          </el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout } from '@design-any/interface/dist'

import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/index'

import resouceChooseComp from './resouceChooseComp.vue'

@Options({
  components: {
    resouceChooseComp
  }
})
export default class resoucesChooseWindow extends Vue {
  private isVisible: boolean = false

  async show() {
    this.isVisible = true
    await this.$nextTick()
    ;(this.$refs.resourceTree as any).refreshCurrentItems()
  }

  private currentObj: actionObj = null

  private onOk() {
    this.onChooseObj(this.currentObj)
    this.isVisible = false
  }
  private handleCancel() {
    this.isVisible = false
  }

  private onSelectedObj(obj: actionObj) {
    this.currentObj = deepClone(obj)
    //window.console.log('---------------------------this.currentObj',this.currentObj)
    this.$nextTick(() => {
      var resouContainer = this.$refs.resourceTree as any
      resouContainer.$el.scrollLeft = resouContainer.$el.scrollWidth
    })
  }

  @Emit('onChooseObj')
  private onChooseObj(obj: actionObj) {}
}
</script>

<style lang="less" scoped>
</style>
