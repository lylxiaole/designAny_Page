/**
 * BOOL类型设置
 * By LYL
 * 日期
 */
<template>
  <el-switch v-model="currentValue" active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949">
  </el-switch>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.boolean)
@Component({
  components: {}
})
export default class booleanControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
/* .ant-switch-checked {
  background-color: #18aeb7;
} */
</style>