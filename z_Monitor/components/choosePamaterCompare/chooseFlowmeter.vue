<template>
  <div style="height:100%;width:100%">
     <el-row style="height:100%">
       <el-col :span="12">
         <el-row><span>位号:xxxx</span></el-row>
           <el-row><span>产商:xxxx</span></el-row>
             <el-row><span>计量表:xxxx</span></el-row>
              <el-row>  <el-button class="button" size="mini" @click="chooseFirstFlowmeter">选择流量计</el-button>
 </el-row>
       <chooseFlowmeter :dialogVisible.sync="chooseFlowmeterVisible" @onSure="onChooseFlowmeter" @onCancel="onCancelChooseFlometer" />

       </el-col>
          <el-col :span="12">
                     <el-row><span>位号:xxxx</span></el-row>
           <el-row><span>产商:xxxx</span></el-row>
             <el-row><span>计量表:xxxx</span></el-row>
              <el-row>  <el-button class="button" size="mini" @click="chooseSecondFlowmeter">选择流量计</el-button>
 </el-row>
       <chooseFlowmeter :dialogVisible.sync="chooseFlowmeterVisible" @onSure="onChooseFlowmeter" @onCancel="onCancelChooseFlometer" />

          </el-col>
     </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class chooseFlowmeter extends ComponentBase {
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  private async chooseFirstFlowmeter()
  {
    
  }
   private async chooseSecondFlowmeter()
  {
    
  }
}
</script>
<style scoped>
</style>
