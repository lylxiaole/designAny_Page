 
<template>
  <div>
    <el-row>
      <el-col>
        <span class="normaltext">width:</span>
        <el-input size="mini" v-model="currentValue.width" placeholder="请输入" />
      </el-col>
      <el-col>
        <span class="normaltext">height:</span>
        <el-input size="mini" v-model="currentValue.height" placeholder="请输入" />
      </el-col>
    </el-row>
    <!-- ************************************************************************** -->
    <el-row>
      <el-col>
        <span class="normaltext">left:</span>
        <el-input size="mini" v-model="currentValue.x" placeholder="请输入" />
      </el-col>
      <el-col>
        <span class="normaltext">top:</span>
        <el-input size="mini" v-model="currentValue.y" placeholder="请输入" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.compPosition)
@Options({
  components: {}
})
export default class index extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
.normaltext {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}
/* .ant-switch-checked {
  background-color: #18aeb7;
} */
</style>