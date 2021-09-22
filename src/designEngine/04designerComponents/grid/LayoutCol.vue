<template>
  <a-row>
    <a-col v-for="item in fragmentRecords" :key="item.id" :span="getItemSpan(item.id)"
      :style="{border:IsDesigning==true?'1px dashed hsla(0, 0%, 66.7%, 0.5)':'none',height:'100%' }">
      <div :ref="item.id" style="width:100%;height:100%;position:relative">
        <div v-if="IsDesigning" style="width:25px;height:100%;position:absolute;height:30px;right:0px;top:0px">
          <div class="widget-view-action-right" style="margin-top:24px">
            <a-button type="link" icon="delete" @click="()=>{onFormItemDelete(item)}" ghost />
          </div>
          <div class="widget-view-action-right" style="margin-top:8px">
            <a-button type="link" icon="arrow-left" @click="()=>{onChangeItemIndex(item,true)}" ghost />
          </div>
          <div class="widget-view-action-right" style="margin-top:8px">
            <a-button type="link" icon="arrow-right" @click="()=>{onChangeItemIndex(item,false)}" ghost />
          </div>
        </div>
      </div>
    </a-col>
    <div v-if="fragmentRecords.length===0">
      <a-empty />
    </div>
  </a-row>
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
  Boolean_Property,
  PropertyGroupName
} from '../../03designerLayoutBase'
import { AllComponents, ComponentBase } from '..'
import { DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import common from '../../02common/commonMethod'
import LayoutBase, { SaveInfo, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import NpGridCol from './NpGridCol.vue'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'

class fragmentRecord {
  id: string
  frag: DocumentFragment
}

@Component
export default class LayoutCol extends ComponentBase {
  private fragmentRecords: fragmentRecord[] = []
  private compIns: CompIncrustationPro[] = []

  mounted() {
    if (this.IsDesigning) {
      this.canDrag = true
      this.canDrop = true
      this.registerProperty('自适应父容器', '特有布局', new Boolean_Property(), false)
    }
  }

  protected renderComponent(dropcomp: NpGridCol, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    let documentFrag = window.document.createDocumentFragment()
    let tmpNode = window.document.createElement('div')
    documentFrag.appendChild(tmpNode)
    // ****************************************
    dropcomp.parentPage = this.parentPage
    dropcomp.parentLayout = this
    dropcomp.registerProperty('列占比', '特有布局', new Number_Property(1, 24, 1), 8)
    dropcomp.$on('onPropertyChanged', this.onCompPropertyChanged)
    let compIn = new CompIncrustationPro()
    compIn.positionval = 'static'
    compIn.$mount(tmpNode)
    compIn.$forceUpdate()
    compIn.AddComponent(dropcomp)
    this.compIns.push(compIn)
    // ****************************************
    if (data) {
      this.drawcomp({ id: data.id, frag: documentFrag })
    } else {
      this.drawcomp({ id: dropcomp.Id, frag: documentFrag })
    }
    return dropcomp
  }

  private async drawcomp(record: fragmentRecord) {
    this.fragmentRecords.push(record)
    await this.$nextTick()
    let rowele = this.$refs[record.id][0]
    $(rowele).append(record.frag)
    await this.fixedComponentSize()
  }

  protected loadCompleted(childrenData: SaveInfo[]) {
    this.fixedSelfSize()
    this.fixedComponentSize()
    // window.console.log('loadCompleted')
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)

    this.topParentPage.$on('onScaleSized', () => {
      this.fixedSelfSize()
      this.fixedComponentSize()
    })
  }
  public deleteChildComponents(compId: string): boolean {
    let find = this.compIns.find((o) => o.InnerComponent.Id == compId)
    if (find) {
      let index = this.compIns.indexOf(find)
      this.compIns.splice(index, 1)
    }
    let find2 = this.fragmentRecords.find((o) => o.id == compId)
    if (find2) {
      let index = this.fragmentRecords.indexOf(find2)
      this.fragmentRecords.splice(index, 1)
    }
    this.rendered(this.$el)
    return true
  }
  private onCurrentPropertyChanged(propertyId: string, property: Property, layout: LayoutBase): void {
    // window.console.log('onCurrentPropertyChanged:', property.propertyName)
    if (property.groupName == PropertyGroupName.normal && property.propertyName == '宽度') {
      this.fixedComponentSize()
      this.fixedSelfSize()
    } else if (property.groupName == PropertyGroupName.normal && property.propertyName == '高度') {
      this.fixedComponentSize()
      this.fixedSelfSize()
    } else if (property.groupName == '特有布局' && property.propertyName == '自适应父容器') {
      this.fixedSelfSize()
    }
  }
  private onCompPropertyChanged(propertyId: string, property: Property, layout: LayoutBase): void {
    // window.console.log('onCompPropertyChanged:', property.groupName, property.propertyName)
    if (property.groupName == '特有布局' && property.propertyName == '宽度自适应') {
      this.fixedComponentSize()
    } else if (property.groupName == '特有布局' && property.propertyName == '高度自适应') {
      this.fixedComponentSize()
    } else if (property.groupName == PropertyGroupName.normal && property.propertyName == '宽度') {
      this.fixedComponentSize()
    } else if (property.groupName == PropertyGroupName.normal && property.propertyName == '高度') {
      this.fixedComponentSize()
    }
  }
  private async fixedComponentSize() {
    for (let index = 0; index < this.compIns.length; index++) {
      const element = this.compIns[index]
      $(element.$el).css('height', '100%')
      $(element.$el).css('width', '100%')
    }
  }
  private async fixedSelfSize() {
    let isfixedSize = this.findPropertyByName('特有布局', '自适应父容器').value as boolean
    if (!isfixedSize) {
      return
    }

    if (!this.parentLayout) {
      return
    }
    this.width = this.parentLayout.width
    this.height = this.parentLayout.height
    this.left = 0
    this.top = 0
  }
  /******************************************************* */
  private getItemComponent(compId: string): ComponentBase {
    let comp = this.layoutChildren.find((o) => o.Id == compId) as ComponentBase
    if (!comp) {
      return
    }
    return comp
  }
  private getItemCanMove(compId: string): boolean {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return false
    }
    return true
  }
  private getItemCanDelete(compId: string): boolean {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return false
    }

    if (this.IsDesigning == true && comp.isSelected == true) {
      return true
    } else {
      return false
    }
  }
  private getItemSpan(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 8
    }
    let fproperty = comp.findPropertyByName('特有布局', '列占比')
    // window.console.log('getItemSpan:', fproperty)
    if (fproperty) {
      return fproperty.value
    }
    return 8
    // registerProperty('列占比', '特有布局', new Number_Property(1, 24, 1), 8)
  }
  /**upOrDown：true向上，false向下 */
  private async onChangeItemIndex(data: fragmentRecord, upOrDown: boolean) {
    window.event.stopPropagation()
    let comp = this.getItemComponent(data.id)
    this.parentPage.chooseComps([comp])

    let changedIndex = upOrDown == true ? -1 : 1
    /**调换item位置 */
    let itemIndex = this.fragmentRecords.indexOf(data)
    this.fragmentRecords.splice(itemIndex, 1)
    this.fragmentRecords.splice(itemIndex + changedIndex, 0, data)
    /**调换组件位置 */
    itemIndex = this.children.findIndex((o) => o.Id == data.id)
    let findchild = this.children[itemIndex]
    this.children.splice(itemIndex, 1)
    this.children.splice(itemIndex + changedIndex, 0, findchild)

    this.onChildrenCountChange()
  }

  private onFormItemDelete(data: fragmentRecord) {
    this.deleteChildComponents(data.id)
    let comp = this.getItemComponent(data.id)
    this.RemoveChild(comp)
  }
}
</script>
<style scoped>
.widget-view-action-left {
  position: relative;
  z-index: 999;
  float: left;
  background: #faad14;
}

.widget-view-action-right {
  position: relative;
  z-index: 999;
  float: right;
  background: #faad14;
}
</style>
