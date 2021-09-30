<template>
  <el-row>
    <el-col style="width:200px">
      <el-button class="button" size="mini">选择流量计</el-button>
    </el-col>
    <el-col style="width:calc(100% - 400px);display:flex;flex-wrap:wrap">
      <span class="label">位号:FT-3001</span>
      <span class="label">投用状态:投用</span>
      <span class="label">厂家:艾默生</span>
      <span class="label">区域:油品作业区</span>
      <span class="label">计量表:93汽油进料</span>
      <span class="label">类型:质量流量计</span>
      <span class="label">状态:正常</span>
    </el-col>
    <el-col style="width:120px">
      <el-row>
        <el-button class="button" size="mini">查看流量计报警</el-button>
      </el-row>
      <el-row>
        <el-button class="button" size="mini">查看流量计历史</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***流量计信息 */
@Component({
  components: {}
})
export default class headerInfo extends ComponentBase {
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style lang="less" scoped>
.label {
  margin-left: 25px;
}
</style>
