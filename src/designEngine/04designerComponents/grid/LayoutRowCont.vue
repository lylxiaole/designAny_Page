<template>
  <div>

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  NumberList_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName
} from '../../02common/commonClasses/LayoutProperty'
import { AllComponents, ComponentBase } from '..'
import { DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import common from '../../02common/commonMethod'
import LayoutBase, { SaveInfo, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import NpGridCol from './NpGridCol.vue'

class fragmentRecord {
  id: string
  frag: DocumentFragment
}

@Component
export default class LayoutRowCont extends Vue {
  public addControl() {}

  mounted() {}
}
</script>
<style scoped>
</style>
