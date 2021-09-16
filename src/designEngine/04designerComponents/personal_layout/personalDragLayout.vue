<template>
  <div :class="{drag:dragging}" style="position:relative">
    <div class="layout-container">
      <div :class="key" v-for="(item, key) in personalSetting" :key="key" class="dragArea">
        <draggable v-bind="dragOptions" class="list-group" :list="item" @end="onEndDrag" @start="onStartDrag">
          <transition-group name="list">
            <div class="list-group-item" v-for="element in item" :key="element.id" v-show="IsDesigning||isPersonalSetting||element.isShow">
              <div :id="element.id" class=" component-box" :style="{width:element.width?element.width+'px':'auto'}">
              </div>

              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link drag-handle"
                  style="position: absolute;right: -4px;top: -20px;z-index: 999;font-size: 25px;color: #bdbdbd;width: 25px;"
                  @click="e => e.preventDefault()">
                  ...
                </a>
                <a-menu slot="overlay" @click="(e)=>{handleMenuClick(e,element.id)}">
                  <a-menu-item key="show">显示 </a-menu-item>
                  <a-menu-item key="hide">隐藏 </a-menu-item>
                  <a-menu-item key="showAll">显示所有 </a-menu-item>
                  <a-menu-item key="colWidth">列宽 </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>

    <div style="position:absolute;left:0px;right:0px;top:0px;bottom:0px" v-if="children.length===0">
      <a-empty />
    </div>

    <settingModal ref="settingModal" @onOK="onNewWidth" @onCancel="onCancelWidth" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  NumberList_Property,
  Boolean_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName
} from '../../02common/commonClasses/LayoutProperty'
import $ from 'jquery'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { search, reset } from '../../02common/icons.js'
import PageBase from '../../05designerLayouts/PageBase'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import common from '../../02common/commonMethod'
import {
  ModelInfo,
  modelSimpleInfo,
  modelDetailInfo,
  ModelProperty,
  propertyValidator,
  ModelBindingProperty
} from '../../02common/impResourcesCache/modelAnalysis'
import { ComponentBase, AllComponents } from '..'
import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { isNull } from 'xe-utils/methods'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import draggable from 'vuedraggable'

import settingModal from './settingModal.vue'

class compRecord {
  documentFrag: DocumentFragment
  compId: string
}
@Component({
  components: { draggable, settingModal }
})
export default class personalDragLayout extends ComponentBase {
  private dragging: boolean = false
  private personalConfigId: string = null
  private isLoadedPersonalSetting: boolean = false
  private targerDom: any = null
  private get settingModal(): any {
    return this.$refs.settingModal
  }

  private get dragOptions() {
    return {
      animation: 0,
      handle: '.drag-handle',
      group: 'description',
      ghostClass: 'ghost',
      chosenClass: 'sortable',
      forceFallback: true
    }
  }

  private get colCount() {
    var property = this.FindPropertyByName(PropertyGroupName.special, '列数')
    if (!property) {
      return 1
    }
    return property.value
  }

  private get personalSetting() {
    var property = this.FindPropertyByName(PropertyGroupName.special, '布局')
    if (!property) {
      return { 0: [] }
    }
    return property.value
  }

  private set personalSetting(val: any) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '布局')
    if (!property) {
      return
    }
    property.value = val
  }

  mounted() {
    if (this.IsDesigning) {
      this.canDrop = true
      this.canDrag = false
      let numberProperty = new Number_Property()
      numberProperty.min = 1
      numberProperty.max = 9999
      this.RegisterProperty('列数', PropertyGroupName.special, new Number_Property(), 1, true, true, '')
      this.RegisterProperty('布局', PropertyGroupName.special, null, { 0: [] }, false, false, '')
      this.RegisterProperty('自适应父容器', '特有布局', new Boolean_Property(), false)

      this.$on('onPropertyChanged', this.onPropertyChangedInner)
    }
  }

  private onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    if (property.groupName === PropertyGroupName.special && property.propertyName === '列数') {
      this.organizeCol()
    }
    this.fixedSelfSize()
  }
  private async fixedSelfSize() {
    let isfixedSize = this.FindPropertyByName('特有布局', '自适应父容器').value as boolean
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
  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    let tmpNode = window.document.createElement('div')
    let domCache = window.document.createDocumentFragment()
    domCache.appendChild(tmpNode)
    ////////////////////////////////////////////
    var compIn = new CompIncrustationPro()
    compIn.$mount(tmpNode)
    compIn.$forceUpdate()
    if (this.IsDesigning == true) {
      this._dragHelper.makeDomCanDrag(compIn.$el)
    }

    /**在组件壳子中添加组件 */
    compCon.parentPage = this.parentPage
    compCon.left = 0
    compCon.top = 0
    compIn.AddComponent(compCon)
    compIn.positionval = 'static'

    this.rendered(this.$el)
    ////////////////////////////////
    let compid = compCon.Id
    if (data) {
      compid = data.id
    }
    this.addCompRecord(compid, domCache, compCon)
    return compCon
  }
  protected loadCompleted(childrenData: SaveInfo[]) {
    this.fixedSelfSize()
    this.loadPersonalConfig_afterload()
  }
  public deleteChildComponents(compId: string): boolean {
    this.removeItemById(compId)
    this.personalSetting = this.personalSetting
    return true
  }

  private async loadPersonalConfig_afterload() {
    await this.$nextTick()
    this.organizeCol()
    if (this.isLoadedPersonalSetting == false && this.IsDesigning == false) {
      this.loadLayout()
    }
  }
  private async addCompRecord(compId: string, domCache: DocumentFragment, compCon: ComponentBase) {
    let ishave = false

    let item = this.findItemById(compId)
    if (item) {
      ishave = true
    }
    if (ishave == false) {
      this.personalSetting[0].push({ id: compId, isShow: true, width: 80 })
    }
    await this.$nextTick()
    await this.drawCompUseSearchItem(compId, domCache)
  }
  private async drawCompUseSearchItem(compId: string, docuele: any) {
    let cachediv = null
    if (this.targerDom) {
      cachediv = $(this.targerDom).find('#' + compId)[0]
      this.targerDom = null
    } else {
      let keystr = '0'
      for (const key in this.personalSetting) {
        let array = this.personalSetting[key]
        if (array.find((o) => o.id == compId)) {
          keystr = key
          break
        }
      }
      cachediv = $(this.$el)
        .find('.' + keystr)
        .find('#' + compId)[0]
    }
    cachediv.append(docuele)

    $(cachediv)
      .find('div')
      .css('width', '100%')
    // $(cachediv)
    //   .find('div')
    //   .css('height', '100%')
  }
  private organizeCol() {
    let mainDataKeys = Object.keys(this.personalSetting)
    if (mainDataKeys.length > this.colCount) {
      for (let index = this.colCount; index < mainDataKeys.length; index++) {
        const item = this.personalSetting[index]
        if (item) {
          this.personalSetting[this.colCount - 1] = this.personalSetting[this.colCount - 1].concat(item)
          this.personalSetting[index] = undefined
        }
      }
    }

    for (let index = 0; index < this.colCount; index++) {
      let item = this.personalSetting[index]
      if (!item) {
        this.personalSetting[index] = []
      }
    }
    this.$forceUpdate()
  }
  private onStartDrag(e: any) {
    this.dragging = true
  }
  private async onEndDrag(e) {
    this.dragging = false
    if (e.from === e.to) {
      return
    }
    let compId = $(e.item)
      .find('.component-box')
      .attr('id')
    this.targerDom = e.to
    let findComp = this.children.find((o) => o.Id === compId)
    let compClass = this.findSystemCompByCode(findComp.layoutInfo.compCode)
    let data = common.clone(findComp.GetSaveData())
    let layoutInfo = common.clone(findComp.layoutInfo)
    ////////////////////////////////////////////////////////
    this.RemoveChildRecursion(compId)
    this.$forceUpdate()
    let comp = this.insertComponentLayout(compClass, layoutInfo, null, data)
    if (comp) {
      comp.LoadData(data)
    }

    if (this.IsDesigning === false) {
      await this.recordLayout()
    }
  }
  private async loadLayout() {
    if (this.IsDesigning) {
      return
    }
    this.isLoadedPersonalSetting = true
    let res = this.topParentPage.getCompPersonalSetting(this.Id) as any
    if (!res || !res.com_configuration) {
      return
    }

    this.personalSetting = res.com_configuration
    this.personalConfigId = res.id
    await this.$nextTick()
    let olddata = common.clone(this.GetSaveData())
    this.ReLoadData(olddata)
  }
  private async recordLayout() {
    if (this.IsDesigning) {
      return
    }
    if (!this.personalSetting) {
      return
    }
    if (!this.personalConfigId) {
      this.personalConfigId = await CurrentApis.GetUniqueIds(1)[0]
    }
    window.console.log('recordLayout:', this.personalSetting)
    await CurrentApis.SaveComponentConfig(this.Id, this.topParentPage.Id, this.personalSetting, this.personalConfigId)
  }
  private handleMenuClick(e: any, compId: string) {
    switch (e.key) {
      case 'hide':
        this.hideItem(compId)
        break
      case 'show':
        this.showItem(compId)
        break
      case 'showAll':
        this.showAllItem()
        break
      case 'colWidth':
        this.settingColWidth(compId)
        break
      default:
        break
    }
    if (this.IsDesigning === false) {
      this.recordLayout()
    }
  }
  private hideItem(compId: string) {
    let totalCount = this.getShowCount()
    if (totalCount == 1) {
      this.$notification.warning({ message: '警告', description: '至少显示一个项!' })
      return
    }
    let item = this.findItemById(compId)
    if (item) {
      item.isShow = false
    }
    this.personalSetting = this.personalSetting
    this.$forceUpdate()
  }
  private showItem(compId: string) {
    let item = this.findItemById(compId)
    if (item) {
      item.isShow = true
    }
    this.personalSetting = this.personalSetting
    this.$forceUpdate()
  }
  private showAllItem() {
    for (const key in this.personalSetting) {
      let array = this.personalSetting[key]
      for (let index = 0; index < array.length; index++) {
        let element = array[index]
        element.isShow = true
      }
    }
    this.personalSetting = this.personalSetting
    this.$forceUpdate()
  }
  private settingColWidth(comoId: string) {
    let item = this.findItemById(comoId)
    this.settingModal.show(item.width, comoId)
  }
  private onNewWidth(newWidth: number, compId: string) {
    let itemarray = this.findItemParentArray(compId)
    for (let index = 0; index < itemarray.length; index++) {
      const element = itemarray[index]
      element.width = newWidth
    }
    this.personalSetting = this.personalSetting
    this.$forceUpdate()
  }
  private onCancelWidth() {}
  private findItemById(compId: string) {
    for (const key in this.personalSetting) {
      let array = this.personalSetting[key]
      if (array.find((o) => o.id == compId)) {
        return array.find((o) => o.id == compId)
      }
    }
    return null
  }
  private removeItemById(compId: string) {
    for (const key in this.personalSetting) {
      let array = this.personalSetting[key]
      let itemindex = array.findIndex((o) => o.id == compId)
      if (itemindex > -1) {
        return array.splice(itemindex, 1)
      }
    }
    return null
  }
  private findItemParentArray(compId: string) {
    for (const key in this.personalSetting) {
      let array = this.personalSetting[key]
      if (array.find((o) => o.id == compId)) {
        return array
      }
    }
    return null
  }
  private getShowCount() {
    let count = 0
    for (const key in this.personalSetting) {
      let array = this.personalSetting[key]
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        if (element.isShow) {
          count++
        }
      }
    }
    return count
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;
  display: flex;
  .list-group-item {
    margin-bottom: 0px;
    border-radius: 0px;
    overflow: hidden;
    position: relative;
    background: #fff;
  }

  .drag-handle {
    cursor: move;
    color: #fff;
  }
}
.drag {
  .dragArea {
    border: 1px dashed #bdbdbd;
  }
  .list-group {
    min-width: 50px;
  }
  // .component-box {
  //   display: none;
  // }
}

.list-enter-active {
  transition: all 0.3s linear;
}
.list-enter,
.list-leave-to {
  opacity: 0.5;
}

.sortable {
  .dragArea {
    border: 1px dashed #bdbdbd;
  }
  .list-group {
    min-width: 50px;
  }
  // .component-box {
  //   display: none;
  //   height: 0;
  // }
}
.list-group {
  > span {
    display: block;
    min-height: 20px;
  }
}

.ghost {
  .drag-handle {
    background: rgb(129, 168, 187);
  }
}
</style>