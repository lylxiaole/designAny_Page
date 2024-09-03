 
<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <el-row style="position:relative">
          <span class="normaltext" style="float:left;width:32px">宽:</span>
          <el-input size="small" type="text" style="float:left;width:90px" v-model="currentValue.width" placeholder="请输入" />
        </el-row>
        <el-row style="position:relative;margin-top:2px">
          <span class="normaltext" style="float:left;width:32px">高:</span>
          <el-input size="small" type="text" style="float:left;width:90px" v-model="currentValue.height" placeholder="请输入" />
        </el-row>
        <!-- ************************************************************************** -->
        <el-row style="position:relative;margin-top:2px">
          <span class="normaltext" style="float:left;width:32px">左边:</span>
          <el-input size="small" type="text" style="float:left;width:90px" v-model="currentValue.x" placeholder="请输入" />
        </el-row>
        <el-row style="position:relative;margin-top:2px">
          <span class="normaltext" style="float:left;width:32px">顶部:</span>
          <el-input size="small" type="text" style="float:left;width:90px" v-model="currentValue.y" placeholder="请输入" />
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, CompPosition_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

@CellSettingAttr(PropertyTypeEnum.compPosition)
@Options({
  components: {}
})
export default class index extends propertyCellBase<CompPosition_Setting> {
  private activeNames: string[] = []

  mounted() {}
}
</script>



<style lang="less" scoped>
.normaltext {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}
.el-collapse {
  border: none;
  /deep/.el-collapse-item__header {
    height: 25px;
    line-height: 25px;
  }
  /deep/ .el-collapse-item__content {
    padding-bottom: 8px;
  }
}

/* .ant-switch-checked {
  background-color: #18aeb7;
} */
</style>