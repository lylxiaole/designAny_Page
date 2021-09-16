<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

// import $ from 'jquery'
// import PageBase from '../../05designerLayouts/PageBase'
// import dragHelper, { dragulaExtand } from "../../02common/dragHelper";
// import common from '../../02common/commonMethod'
import { ComponentBase } from '..'
// import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
// import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'

@Component({
  components: {},
})
export default class Placeholder extends ComponentBase {
  @Prop()
  compId: string

  mounted() {
    this.canDrop = false
    this.canDrag = false
    this.Id = this.compId
  }
}
</script>

<style scoped>
</style>