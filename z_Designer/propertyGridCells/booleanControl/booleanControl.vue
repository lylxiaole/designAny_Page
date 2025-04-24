<template>
  <el-switch v-model="currentValue" :active-text="$t('opts.Yes')" :inactive-text="$t('opts.No')" active-color="#13ce66"
    inactive-color="#ff4949"></el-switch>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, Boolean_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

@CellSettingAttr(PropertyTypeEnum.boolean)
@Options({
  components: {}
})
export default class booleanControl extends propertyCellBase<Boolean_Setting> {
  mounted() {}
}
</script>

<style scoped>
/* .ant-switch-checked {
  background-color: #18aeb7;
} */
</style>
