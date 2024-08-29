 
<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <el-row style="position:relative">
          <span class="normaltext" style="float:left;width:32px">左:</span>
          <el-input-number style="float:left;width:90px" size="small" controls-position="right" :step="1" v-model="currentValue.left" :min="0"
            :max="9999999">
          </el-input-number>
        </el-row>
        <el-row style="position:relative;margin-top:2px">
          <span class="normaltext" style="float:left;width:32px">右:</span>
          <el-input-number style="float:left;width:90px" size="small" controls-position="right" :step="1" v-model="currentValue.right" :min="0"
            :max="9999999">
          </el-input-number>
        </el-row>
        <!-- ************************************************************************** -->
        <el-row style="position:relative;margin-top:2px">
          <span class="normaltext" style="float:left;width:32px">上:</span>
          <el-input-number style="float:left;width:90px" size="small" controls-position="right" :step="1" v-model="currentValue.top" :min="0"
            :max="9999999">
          </el-input-number>
        </el-row>
        <el-row style="position:relative;margin-top:2px">
          <span class="normaltext" style="float:left;width:32px">下:</span>
          <el-input-number style="float:left;width:90px" size="small" controls-position="right" :step="1" v-model="currentValue.bottom" :min="0"
            :max="9999999">
          </el-input-number>
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
import { PropertyTypeEnum, Margin_Setting } from '@design-any/interface/dist/index'

@CellSettingAttr(PropertyTypeEnum.margin)
@Options({
  components: {}
})
export default class marginSetting extends propertyCellBase<Margin_Setting> {
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
</style>