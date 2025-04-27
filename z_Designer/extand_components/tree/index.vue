<template>
  <div style="width: 100%; height: 100%">

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import {
  DPropAttr,
  Number_Setting,
  PropertyGroupName,
  TableColumn_Setting,
  JsonContent_Setting,
  Boolean_Setting,
  Color_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DMethodAttr } from '@design-any/interface/dist/LayoutAttr/MethodInfo'

import platform from '@design-any/interface/dist/enums/platform'
import { getLocale } from '@common/baseConfigs'

@DCompnentAttr(platform.page, getLocale().t('tip.basic'), getLocale().t('tip.classicTree'), 'Tree_001', require('../compIcons/简单树.png'))
@Options({
  components: {}
})
export default class Index extends EngineComponent {}
</script>

<style lang="less" scoped></style>
