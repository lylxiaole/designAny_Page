<template>
  <div>
    <a-button type="primary" class="themeButton" @click="selectDict" size="small">选择枚举</a-button>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.selectDictModel)
@Options({})
export default class selectDictModel extends propertyCellBase {
  mounted() {}
  @Emit('selectDict')
  private selectDict() {
    //window.console.info('事件触发')
  }
}
</script>