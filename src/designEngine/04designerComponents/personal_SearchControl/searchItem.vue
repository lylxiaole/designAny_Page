<template>
  <div :style="{width:'100%', height:innerComp==null?'0px':innerComp.height+'px'}" class="opop">

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
import $ from 'jquery'
import PageBase from '../../05designerLayouts/PageBase'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import common from '../../02common/commonMethod'
import {
  ModelInfo,
  modelSimpleInfo,
  modelDetailInfo,
  ModelProperty,
  propertyValidator,
  ModelBindingProperty
} from '../../02common/impResourcesCache/modelAnalysis'
import { ComponentBase, AllComponents } from '..'
import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { isNull } from 'xe-utils/methods'

@Component({
  components: {}
})
export default class searchItem extends Vue {
  public innerComp: ComponentBase = null

  mounted() {}

  public mountComp(compFrag: DocumentFragment) {
    // window.console.log('船舰formitem子组件')
    $(this.$el).append(compFrag)
    $(this.$el)
      .children()
      .css('top', '0px')
    $(this.$el)
      .children()
      .css('left', '0px')
  }
}
</script>

<style scoped>
form .has-feedback > .ant-select .ant-select-arrow,
form .has-feedback > .ant-select .ant-select-selection__clear,
form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-arrow,
form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-selection__clear {
  right: unset;
}
</style>