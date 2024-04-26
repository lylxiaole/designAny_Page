 
<template>
  <div>
    <el-row>
      <el-col>
        <span class="normaltext">左:</span>
        <el-input-number size="small" controls-position="right" :step="1" v-model="currentValue.left" :min="0" :max="9999999">
        </el-input-number>

      </el-col>
      <el-col>
        <span class="normaltext">右:</span>
        <el-input-number size="small" controls-position="right" :step="1" v-model="currentValue.right" :min="0" :max="9999999">
        </el-input-number>
      </el-col>
    </el-row>
    <!-- ************************************************************************** -->
    <el-row>
      <el-col>
        <span class="normaltext">上:</span>
        <el-input-number size="small" controls-position="right" :step="1" v-model="currentValue.top" :min="0" :max="9999999">
        </el-input-number>

      </el-col>
      <el-col>
        <span class="normaltext">下:</span>
        <el-input-number size="small" controls-position="right" :step="1" v-model="currentValue.bottom" :min="0" :max="9999999">
        </el-input-number>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import propertyCellBase from '../common'
import { propertyCellSettingAttr } from '../common'
import { PropertyTypeEnum, Margin_Setting, Padding_Setting } from '@designEngine/index'

@propertyCellSettingAttr(PropertyTypeEnum.padding)
@Options({
  components: {}
})
export default class paddingSetting extends propertyCellBase<Padding_Setting> {
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