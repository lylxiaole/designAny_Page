<template>
  <div :style="{width:innerComp==null?'0px':innerComp.width+'px', height:innerComp==null?'0px':innerComp.height+'px'}" class="opop">
    <div ref="drawArea" />
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
} from '../../03designerLayoutBase'
import $ from 'jquery'
import PageBase from '../../03designerLayoutBase/PageBase'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import { FormItemData } from './commonClasses'
import common from '../../02common/commonMethod'
import {
  ModelInfo,
  modelSimpleInfo,
  modelDetailInfo,
  ModelProperty,
  propertyValidator,
  ModelBindingProperty
} from '../../02common/impResourcesCache/modelAnalysis'
import { AllComponents } from '..'
import { ComponentBase } from '../../03designerLayoutBase'

import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { isNull } from 'xe-utils'

@Component({
  components: {}
})
export default class NpFormItem extends Vue {
  @Prop()
  private form: any
  @Prop()
  private formItemData: FormItemData
  private innerComp: ComponentBase = null

  mounted() {
    this.onMounted(this)
  }

  private Width(): string {
    // window.console.log('获取表单组建的item宽度')
    if (this.innerComp) {
      return this.innerComp.width + 'px'
    }
    return '0px'
  }

  public mountComp(comp: ComponentBase) {
    // window.console.log('船舰formitem子组件')
    var drawarea = this.$refs['drawArea'] as Element
    comp.$mount(drawarea)
    // if (comp.validateProperty) {
    //   // if (comp.curModelproperty.propertyType === 103){
    //   //   comp.curModelproperty.defaultValue = comp.curModelproperty.defaultValue+''
    //   // }
    //   comp.validateProperty.value = comp.curModelproperty.defaultValue
    // }
    //comp.validateProperty.value
    //window.console.log('---------------------------------------comp.validateProperty.value', Object.assign(comp.validateProperty))
    // this.initlizeFormVal(comp.validateProperty)
    comp.$watch('validateProperty', this.onValidatePropertyChange, { deep: true })

    this.innerComp = comp
  }

  private initlizeFormVal(newval: Property) {
    if (!newval) {
      return
    }
    var data = {}
    data[this.formItemData.Id] = newval.value
    //window.console.log('初始化属性', Object.assign(data))
    this.form.setFieldsValue(data)
  }

  private onValidatePropertyChange(newval: Property) {
    // window.console.log('组件属性变化了', this.form.getFieldValue(this.formItemData.Id))
    if (!newval) {
      return
    }

    var nval = newval.value
    var oval = this.form.getFieldValue(this.formItemData.Id)

    this.initlizeFormVal(newval)
    if ((nval == null || nval == undefined || nval == '') && (oval == null || oval == undefined || oval == '')) {
      return
    }

    this.form.validateFields([this.formItemData.Id])
  }

  @Emit('onMounted')
  protected onMounted(layout: NpFormItem) {}
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