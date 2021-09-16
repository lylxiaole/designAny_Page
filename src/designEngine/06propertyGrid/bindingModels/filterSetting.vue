<template>
  <div>
    <a-button type="primary" class="themeButton" @click="startEdit" size="small">添加</a-button>
    <a-modal :maskClosable="false" title="添加筛选条件" :destroyOnClose="true" v-model="windowVisible" :width="900" @ok="onOk" @cancel="onCancel"
      cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
      <a-row style="height:600px">
        <a-col :span="8" style="height:100%;">
          <currentPageControls :currentComponents="currentLayouts" @onSelectProperty="onSelectProperty" />
        </a-col>

        <a-col :span="8" style="height:100%;" v-if="controlPropertyBindModelInfo">
          <modelCase :controlPropertyBindModelInfo="controlPropertyBindModelInfo" :currentPage="currentPage" @onSelectModel="onSelectModel" />
        </a-col>

        <a-col :span="8" style="height:100%;overflow-y:aoto" v-if="bindingClassType==1">
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
import PageBase from '../../05designerLayouts/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'

import modelAnalysis, { modelDetailInfo } from '../../02common/impResourcesCache/modelAnalysis'

import modelBingding from '../../02common/commonClasses/modelBingding'
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
  Boolean_Property,
} from '../../02common/commonClasses/LayoutProperty'

import currentPageControls from './currentPageControls.vue'
import modelCase from './modelCase.vue'
import chooseModelCodes from './chooseModelCodes.vue'

class TreeInfo {
  public key: string
  public title: string
  public children: TreeInfo[] = []
}

@Component
export default class filterSetting extends propertyCellBase {
  public windowVisible: boolean = false
  /**当前页面中所有的模型绑定信息 */
  private value_clone: bindingModelVal_InProperty[]
  /**当前的控件属性的模型绑定信息 */
  private controlPropertyBindModelInfo: bindingModelVal_InProperty = null
  //当前选中的模型实例的模型详细信息，从网络获取
  currentModelDetailInfo: modelDetailInfo = null
  /**当前控件属性的绑定的模型实例 改变 */
  private onSelectModel() {
    // window.console.log('获取当前按选择的模型实例')
    if (!this.controlPropertyBindModelInfo) {
      return null
    }
    var modelName = this.controlPropertyBindModelInfo.modelName

    var binding = this.currentPage.modelBindings.filter((o) => o.modelBindingName == modelName)[0]
    if (!binding) {
      this.currentModelDetailInfo = null
      return
    }

    if (binding.modelBindingType == 2) {
      this.currentModelDetailInfo = null
      return
    }
    //Update By LH 2020/07/28
    if(!this.currentModelDetailInfo){
      this.currentModelDetailInfo = modelAnalysis.getModelInfoById(binding.modelBindingInfo.modelId,false)
    }
    else{
       this.currentModelDetailInfo = modelAnalysis.getModelInfoById(binding.modelBindingInfo.modelId)
    }
    //this.currentModelDetailInfo = modelAnalysis.getModelInfoById(binding.modelBindingInfo.modelId)
  }

  /** 选择控件属性,触发事件 */
  private onSelectProperty(comp: ComponentBase, property: Property) {
    var findBinding = this.value_clone.find((o) => o.propertyId == property.id)
    if (!findBinding) {
      findBinding = new bindingModelVal_InProperty()
      findBinding.propertyId = property.id
      findBinding.modelName = ''
      findBinding.modelCodes = []
      this.value_clone.push(findBinding)
    }
    this.controlPropertyBindModelInfo = findBinding
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
    // window.console.log('开始编辑模型绑定', this.currentValue)
    if (!this.currentValue) {
      this.value_clone = []
    } else {
      this.value_clone = common.clone(this.currentValue)
    }
    this.windowVisible = true
  }

  private onOk() {
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