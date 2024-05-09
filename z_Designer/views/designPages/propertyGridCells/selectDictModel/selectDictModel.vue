<template>
  <div>
    <a-button type="primary" class="themeButton" @click="selectDict" size="small">选择枚举</a-button>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, JsonContent_Setting } from '@designEngine/index'

@CellSettingAttr(PropertyTypeEnum.jsonContent)
@Options({})
export default class selectDictModel extends propertyCellBase<JsonContent_Setting> {
  mounted() {}

  @Emit('selectDict')
  private selectDict() {
    //window.console.info('事件触发')
  }
}
</script>