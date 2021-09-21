<template>
  <a-modal title="模型实例" :maskClosable="false" :bodyStyle="{padding:'0px 8px 8px 8px',background: '#FFF'}" destroyOnClose style="height:67.78%;"
    :visible="isShow" width="55.73%" @ok="onOk" @cancel="onCancel" cancelText="关闭" okText=" 确定"
    :okButtonProps="{ props: {icon: 'check'},style:{display:'none'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
    <div style="height:100%;background:#FFF;">
      <a-row style="height:46px;margin:0px 0px 8px 8px;background:#F6F6F6;">
        <a-col :span="24">
          <div style="width:100%;height:100%;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
            <div style="background:#18aeb7;width:6px;height:46px;"></div>
            <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">模型实例库</span>
            <np-model-add style="width:400px;margin-left:30px;" @onSure="onAddNewModelBinding" :isShowTitle="false" :currentPage="currentPage">
            </np-model-add>
          </div>
        </a-col>
      </a-row>
      <a-row style="padding:0px 0px 8px 8px;height:550px;">
        <a-table :scroll="{ y: 500}" :columns="modelColumns" rowKey="modelBindingName" :dataSource="allBindingModels" :pagination="false" bordered>
          <span slot="serial" slot-scope="text,record,index">
            {{ index + 1 }}
          </span>
          <span slot="action" slot-scope="record">
            <a-tooltip placement="top">
              <template slot="title">
                <span>编辑</span>
              </template>
              <a-button @click="()=>{editBindingModel(record)}" type="link">
                <a-icon style="font-size:14px" :component="buttonEditIcon" />编辑</a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip placement="top">
              <template slot="title">
                <span>移除</span>
              </template>
              <a-button @click="()=>{deleteBindingModel(record)}" type="link">
                <a-icon style="font-size:14px" :component="buttonDeleteIcon" />移除</a-button>
            </a-tooltip>
          </span>
        </a-table>
      </a-row>
    </div>
    <div>
      <np-model-edit ref="editModelWindow" @onSure="onEditModelBinding"></np-model-edit>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '../../03designerLayoutBase/PageBase'
import common from '../../02common/commonMethod'
import modelBingding, { modelDataTypeEnum } from '../../02common/commonClasses/modelBingding'
import addModelWindow from './addModelWindow.vue'
import editModelBindWindow from './editModelBindWindow.vue'
import { buttonDeleteIco, buttonEditIco } from '../../assets/icons.js'

@Component({
  components: {
    npModelAdd: addModelWindow,
    npModelEdit: editModelBindWindow
  }
})
export default class modelListPop extends Vue {
  @Prop({ required: true }) currentPage: PageBase
  @Prop({ required: true, default: false }) isShow: boolean

  private buttonDeleteIcon: any = buttonDeleteIco
  private buttonEditIcon: any = buttonEditIco

  private modelColumns: any[] = [
    {
      title: '#',
      width: 50,
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '名称',
      dataIndex: 'modelBindingName',
      key: 'modelBindingName'
    },
    {
      title: '类型',
      dataIndex: 'modelBindingType',
      key: 'modelBindingType',
      customRender: (text, record, index) => {
        return this.getBindingModelTypeName(record)
      },
      width: 120
    },
    {
      title: '数据类型',
      dataIndex: 'modelDataType',
      key: 'modelDataType',
      customRender: (text, record, index) => {
        return this.getBindingModelDataTypeName(record)
      },
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 230,
      scopedSlots: { customRender: 'action' }
    }
  ]

  @Watch('isShow')
  onIsShowChanged(val) {
    if (val) {
      this.allBindingModels = common.clone(this.currentPage.modelBindings)
    }
  }

  //页面所有模型实例
  private allBindingModels: modelBingding[] = []

  // created() {
  //   window.console.log('created')
  // }

  private getBindingModelTypeName(record: modelBingding): string {
    if (record) {
      if (record.modelBindingType === 1) {
        return '系统模型'
      }
      if (record.modelBindingType === 2) {
        return '简单类型'
      }
    }
    return ''
  }

  private getBindingModelDataTypeName(record: modelBingding): string {
    if (record) {
      switch (record.modelDataType) {
        case modelDataTypeEnum.single:
          return '单模型'
        case modelDataTypeEnum.list:
          return '集合'
        case modelDataTypeEnum.tree:
          return '树模型'
        default:
          break
      }
    }
    return ''
  }

  public onAddNewModelBinding(modelBinding: modelBingding) {
    const index = this.allBindingModels.findIndex((x) => x.modelBindingName === modelBinding.modelBindingName)
    if (index < 0) {
      this.allBindingModels.push(modelBinding)
      this.currentPage.addModelBinding(modelBinding)
    }
  }

  public onEditModelBinding(modelBinding: modelBingding) {
    const index = this.allBindingModels.findIndex((x) => x.modelBindingName === modelBinding.modelBindingName)
    if (index >= 0) {
      this.allBindingModels.splice(index, 1, common.clone(modelBinding))
      this.currentPage.updateModelBind(modelBinding)
    }
  }

  private editBindingModel(record: modelBingding) {
    ;(this.$refs.editModelWindow as any).startEdit(record)
  }

  private deleteBindingModel(record: modelBingding) {
    const index = this.allBindingModels.findIndex((x) => x.modelBindingName === record.modelBindingName)
    if (index >= 0) {
      this.allBindingModels.splice(index, 1)
      this.currentPage.removeModelBinding(record.modelBindingName)
    }
  }

  private onOk() {
    // this.currentPage.modelBindings = this.allBindingModels
    this.close()
  }
  private onCancel() {
    this.close()
  }

  @Emit('close')
  private close() {}
}
</script>

<style lang="less" scoped>
</style>