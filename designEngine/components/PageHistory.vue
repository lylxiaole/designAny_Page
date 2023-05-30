<template>
  <s-modal subtitle="历史版本" :operationType='this.operation.edit' :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" width="70%"
    @cancel="handleCancel" :okText="okText" :cancelText="cancelText">
    <v-table ref="table" :columns="columns" :data="loadData" @select="handleSelect" :checkMethod="checkMethod" :showRadioColumn="true"
      :showSelection="false">
    </v-table>
  </s-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { CurrentApis } from '../01designerContext'
import { SModal, VTable } from '@/components'

@Options({
  components: {
    SModal,
    VTable
  }
})
export default class PageHistory extends Vue {
  private visible: boolean = false
  private confirmLoading: boolean = false
  private pageId: number

  private currentHistoryId: number
  private columns: any[] = [
    {
      title: '版本号',
      dataIndex: 'version',
      columnType: 'date'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '修改人',
      dataIndex: 'modifier'
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      columnType: 'date'
    }
  ]

  private okText = '确定'
  private cancelText = '取消'

  mounted() {}
  // ********************************************************
  private loadData(parameter: any) {
    window.console.log('loadData:', parameter)
    parameter.filter = this.pageId
    parameter.orders = [{ fieldName: 'modifyTime', direction: 'DESC' }]
    return CurrentApis.GetPageHistories(parameter)
      .then((res) => {
        return res
      })
      .catch((err) => {})
  }
  private handleSelect(selections: any[]) {
    if (selections.length < 1) {
      return
    }
    let selection = selections[0]
    window.console.log('handleSelect1:', selection)
    this.currentHistoryId = selection.id
  }
  private checkMethod(row: any) {
    return row.modelStatus === 0
  }
  private handleSubmit() {
    window.console.log('handleSubmit')
    this.onSelectHistory(this.currentHistoryId)
    this.visible = false
  }
  private handleCancel() {
    this.visible = false
  }
  // ********************************************************
  public async show(pageId: number) {
    this.visible = true
    this.pageId = pageId
    await this.$nextTick()
    ;(this.$refs.table as any).refresh(true)
  }

  public async startRostore() {
    this.okText = '回滚'
  }
  public async startViewHistory() {
    this.okText = '确定'
  }

  @Emit('onSelectHistory')
  public onSelectHistory(historyId: number) {}
}
</script>

<style lang="less" scoped>
</style>