/** * 
输入框复合组件，使用select和button组合而成 * By xuww 
zindex调整，显示的时候显示到拖拽之上
*/
<template>
  <div style="width:100%;display:flex;" oncontextmenu="self.event.returnValue=false">
    <a-tooltip placement="right" title="" style="width:100%;display:flex">
      <a-input placeholder="请选择" v-model="Text" :disabled='true' ref="textInput" v-bind:style="{paddingLeft:PaddingLeft+ 'px', 
      paddingRight:3+ 'px',height:'34px',zIndex:zIndex}" allowClear :title="Text">
      </a-input>
      <a-button type="primary" :disabled="disabled" @click="onClick" v-bind:style="{enabled:'true',height:'34px'}" class="compositeButton">
        <a-icon type="plus" ghost></a-icon>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Text_Property, Behavior_Property, Enum_Property, PropertyGroupName } from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { SaveInfo, LayoutType, LayoutInfo, DragItemTypeEnum, LayoutBase } from '../../03designerLayoutBase'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import common from '../../02common/commonMethod'
import InputComponent from './InputComponent.vue'
import ButtonComponent from '../buttonComponents/ButtonComponent.vue'
import { param, paramType } from '../../03designerLayoutBase'

@Component
export default class inputCompositeTemplate extends ComponentBase {
  buttonDisabled: boolean = false
  inparam: param[]
  outparam: param
  //inputwidth:number=200
  public PageComponentIncrustations: CompIncrustationPro[] = []
  mounted() {
    this.width = 200
    this.height = 50
    this.canDrag = true
    this.canDrop = true

    this.registerProperty('文本', PropertyGroupName.special, new Text_Property(), '', true)
    this.registerProperty('主键Id', PropertyGroupName.special, new Text_Property(), null, true)
    this.registerEvents('按钮点击事件', '', this.inparam, this.outparam)
    //this.registerEvents('确认按钮回调事件', '', this.inparam, this.outparam)
  }

  /** 添加一个验证属性 */
  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '主键Id')
    return property
  }

  get inputwidth(): any {
    var pro = this.findPropertyByName('基础设置', '宽度')
    //window.console.log('(parseInt(pro.value) -50)', parseInt(pro.value) - 100)
    //window.console.log('---------------------width', this.width)
    //window.console.log('---------------------复合输入框组件', this)
    return (parseInt(pro.value) - 50 + 'px') as any
  }

  buttonTimeOut: boolean = true
  private onClick() {
    //let timeoutProperty = this.findPropertyByName(PropertyGroupName.special, '点击时间间隔')
    if (this.buttonTimeOut) {
      this.buttonTimeOut = false
      // let timeout = timeoutProperty && timeoutProperty.value ? (timeoutProperty.value as number) : 1000
      // if (timeout < 1000) {
      //   timeout = 1000
      // }
      setTimeout(() => {
        this.buttonTimeOut = true
      }, 500)
      //window.console.log('触发点击事件1212121212')
      this.triggeEvent('按钮点击事件', null)
    }
    //触发事件
    //window.console.log('触发点击事件1212121212')
    //this.triggeEvent('按钮点击事件', null)
  }

  get PaddingLeft(): string {
    if (this.findProperties(PropertyGroupName.special, '左内边距')[0]) {
      //window.console.log('文本输入框组件左边距变了')
      return this.findProperties(PropertyGroupName.special, '左内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingTop(): string {
    if (this.findProperties(PropertyGroupName.special, '上内边距')[0]) {
      //window.console.log('文本输入框组件上边距位置变了')
      return this.findProperties(PropertyGroupName.special, '上内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingRight(): string {
    if (this.findProperties(PropertyGroupName.special, '右内边距')[0]) {
      //window.console.log('文本输入框组件右边距位置变了')
      return this.findProperties(PropertyGroupName.special, '右内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingBottom(): string {
    if (this.findProperties(PropertyGroupName.special, '下内边距')[0]) {
      //window.console.log('文本输入框下内边距变了')
      let data = this.findProperties(PropertyGroupName.special, '下内边距')[0].value as string
      return data
    }
    return ''
  }

  get Text(): string {
    var property = this.findPropertyByName(PropertyGroupName.special, '文本')
    //window.console.log('---------------------------------------复合输入框属性变更property', property)
    return property ? property.value : ''
  }

  set Text(val) {
    var property = this.findPropertyByName(PropertyGroupName.special, '文本')
    this.setPropertyVal(property.id, val)
  }

  get zIndex(): number {
    if (this.IsDesigning == true) {
      return 1
    }
    return 4
  }
  get Color(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      // console.log('文本输入框前景色变了')
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    } else {
      return ''
    }
  }
}
</script>
 
<style scoped lang="less">
.ant-btn-primary[disabled] {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: #d9d9d9;
  color: #b7b7b7;
}
.ant-btn-primary {
  background-color: #4076a8;
  border-color: #4076a8;
}
//.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: #4076a8;
  border-color: #4076a8;
}
///deep/ .ant-input-disabled {
//  background-color: rgba(0, 0, 0, 0.05);
//  border-color: #d9d9d9;
//  color: #b7b7b7;
//}
</style>