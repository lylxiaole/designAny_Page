 
/**
  此组件的存在，是为了兼容王乐乐在2019年编写的报表设计和打印组件。比较旧的项目在使用 
*/
<template>
  <div style="position:relative" :style="{'width':width+'px','height':height+'px','background':backgroundCute }"
    oncontextmenu="self.event.returnValue=false">

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Text_Property, Behavior_Property, Enum_Property, PropertyGroupName } from '../../02common/commonClasses/LayoutProperty'
import componentTemplate from './componentTemplate.vue'
import { SaveInfo, LayoutType, LayoutInfo, DragItemTypeEnum, DragItemData, LayoutBase } from '../../03designerLayoutBase'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import common from '../../02common/commonMethod'
import { printSelectedInnerHtml, previewSelectedInnerHtml } from '@/utils/printBase'
import genoPrintDesigner from '../../genoPrintDesigner.vue'

@Component
export default class printAreaComponent extends componentTemplate {
  mounted() {
    let inparam: any[] = []
    this.startPrintPopup('')
  }

  public currentDesigner: genoPrintDesigner
  private startPrintPopup(data: any) {
    //window.console.log('**********弹出打印控件了,传入参数是:', data)
    var tmpNode = window.document.createElement('div')

    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.IsDesigning

    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: tmpNode,
      end: async () => {
        this.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.IsDesigning = true
    this.currentDesigner.$mount(tmpNode)
    this.currentDesigner.StartPrint()
    this.currentDesigner.OpenPage('98978626600960', null)
  }
}
</script>
 
<style scoped>
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm 10mm 0mm 10mm; /* this affects the margin in the printer settings 最关键的还是这个*/
}
.page-break {
  page-break-after: always;
  page-break-inside: avoid;
  clear: both;
}
.page-break-before {
  page-break-before: always;
  page-break-inside: avoid;
  clear: both;
}
</style>