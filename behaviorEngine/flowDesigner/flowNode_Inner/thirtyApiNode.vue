<template>
  <el-row style="border:1px solid #cdcdcd;width：100%;height:100%;box-sizing:border-box;background:#fff" class="verticalAlignCenter flexHorilanLayout">
    <div style="width:40px;height:100%">
      <template v-if="actObj.inputParams">
        <div v-for="inParam in actObj.inputParams" :key="inParam.key" :style="{'height':inParamHeight}" class="verticalAlignCenter">
          {{inParam.name}}
        </div>
      </template>
      <template v-else>
        <el-row>
          无输入
        </el-row>
      </template>
    </div>
    <!-- **************************************************** -->
    <div style="width:calc(100% - 80px)">
      <el-row>外部Api</el-row>
    </div>
    <!-- **************************************************** -->
    <div style="width:40px">
      <template v-if="actObj.outParam">
        <el-row>
          输出
        </el-row>
      </template>
      <template v-else>
        <el-row>
          无输出
        </el-row>
      </template>
    </div>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'

@flowDesignNode(funcCode.thirtyApi, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class thirtyApiNode extends Vue {
  // private getNode: Function = inject('getNode')
  public get inParamHeight() {
    if (!this.actObj.inputParams || this.actObj.inputParams.length < 1) {
      return '0px'
    } else {
      return 100 / this.actObj.inputParams.length + '%'
    }
  }
  @Prop()
  private nodeModel: any

  private get actObj(): actionObj {
    let { actObj } = this.nodeModel.getProperties()
    return actObj
  }

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>