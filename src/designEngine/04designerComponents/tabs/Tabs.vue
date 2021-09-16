<template>
  <div>
    <a-tabs :style="{backgroundColor:background,height:'100%'}" :activeKey="activeKey" @change="tabKeyChanged"
            :type="tabsType"
            :tabPosition="tabPosition" @keydown="onTabsKeyDown">
      <a-tab-pane v-for="item in TabTempItems" :ref="item.key" class="tab-pane-np"
                  style="height:-webkit-fill-available;" forceRender
                  :tab="item.value" :key="item.key">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import $ from 'jquery'
import {Component, Prop, Emit, Watch} from 'vue-property-decorator'
import {
  Property,
  TextList_Property,
  Enum_Property,
  PropertyGroupName,
  Boolean_Property
} from '../../02common/commonClasses/LayoutProperty'
import {param, paramType} from '../../02common/commonClasses/layoutEvent'
import {AllComponents, ComponentBase} from '..'
import common from '../../02common/commonMethod'
import {DragItemData, DragItemTypeEnum} from '../../03designerLayoutBase/BaseEvents'
import LayoutBase, {SaveInfo, LayoutInfo, LayoutType} from '../../03designerLayoutBase/LayoutBase'
import componentTemplate from '../componentTemplate/componentTemplate.vue'

@Component({
  name: 'npTabs',
  components: {compTemplate: componentTemplate}
})
export default class Tabs extends ComponentBase {
  public readonly tabTypePropName = '页签样式'
  public readonly tabLabelPropName = '页签名称'
  public readonly showTabHeaderPropName = '显示页签头'
  public readonly tabPositionPropName = '页签位置'
  // public readonly activeTabIndexPropName = '选中的页签索引'

  private flagKey: string = null
  activeKey: string = null
  TabTempItems: any[] = []

  created() {
    this.width = 400
    this.height = 600
    this.background = 'white'
    this.flagKey = common.getUuid()
    let cellData: any[] = [{key: this.flagKey, value: 'Tab1'}]
    this.RegisterProperty(this.tabLabelPropName, PropertyGroupName.special, new TextList_Property(), cellData)
    this.RegisterProperty(this.tabTypePropName, PropertyGroupName.special, new Enum_Property(true, ['线条式', '卡片式']), '线条式')
    this.RegisterProperty(this.tabPositionPropName, PropertyGroupName.special, new Enum_Property(true, ['上', '下', '右', '左']), '上')
    this.RegisterProperty(this.showTabHeaderPropName, PropertyGroupName.special, new Boolean_Property(), true)

    // this.RegisterProperty(this.activeTabIndexPropName, PropertyGroupName.special, new Number_Property(), 0)

    let inparam: param[] = []
    inparam.push({name: '标签页索引', type: paramType.number, val: null})
    this.RegisterMethods('切换标签页', '切换标签页', this.changeSelectedTab, inparam, null)
    let inparam2: param[] = []
    inparam2.push({name: '标签页索引', type: paramType.number, val: null})
    this.RegisterMethods('隐藏标签页', '隐藏标签页', this.hideTabs, inparam2, null)
    let inparam3: param[] = []
    inparam3.push({name: '标签页索引', type: paramType.number, val: null})
    this.RegisterMethods('显示标签页', '显示标签页', this.showTabs, inparam3, null)
    this.RegisterMethods('当前标签页索引', '获取当前标签页索引', this.getSelectedTabIndex, null, null)

    let inparam4: param[] = []
    let outparam4: param = null
    this.RegisterEvents('标签页切换事件', '', inparam4, outparam4)
    this.$on('onPropertyChanged', this.onTabsPropertyChanged)
  }

  mounted() {
    if (this.IsDesigning) {
      this.canDrop = true
      this.canDrag = true
    }
    if (this.layoutInfo && this.layoutInfo.data) {
      for (let index = 0; index < this.layoutInfo.data.length; index++) {
        this.showTabIndexArr.push(index)
      }
      this.activeKey = this.layoutInfo.data[0].key
    }
    this.$nextTick(() => {
      $(this.$el)
          .find('.ant-tabs-content')
          .first()
          .css('height', 'inherit')
      $(this.$el)
          .find('.ant-tabs-bar')
          .first()
          .css('margin', '0')
      $(this.$el)
          .find('.ant-tabs-right-content')
          .first()
          .css('padding-right', '0')
      $(this.$el)
          .find('.ant-tabs-left-content')
          .first()
          .css('padding-left', '0')
    })
  }

  private onTabsKeyDown(e: any) {
    let keyCode = e.keyCode || e.which || e.charCode
    // let ctrlKey = e.ctrlKey || e.metaKey
    if (keyCode == 9) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  private changeSelectedTab(selectedTabIndex: any) {
    if (selectedTabIndex && selectedTabIndex.length > 0) {
      let tabIndex: number = Number(selectedTabIndex[0])
      if (tabIndex != undefined && tabIndex != null && tabIndex >= 0 && this.TabTempItems.length > tabIndex) {
        this.activeKey = this.TabTempItems[tabIndex].key
      }
    }
  }

  private showTabIndexArr: number[] = []

  private hideTabs(tabIndexArr: any) {
    this.onTabVisibleChanged(tabIndexArr, false)
  }

  private showTabs(tabIndexArr: any) {
    this.onTabVisibleChanged(tabIndexArr, true)
  }

  private getSelectedTabIndex(): number {
    if (this.activeKey) {
      let activeIndex = this.TabTempItems.findIndex((x) => x.key == this.activeKey)
      if (activeIndex == undefined || activeIndex == null) {
        return null
      } else {
        return activeIndex
      }
    } else {
      return null
    }
  }

  private onTabVisibleChanged(tabIndexArr: any, isShow: boolean) {
    if (tabIndexArr && tabIndexArr.length > 0) {
      let val = tabIndexArr[0] + ''
      val = val
          .replace('，', ',')
          .replace('【', '')
          .replace('】', '')
          .replace(' ', '')
      if (val.indexOf(',') >= 0) {
        let tabIndexs: any[] = val.split(',')
        if (tabIndexs) {
          for (let i = 0; i < tabIndexs.length; i++) {
            let number = Number(tabIndexs[i])
            if (number != undefined && number != null && number >= 0 && this.TabTempItems.length > number) {
              this.changeTabVisibility(number, isShow)
            }
          }
        }
      } else {
        let tabIndex: number = Number(val)
        if (tabIndex != undefined && tabIndex != null && tabIndex >= 0 && this.TabTempItems.length > tabIndex) {
          let tabId: string = this.TabTempItems[tabIndex].key
          if (tabId != undefined && tabId != null) {
            this.changeTabVisibility(tabIndex, isShow)
          }
        }
      }
    }
  }

  private changeTabVisibility(tabIndex: number, isShow: boolean): void {
    if (isShow) {
      if (this.showTabIndexArr.indexOf(tabIndex) < 0) {
        this.showTabIndexArr.push(tabIndex)
      } else {
        return
      }
    } else {
      if (this.showTabIndexArr.indexOf(tabIndex) >= 0) {
        let index = this.showTabIndexArr.indexOf(tabIndex)
        this.showTabIndexArr.splice(index, 1)
        let activeIndex = this.TabTempItems.findIndex((x) => x.key == this.activeKey)
        if (tabIndex == activeIndex) {
          if (this.showTabIndexArr.length > 0) {
            this.activeKey = this.TabTempItems[this.showTabIndexArr[0]].key
          } else {
            this.activeKey = null
          }
        }
      } else {
        return
      }
    }
    let displayType = isShow ? '' : 'none'
    $(this.$el)
        .find('.ant-tabs')
        .first()
        .find('.ant-tabs-tab')
        .eq(tabIndex)
        .css('display', displayType)
  }

  private onTabsPropertyChanged(propertyId: string, property: Property, layout: LayoutBase) {
    if (property.groupName == '基础设置') {
      switch (property.propertyName) {
        case '宽度': {
          this.children.forEach((x) => {
            x.width = property.value
          })
        }
          break
        case '高度': {
          this.children.forEach((x) => {
            x.height = property.value
          })
        }
          break
        default:
          break
      }
    }
  }

  private tabKeyChanged(selectKey: string): void {
    this.activeKey = selectKey
  }

  get tabsType(): string {
    let property = this.FindPropertyByName(PropertyGroupName.special, this.tabTypePropName)
    if (property && property.value) {
      let propertyValue: string
      let selectedValue = property.value as string
      switch (selectedValue) {
        case '线条式':
          propertyValue = 'line'
          break
        case '卡片式':
          propertyValue = 'card'
          break
        default:
          propertyValue = selectedValue
          break
      }
      return propertyValue
    }
    return null
  }

  // set activeTabIndex(index: Number) {
  //   let property = this.FindPropertyByName(PropertyGroupName.special, this.activeTabIndexPropName)
  //   if (property) {
  //     property.value = index
  //   }
  // }

  // get activeTabIndex(): Number {
  //   let property = this.FindPropertyByName(PropertyGroupName.special, this.activeTabIndexPropName)
  //   if (property && property.value) {
  //     return property.value as Number
  //   }
  //   return null
  // }

  get tabPosition(): string {
    let property = this.FindPropertyByName(PropertyGroupName.special, this.tabPositionPropName)
    if (property && property.value) {
      let propertyValue: string
      let selectedValue = property.value as string
      switch (selectedValue) {
        case '上':
          propertyValue = 'top'
          break
        case '下':
          propertyValue = 'bottom'
          break
        case '左':
          propertyValue = 'left'
          break
        case '右':
          propertyValue = 'right'
          break
        default:
          propertyValue = selectedValue
          break
      }
      return propertyValue
    }
    return null
  }

  get showTabHeader(): boolean {
    let property = this.FindPropertyByName(PropertyGroupName.special, this.showTabHeaderPropName)
    if (property && property.value !== undefined && property.value !== null) {
      return property.value as boolean
    }
    return false
  }

  @Watch('showTabHeader', {deep: true, immediate: false})
  private showTabHeaderChanged(newValue: boolean) {
    this.changeTabHeaderStyle(this.IsDesigning, newValue)
  }

  @Watch('isSelected', {deep: true, immediate: false})
  private isSelectedChanged(newValue: boolean) {
    if (this.IsDesigning && !this.showTabHeader) {
      if (newValue) {
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .css('display', '')
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .addClass('tabheadfloatshow')
      } else {
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .css('display', 'none')
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .removeClass('tabheadfloatshow')
      }
    }
  }

  @Watch('IsDesigning', {deep: true, immediate: false})
  private IsDesigningChanged(newValue: boolean) {
    this.changeTabHeaderStyle(newValue, this.showTabHeader)
    if (!newValue) {
      this.canDrop = false
      this.canDrag = false
    }
  }

  @Watch('ItemDataList', {deep: true, immediate: false})
  private onItemDataListChanged(nVal: any[], oVal: any[]) {
    let newValue = common.clone(nVal)
    let oldValue = common.clone(oVal)
    let oldData = this.layoutInfo.data
    if (!oldData) {
      oldData = []
    }
    if (newValue && this.layoutInfo.data && newValue.length == this.layoutInfo.data.length) {
      this.TabTempItems = newValue
    }
    this.layoutInfo.data = common.clone(newValue)
    if (!this.activeKey) {
      this.activeKey = newValue[0].key
    }
    let newLen = newValue ? newValue.length : 0
    let oldLen = oldData ? oldData.length : 0
    let addKey: string = null
    let addItem: any = null
    let deleteKey: string = null

    if (!oldData || oldData.length != newLen) {
      //新增
      if (newLen == oldLen + 1) {
        for (let index = 0; index < newLen; index++) {
          const element = newValue[index].key
          let itemData = oldData.find((o) => o.key === element)
          if (!itemData) {
            addItem = newValue[index]
            addKey = element
            break
          }
        }
      }
      //删除
      else if (newLen + 1 == oldLen) {
        for (let index = 0; index < oldLen; index++) {
          const element = oldData[index].key
          let itemData = newValue.find((o) => o.key === element)
          if (!itemData) {
            deleteKey = element
            break
          }
        }
      }
    }
    this.$nextTick(() => {
      if (addKey) {
        this.addTabCompTemplate(addItem)
        this.activeKey = addKey
      }
      if (deleteKey) {
        let deletedChild = this.children.find((x) => x.Id === deleteKey)
        if (deletedChild) {
          this.RemoveChild(deletedChild)
          this.TabTempItems = newValue
        }
        let deletedChildDataIndex = this.childrenData.findIndex((x) => x.id === deleteKey)
        if (deletedChildDataIndex >= 0) {
          this.childrenData.splice(deletedChildDataIndex, 1)
        }
        // this.TabTempItems = newValue
        if (this.TabTempItems.length > 0) {
          this.activeKey = this.TabTempItems[0].key
        } else {
          this.activeKey = null
        }
      }
    })
  }

  @Watch('activeKey')
  private onTabActiveKeyChanged(newValue: string) {
    if (newValue) {
      let activeIndex: number = this.ItemDataList.findIndex((x) => x.key == newValue)
      if (activeIndex != undefined && activeIndex != null) {
        // this.activeTabIndex = activeIndex
        this.TriggeEvent('标签页切换事件', [activeIndex])
      }
    }
  }

  get ItemDataList(): any[] {
    let property = this.FindPropertyByName(PropertyGroupName.special, this.tabLabelPropName)
    if (property && property.value) {
      let selectedValue = property.value as any[]
      return selectedValue
    }
    return []
  }

  private childrenData: SaveInfo[] = []

  protected renderChildFromData(data: SaveInfo) {
    this.childrenData.push(data)
    let compClass = this.findSystemComp(data.layoutInfo.groupName, data.layoutInfo.name)
    if (!compClass) {
      return
    }
    this.insertComponentLayout(compClass, data.layoutInfo, null, data)
  }

  private addTabCompTemplate(itemData: any): void {
    if (itemData) {
      let compClass = this.findSystemCompByCode('componentTemplate')
      let compInfo = AllComponents.find((x) => x.compCode == 'componentTemplate')
      let layoutInfoClone = common.clone(compInfo)
      layoutInfoClone.data = itemData
      this.insertComponentLayout(compClass, layoutInfoClone)
    }
  }

  protected renderComponent(dropComp: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    if (this.hasLoadCompleted && data) {
      // 复制，剪切后粘贴过来的组件
      let comp: any = this.layoutChildren.find(x => x.Id === this.activeKey)
      if (comp) {
        let compClass = this.findSystemComp(layoutInfo.groupName, layoutInfo.name)
        return comp.insertComponentLayout(compClass, data.layoutInfo, null, data)
      }
    } else {
      return this.renderTab(dropComp, layoutInfo, dragType, data);
    }
  }

  private renderTab(dropComp: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    let itemId: string = null
    let tmpNode = window.document.createElement('div')
    let itemData: any = null
    if (data) {
      itemId = data.id
      itemData = this.layoutInfo.data.find((x) => x.key == itemId)
    } else {
      itemId = layoutInfo.data.key
      itemData = layoutInfo.data
    }
    if (itemData) {
      this.TabTempItems.push(itemData)
      dropComp.parentLayout = this
      dropComp.parentPage = this.parentPage
      this.$nextTick(() => {
        $(this.$refs[itemId][0]['$el']).append(tmpNode)
        dropComp.$mount(tmpNode)
        dropComp.Id = itemId
        dropComp.width = this.width
        dropComp.height = this.height
        if (data) {
          dropComp.LoadData(data)
        }
      })
    }

    return dropComp
  }

  private hasLoadCompleted: boolean = false

  protected loadCompleted(childrenData: SaveInfo[]) {
    this.hasLoadCompleted = true
  }

  private changeTabHeaderStyle(isDesigning: boolean, showHeader: boolean) {
    if (isDesigning) {
      if (showHeader) {
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .css('display', '')
      } else {
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .css('display', 'none')
      }
    } else {
      if (showHeader) {
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .css('display', '')
      } else {
        $(this.$el)
            .find('.ant-tabs-bar')
            .first()
            .css('display', 'none')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tabheadfloatshow {
  /* margin: 0px; */
  /* position: relative; */
  position: absolute;
  top: 0;
  /* margin-right: -50px; */
  right: 0;
  /* width: 10px; */
  /* height: 10px; */
  background: #ffffff;
  /* border: 1px solid red; */
  z-index: 100;
}

/deep/ .ant-tabs-tab {
  font-size: 16px;
}

/deep/ .ant-tabs-ink-bar {
  display: none !important;
}

/deep/ .ant-tabs-top-bar .ant-tabs-nav .ant-tabs-tab-active {
  border-bottom: solid;
  font-weight: 600;
}

/deep/ .ant-tabs-right-bar .ant-tabs-nav .ant-tabs-tab-active {
  border-left: solid;
  font-weight: 600;
}

/deep/ .ant-tabs-left-bar .ant-tabs-nav .ant-tabs-tab-active {
  border-right: solid;
  font-weight: 600;
}

/deep/ .ant-tabs .ant-tabs-left-content {
  padding-left: 0px;
}

/deep/ .ant-tabs {
  border-bottom: 0px;
}

/deep/ .ant-tabs-nav .ant-tabs-tab {
  padding: 10px 20px;
}
</style>
