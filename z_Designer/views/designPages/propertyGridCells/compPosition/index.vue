 
<template>
  <div>
    <el-row>
      <el-col>
        宽:
        <el-input size="mini" v-model="currentValue.width" placeholder="请输入" />
      </el-col>
      <el-col>
        高:
        <el-input size="mini" v-model="currentValue.height" placeholder="请输入" />
      </el-col>
    </el-row>
    <!-- ************************************************************************** -->
    <el-row>
      <el-col>
        左:
        <el-input size="mini" v-model="currentValue.x" placeholder="请输入" />
      </el-col>
      <el-col>
        上:
        <el-input size="mini" v-model="currentValue.y" placeholder="请输入" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.compPosition)
@Component({
  components: {}
})
export default class index extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
/* .ant-switch-checked {
  background-color: #18aeb7;
} */
</style>