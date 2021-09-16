<template>
  <div>
    <div class="widget-view-action" v-if="IsDesigning&&itemSelected">
      <a-button type="link" icon="delete" @click="deleteClick" ghost></a-button>
    </div>
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
  PropertyGroupName,
} from '../../02common/commonClasses/LayoutProperty'
import $ from 'jquery'
import PageBase from '../../05designerLayouts/PageBase'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, bindTypeEnum } from '../../02common/commonClasses/modelBingding'
// import dragHelper, { dragulaExtand } from "../../02common/dragHelper";
import common from '../../02common/commonMethod'
import {
  ModelInfo,
  modelSimpleInfo,
  modelDetailInfo,
  ModelProperty,
  propertyValidator,
  ModelBindingProperty,
} from '../../02common/modelAnalysis/modelAnalysis'
import { ComponentBase, AllComponents } from '..'
import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'

@Component({
  components: {},
})
export default class NpFormItemShell extends ComponentBase {
  private compName: string = null
  private innerComp: ComponentBase = null

  public itemSelected: boolean = false

  @Prop()
  value: string

  @Watch('value')
  valueChange(val: any) {}

  created() {}

  mounted() {
    if (this.IsDesigning) {
      this.canDrop = true
      this.canDrag = true
      // this.onDrop_Event = this.onDrop
      // this.onDoubleClick_Event = this.onItemDoubleClick
      // this.onDrag_Event = this.listenOnDrag
    }
  }

  private onItemDoubleClick(e: Event, target: ComponentBase): void {
    e.stopPropagation()
    this.parentPage.chooseComps([this.children[0] as ComponentBase])
    this.itemSelected = true
  }
}
</script>

<style scoped>
.widget-view-action {
  position: relative;
  margin-top: -32px;
  /* margin-right: 5px; */
  z-index: 999;
  /* right: 0; */
  float: left;
  /* width: 32px; */
  /* height: 32px; */
  /* line-height: 32px; */
  background: #faad14;
}

.widget-view-model {
  position: relative;
  top: -20px;
  right: 3px;
  float: right;
  /* float: top; */
  font-size: 12px;
  color: #faad14;
  z-index: 999;
}
</style>