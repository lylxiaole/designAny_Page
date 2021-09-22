<template>
  <div>
    <a-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgb(0,103,138,0.1);border-color:rgb(0,103,138,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEdit" size="small">
      <a-icon style="font-size:20px" :component="bindingModelsicon" />绑定模型</a-button>
    <a-modal :maskClosable="false" title="绑定模型" v-model="windowVisible" width="95%" @ok="onOk" @cancel="onCancel" destroyOnClose
      :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}" cancelText="取消" okText="确定">
      <a-row style="height:600px">
        <a-col :span="6" style="height:100%;">
          <currentPageControls :allBindingInfos="value_clone" :currentComponents="currentLayouts" @onSelectProperty="onSelectProperty" />
        </a-col>

        <a-col :span="8" style="height:100%;overflow-y:auto" v-if="controlPropertyBindModelInfo">
          <modelCase style="width:100%;" :controlPropertyBindModelInfo.sync="controlPropertyBindModelInfo" :currentPage="currentPage"
            @onSelectModel="onSelectModel" />
        </a-col>

        <a-col :span="10" style="height:100%;overflow-y:aoto" v-if="bindingClassType==1">
          <chooseModelCodes ref="chooseModeCodescon" :currentPage="currentPage" :controlPropertyBindModelInfo="controlPropertyBindModelInfo"
            :currentModelDetailInfo="currentModelDetailInfo" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'

import modelAnalysis, { modelDetailInfo } from '../../02common/impResourcesCache/modelAnalysis'

import modelBingding, { bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import {
  Property,
  PropertyType,
  Text_Property,
  Behavior_Property,
  Number_Property,
  PropertyGroupName,
  Color_Property,
  UploadFile_Property,
  Boolean_Property
} from '../../03designerLayoutBase'

import currentPageControls from './currentPageControls.vue'
import modelCase from './modelCase.vue'
import chooseModelCodes from './chooseModelCodes.vue'
import { bindingModelsIco } from '../../assets/icons.js'

class TreeInfo {
  public key: string
  public title: string
  public children: TreeInfo[] = []
}

@propertyCellTypeAttr(PropertyTypeEnum.bindingModels)
@Component({
  components: {
    modelCase: modelCase,
    currentPageControls: currentPageControls,
    chooseModelCodes: chooseModelCodes
  }
})
export default class bindingModels extends propertyCellBase {
  public windowVisible: boolean = false
  /**当前页面中所有的模型绑定信息 */
  private value_clone: bindingModelVal_InProperty[] = []
  /**当前的控件属性的模型绑定信息 */
  private controlPropertyBindModelInfo: bindingModelVal_InProperty = null
  private bindingModelsicon: any
  created() {
    this.bindingModelsicon = bindingModelsIco
  }

  //当前选中的模型实例的模型详细信息，从网络获取
  currentModelDetailInfo: modelDetailInfo = null
  /**当前控件属性的绑定的模型实例 改变 */
  private onSelectModel() {
    //window.console.log('获取当前按选择的模型实例')
    if (!this.controlPropertyBindModelInfo) {
      return
    }
    var modelName = this.controlPropertyBindModelInfo.modelName

    var binding = this.currentPage.modelBindings.filter((o) => o.modelBindingName == modelName)[0]
    if (!binding) {
      this.currentModelDetailInfo = null
      return
    }
    //var binding = Object.assign(tempbinding)
    if (binding.modelBindingType == 2) {
      this.currentModelDetailInfo = null
      return
    }
    //Update By LH 2020/07/28
    if (!this.currentModelDetailInfo) {
      this.currentModelDetailInfo = modelAnalysis.getModelInfoById(binding.modelBindingInfo.modelId, false)
    } else {
      this.currentModelDetailInfo = modelAnalysis.getModelInfoById(binding.modelBindingInfo.modelId)
    }
  }

  /** 选择控件属性,触发事件 */
  private onSelectProperty(comp: ComponentBase, property: Property) {
    //window.console.log('选择控件属性', property)
    if (property) {
      var findBinding = this.value_clone.find((o) => o.propertyId == property.id)
      if (!findBinding) {
        findBinding = new bindingModelVal_InProperty()
        findBinding.propertyId = property.id
        findBinding.modelName = ''
        findBinding.modelCodes = []
        this.value_clone.push(findBinding)
      }
      this.controlPropertyBindModelInfo = findBinding
    } else {
      this.controlPropertyBindModelInfo = null
    }

    this.onSelectModel()
  }

  private get bindingClassType(): number {
    if (!this.controlPropertyBindModelInfo) {
      return -1
    }
    var binding = this.currentPage.modelBindings.find((o) => o.modelBindingName == this.controlPropertyBindModelInfo.modelName)
    if (!binding) {
      return -1
    }
    return binding.modelBindingType
  }
  /***********基础造作*********************************** */
  private startEdit() {
    this.controlPropertyBindModelInfo = null
    this.currentModelDetailInfo = null
    this.value_clone = []
    // window.console.log('开始编辑模型绑定', this.currentValue)
    if (!this.currentValue) {
      this.value_clone = []
    } else {
      this.value_clone = common.clone(this.currentValue)
    }
    this.windowVisible = true
  }

  private onOk() {
    //window.console.log('this.value_clone', this.value_clone)
    //绑定模型，判断一下只有筛选的情况下才需要手动触发bindType: "filter"
    if (this.value_clone && this.value_clone.length > 0 && this.value_clone[0].bindType === bindTypeEnum.filter) {
      let newproperty = this.currentLayouts[0].properties.find((item) => item.propertyName === '绑定模型')
      this.currentLayouts[0].onPropertyChanged(newproperty.id, newproperty, this.currentLayouts[0])
    }
    this.currentValue = this.value_clone
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>