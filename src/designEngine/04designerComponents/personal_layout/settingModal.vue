<template>
  <geno-modal :maskClosable="false" title="自定义列宽" :destroyOnClose="true" v-model="windowVisible" width="550px" @ok="onSelectPageOk"
    @cancel="onSelectPageCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}"
    :cancelButtonProps="{ props: {icon: 'close'}}">
    <div style="width:500px;height:200px;position:relative">
      <a-input v-model="oldWidth" suffix="PX" />
    </div>
  </geno-modal>
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
import common from '../../02common/commonMethod'
import { SModal, VTable } from '@/components'
import personalLayout from './personalLayout.vue'
import PageBase from '../../03designerLayoutBase/PageBase'

@Component({
  components: {
    SModal,
    VTable
  }
})
export default class personalSettingModal extends Vue {
  private windowVisible: boolean = false
  private oldWidth: number = 0
  private compId: string
  public async show(width: any, compId: string) {
    this.windowVisible = true
    await this.$nextTick()
    await this.loadLayout(width, compId)
  }
  public close() {
    this.windowVisible = false
  }

  mounted() {}
  // ************************************************
  private async loadLayout(width: any, compId: string) {
    this.oldWidth = width
    this.compId = compId
  }
  // ************************************************
  private onSelectPageOk() {
    this.close()
    this.onOK(this.oldWidth, this.compId)
  }
  private onSelectPageCancel() {
    this.close()
    this.onCancel()
  }

  @Emit('onOK')
  public onOK(data: any, compId: string) {}
  @Emit('onCancel')
  public onCancel() {}
}
</script>

<style scoped>
.left {
  height: 100%;
  float: left;

  overflow: auto;
}
.right {
  height: 100%;
  float: right;
}
</style>