<template>
  <el-row style="width:100%;height:100%">
    <el-row>
      <el-col :span="6">提示窗类型:</el-col>
      <el-col :span="18">
        <el-select v-model="actObj.resourceFilter.type" placeholder="Select" size="small">
          <el-option key="success" label="success" value="success" />
          <el-option key="error" label="error" value="error" />
          <el-option key="info" label="info" value="info" />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">提示内容:</el-col>
      <el-col :span="18">
        <el-input v-model="actObj.resourceFilter.message" placeholder="Please input" />
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'

@flowDesignNode(funcCode.notificationDialog, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class NotificationDialogNode extends Vue {
  @Prop()
  private actObj: actionObj

  @Prop()
  private currentPage: EnginePage
  public makeParamKey(key) {
    return this.actObj.id + '&' + key
  }

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>