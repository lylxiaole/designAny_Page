<template>
  <geno-modal :maskClosable="false" title="配置列表" :destroyOnClose="true" v-model="windowVisible" :width="600" :height="500" @ok="onSelectPageOk"
    @cancel="onSelectPageCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}"
    :cancelButtonProps="{ props: {icon: 'close'}}">
    <vxe-table ref="table" :data="loadData" :showSelection="false">
      <vxe-table-column type="seq" title="操作" width="60"></vxe-table-column>
      <vxe-table-column field="showName" title="字段列"></vxe-table-column>
      <vxe-table-column title="显示" width="80">
        <template v-slot="{ row }">
          <vxe-checkbox v-model="row.show"></vxe-checkbox>
        </template>
      </vxe-table-column>
      <vxe-table-column type="action" title="操作" sortable width="120">
        <template v-slot="{ row }">
          <a-icon style="margin-left:6px;cursor:pointer" @click="moveUpMethod(row)" :component="mouveupIcon(row)" />
          <a-icon style="margin-left:6px;cursor:pointer" @click="moveDownMethod(row)" :component="mouvedownIcon(row)" />
          <a-icon style="margin-left:6px;cursor:pointer" @click="moveTopMethod(row)" :component="mouvetopIcon(row)" />
        </template>
      </vxe-table-column>
    </vxe-table>
  </geno-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import $ from 'jquery'
import common from '../../02common/commonMethod'
import { SModal, VTable } from '@/components'

import { move_up, move_up_disable, move_down, move_down_disable, move_top, move_top_disable } from './icons.js'

class personal_config {
  compId: string
  showName: string
  show: boolean
}

@Component({
  components: {
    SModal,
    VTable
  }
})
export default class personalSettingModal extends Vue {
  private windowVisible: boolean = false
  public show(configs: personal_config[]) {
    this.windowVisible = true
    this.loadData = configs
  }
  public close() {
    this.windowVisible = false
  }
  // ************************************************
  private loadData: personal_config[] = []

  // ************************************************
  private mouveupIcon(config: personal_config) {
    let itemIndex = this.loadData.indexOf(config)
    if (itemIndex == 0) {
      return move_up_disable
    } else {
      return move_up
    }
  }
  private mouvedownIcon(config: personal_config) {
    let itemIndex = this.loadData.indexOf(config)
    if (itemIndex == this.loadData.length - 1) {
      return move_down_disable
    } else {
      return move_down
    }
  }
  private mouvetopIcon(config: personal_config) {
    let itemIndex = this.loadData.indexOf(config)
    if (itemIndex == 0) {
      return move_top_disable
    } else {
      return move_top
    }
  }

  private moveUpMethod(config: personal_config) {
    let itemIndex = this.loadData.indexOf(config)
    this.loadData.splice(itemIndex, 1)
    this.loadData.splice(itemIndex - 1, 0, config)
  }
  private moveDownMethod(config: personal_config) {
    let itemIndex = this.loadData.indexOf(config)
    this.loadData.splice(itemIndex, 1)
    this.loadData.splice(itemIndex + 1, 0, config)
  }
  private moveTopMethod(config: personal_config) {
    let itemIndex = this.loadData.indexOf(config)
    this.loadData.splice(itemIndex, 1)
    this.loadData.unshift(config)
  }

  mounted() {}

  private onSelectPageOk() {
    this.onOK(this.loadData)
    this.close()
  }
  private onSelectPageCancel() {
    this.onCancel()
    this.close()
  }

  @Emit('onOK')
  public onOK(configs: personal_config[]) {}
  @Emit('onCancel')
  public onCancel() {}
}
</script>

<style scoped>
</style>