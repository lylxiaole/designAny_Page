<template>
  <a-modal :maskClosable="false" title="事件回调" v-model="isVisible" width="95%" @ok="onOk" @cancel="handleCancel"
    :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}" cancelText="取消" okText="确定">
    <div>
      <vxe-toolbar>
        <template v-slot:buttons>
          <a-button @click="addCallback" type="primary">新增</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table :data="allCallbacks" :stripe="true" :resizable="true" :keyboard-config="{isArrow: true}" :show-header="true" width="100%"
        height="470" :border="true" row-id="id" :edit-config="{trigger: 'dblclick', mode: 'cell'}" :select-config="{checkRowKeys:currentSelectedKeys}"
        highlight-current-row highlight-hover-row>

        <vxe-table-column type="index" width="60"></vxe-table-column>
        <vxe-table-column v-if="isChoosePageSource" field="modelBindName_InPopupPage" show-overflow title="弹窗模型实例">
          <template v-slot="{ row }">
            <a-select style="width:90%" v-model="row.modelBindName_InPopupPage">
              <a-select-option v-for="mb in modelBindingsInPage" :key="mb.modelBindingName" :value="mb.modelBindingName">{{mb.modelBindingName}}
              </a-select-option>
            </a-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="behaviorId_InMainPage" title="回调行为">
          <template v-slot="{ row }">
            <a-button @click="()=>{chooseBahavior(row.id)}" type="link">{{getBehaviorName(row.behaviorId_InMainPage)}}</a-button>
          </template>
        </vxe-table-column>
        <vxe-table-column width="180px">
          <template v-slot="{ row }">
            <a-button @click="()=>{deleteBehavior(row.id)}" type="link">删除</a-button>
          </template>
        </vxe-table-column>
      </vxe-table>
      <!-- ************************************************************* -->
      <behaviorListInPageModal :callboackbehaviorid="callboackbehaviorid" :isVisible.sync="behaviorListVisible"
        @onChooseBehavior="onChooseBehavior" />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '../../../../03designerLayoutBase/PageBase'
import ComponentBase from '../../../../04designerComponents/ComponentBase'
import LayoutBase from '../../../../03designerLayoutBase/LayoutBase'
import common from '../../../../02common/commonMethod'
import behaviorListInPageModal from '../../behaviorListInPageModal.vue'
import { Option } from 'ant-design-vue/types/select/option'
import { VNode } from 'vue'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, modelDataTypeEnum } from '../../../../02common/commonClasses/modelBingding'
import {
  groupNode,
  objectBase,
  objectType,
  object_Variable,
  object_FixedVal,
  resourceType,
  popupCallback,
  resourceSearchType,
  behavior
} from '../../../../02common/behavior'
import getSearchClass, { pageSearchBase } from '../../../../02common/behavior/04_actionReaourceTree'

@Component({
  components: {
    behaviorListInPageModal
  }
})
export default class callbackSetting extends Vue {
  //
  @Prop()
  private isVisible: boolean = false

  @Emit('update:isVisible')
  private updateIsVisible_Inner(val: any) {}

  private isChoosePageSource: boolean = true

  //弹窗页面
  public page: PageBase
  private callboackbehaviorid: string = ''
  //
  private behaviorListVisible: boolean = false
  // ********************************************************************************
  get currentSelectedKeys(): string[] {
    if (this.allCallbacks) {
      var res = this.allCallbacks.map((o) => o.id)
      return res
    }
    return []
  }

  private currentCallback: popupCallback = null
  //弹窗页面入参和主页面的行为的对应关系表
  private allCallbacks: popupCallback[] = []

  private chooseBahavior(callbackId: string) {
    this.currentCallback = this.allCallbacks.find((o) => o.id == callbackId)
    this.behaviorListVisible = true
  }
  //弹窗页面的所有模型实例
  private get modelBindingsInPage(): modelBingding[] {
    return this.page.modelBindings
  }
  private getBehaviorName(id: string) {
    //window.console.log('获取行为名称')
    var behavi: behavior = null
    if (pageSearchBase.currentPage) {
      behavi = pageSearchBase.currentPage.behaviors.find((o) => o.id == id)
    }

    if (behavi) {
      return behavi.name
    } else {
      return '请选择行为'
    }
  }
  private addCallback() {
    if (!this.allCallbacks) {
      this.allCallbacks = []
    }
    var newcb = new popupCallback()
    newcb.id = common.getUuid()
    newcb.modelBindName_InPopupPage = ''
    newcb.behaviorId_InMainPage = ''
    this.allCallbacks.push(newcb)
  }
  private deleteBehavior(callbackId: string) {
    var findIndex = this.allCallbacks.findIndex((o) => o.id == callbackId)
    this.allCallbacks.splice(findIndex, 1)
  }
  // ********************************************************************************
  private handleCancel() {
    this.updateIsVisible_Inner(false)
  }
  private onOk() {
    this.onCompleteSetting(this.allCallbacks)
    this.updateIsVisible_Inner(false)
  }
  private onChooseBehavior(behav: behavior) {
    if (this.currentCallback) {
      this.currentCallback.behaviorId_InMainPage = behav.id
    }
    // window.console.log('123选择了行为')
  }
  // ********************************************************************************
  @Emit('onCompleteSetting')
  private onCompleteSetting(cbs: popupCallback[]) {}
}
</script>

<style lang="less" scoped>
@import '../../../../assets/globlaTheme.less';
</style>
 