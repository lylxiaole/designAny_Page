<template>
  <div>
    <a-button type="primary" class="themeButton" @click="selectDict" size="small">选择枚举</a-button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.selectDictModel)
@Component
export default class selectDictModel extends propertyCellBase {
  mounted() {}
  @Emit('selectDict')
  private selectDict() {
    //window.console.info('事件触发')
  }
}
</script>