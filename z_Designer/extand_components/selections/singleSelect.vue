<template>
  <div style="width: 100%; height: 100%">
    <el-select v-if="keyValueList" v-model="selectedVal" placeholder="" :multiple="multiple" :teleported="false" style="width: 100%; height: 100%">
      <el-option v-for="item in keyValueList" :key="item.value" :label="item.key" :value="item.value" />
    </el-select>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import {
  DPropAttr,
  PropertyGroupName,
  KeyValue_Setting,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import platform from '@design-any/interface/dist/enums/platform'
import { getLocale } from '@common/baseConfigs'

@DCompnentAttr(
  platform.universal,
  getLocale().t('tip.basic'),
  getLocale().t('tip.singleSelection'),
  'SingleSelection_001',
  require('../compIcons/下拉单选.png')
)
@Options({})
export default class SingleSelect extends EngineComponent {
  @DPropAttr(new KeyValue_Setting(getLocale().t('tip.selections'), PropertyGroupName.data, true, null))
  private keyValueList: any[] = []

  @DPropAttr(new Boolean_Setting(getLocale().t('tip.multiple'), PropertyGroupName.data, true, null))
  private multiple: boolean = false

  @DPropAttr(new Text_Setting(getLocale().t('tip.selectedVal'), PropertyGroupName.data, true, null))
  private selectedVal: any = null

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }
}
</script>

<style lang="less" scoped>
/deep/.el-select {
  .el-select__wrapper {
    padding: 0px 5px;
    min-height: auto;
    height: 100%;
  }
}
</style>
