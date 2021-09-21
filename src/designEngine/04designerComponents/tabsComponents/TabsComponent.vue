/**
 * Tab页组件
 * By JBM
 * 日期
 tab页的数据怎么保存呢？
 */
<template>
  <div>
    <a-tabs style="width:100%;height:100%;" defaultActiveKey="1" v-model="activeKey" :tabPosition="tabPosition" :type=tabStyle @edit="onEdit"
      @change="onTabChange" :tabBarGutter='tabBarGutter' :style="{'color':fontColor,'background':backgroundColor}"
      :tabBarStyle="{'margin':'0px','height':'40px'}">
      <a-tab-pane style="width:100%;height:95%;overflow:auto" v-for="page in TabsPanes" :tab="page.name" :key="page.Id" :closable="true"
        :forceRender='true'>
        <tab-content />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  Color_Property,
  PropertyGroupName
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'
import common from '../../02common/commonMethod'
import LayoutBase, { SaveInfo } from '../../03designerLayoutBase/LayoutBase'
import propertyGrid from '../../06propertyGrid/PropertyGrid.vue'
import page_professional from '../../05designerLayouts/layout_Professional/Layout_Professional.vue'
import layout_Grid from '../../05designerLayouts/layout_grid/Layout_Grid.vue'
import TabContent from '../tabsComponents/TabContent.vue'
// import columnTemplateSetting from './columnTemplateSetting.vue'
// import BaseEvents from '../../03designerLayoutBase/BaseEvents'
// import PageBase from '../../03designerLayoutBase/PageBase'

class TabInfo {
  name?: string
  Id?: string
  //LayoutPage?: layout_Grid
  get nameShow(): string {
    // if (this.LayoutPage && this.LayoutPage.isNeedSave == true) {
    //   return this.name + '*'
    // }
    return this.name
  }
}

@Component({
  components: {
    TabContent: TabContent
  }
})
export default class tabsComponents extends ComponentBase {
  private TabsPanes: TabInfo[] = []

  // get TabsPanes():TabInfo[]{
  //   var property = this.FindPropertyByName(PropertyGroupName.special, '数据源')
  //   if (property) {
  //     window.console.log('property',property)
  //     return property.value
  //   }
  //   else{
  //     return []
  //   }
  // }

  // set TabsPanes(val:TabInfo[]){
  //   window.console.log('tabs赋值',val)
  //   var property = this.FindPropertyByName(PropertyGroupName.special, '数据源')
  //   if (property) {
  //     property.value = val
  //   }
  // }

  private activeKey: string = ''
  private newTabIndex: number = 1
  // public currentPageSimple: layout_Grid = new layout_Grid()

  mounted() {
    this.width = 400
    this.height = 300
    //注册基本属性
    //页签的基本属性
    this.RegisterProperty('页签位置', PropertyGroupName.special, new Enum_Property(true, ['上边', '右边', '下边', '左边']), '上边')
    this.RegisterProperty('页签样式', PropertyGroupName.special, new Enum_Property(true, ['线条', '卡片', '可编辑']), '可编辑')
    //注册特有属性
    this.RegisterProperty('页签间距', PropertyGroupName.special, new Number_Property(), 5)

    //添加基本页面
    // var TabPan = new TabsInfo()
    // TabPan.name = `NewTab${this.newTabIndex++}`
    // TabPan.Id = common.getUuid()
    // TabPan.LayoutPage = new layout_Grid()
    // TabPan.LayoutPage.Id = TabPan.Id
    // this.TabsPanes.push(TabPan)
    // this.activeKey = TabPan.Id
    // console.log('新建页面ID：', this.activeKey)
    this.RegisterProperty('数据源', PropertyGroupName.special, null, [])
  }

  protected async loadCompleted(childrenData: any[]) {
    //var id = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource).id
    //const aaa = this.getPropertyBindInfo(id).modelCodes
    var property = this.FindPropertyByName(PropertyGroupName.special, '数据源')
    if (property && property.value) {
      //common.serialize(val)
      //common.deserialize(property.value) as FormItemData[]
      //window.console.log('property',property)
      this.TabsPanes = property.value
    }
    // window.console.log('property',property.value.length)
    // window.console.log('property.value',Object.assign(property.value))
    window.console.log('property', property)
  }

  // private onPageMounted(layout: layout_Grid) {
  //   var pageId = layout.$attrs['pageId']
  //   var tabInfo = this.TabsPanes.filter((o) => o.Id == pageId)[0]
  //   tabInfo.LayoutPage = layout
  //   layout.Load(pageId) //给layout加载新数据
  //   this.activeKey = layout.Id
  // }

  get propertyvalue(): any {
    return ''
  }

  //添加删除页签
  onEdit(targetKey: any, action: any) {
    if (action === 'remove') {
      var tabInfo = this.TabsPanes.filter((o) => o.Id == targetKey)[0]
      // if (tabInfo.LayoutPage.isNeedSave == true) {
      //   this.$confirm({
      //     title: 'Tab页面已更改是否保存',
      //     onOk: () => {
      //       tabInfo.LayoutPage.Save()
      //       this.closeTab(tabInfo)
      //     },
      //     onCancel: () => {},
      //   })
      // } else {
      //   this.closeTab(tabInfo)
      // }
      this.closeTab(tabInfo)
    } else {
      // 添加页签需要重新渲染
      var TabPan = new TabInfo()
      TabPan.name = `NewTab${this.newTabIndex++}`
      TabPan.Id = common.getUuid()
      //TabPan.LayoutPage = new layout_Grid()
      //TabPan.LayoutPage.Id = TabPan.Id
      //let tempArr = this.TabsPanes
      //tempArr.push(TabPan)
      this.TabsPanes.push(TabPan)
      var property = this.FindPropertyByName(PropertyGroupName.special, '数据源')
      if (property) {
        //window.console.log('property.value111',property.value)
        //window.console.log('this.TabsPanes',Object.assign([],this.TabsPanes))
        property.value = this.TabsPanes
      }
      //window.console.log('property.value111',property.value)
      this.$nextTick(() => {
        window.console.log('tab初始化完成', Object.assign([], this.TabsPanes))
        this.TabsPanes.forEach((a) => {
          let cpname: string = 'tab_' + a.Id
          var vueComp = this.$refs[cpname]
          if (vueComp) {
            //window.console.log('addcell-vueComp', cpname, vueComp)
            let theCell = vueComp[0] as TabContent
            if (theCell) {
              theCell.Id = a.Id
              theCell.parentPage = this.parentPage
              this.AddChild(theCell)
            }
          }
        })
        this.activeKey = TabPan.Id
      })
    }
  }

  //Tab页变化
  onTabChange(targetKey: any) {
    var tabs = this.TabsPanes.filter((o) => o.Id == this.activeKey)[0]
    if (tabs) {
      this.activeKey = targetKey
      // this.currentPageSimple = tabs.LayoutPage
      // console.log('tabs页面变化：', targetKey, tabs.name)
    }
  }

  private closeTab(tabInfo: TabInfo) {
    // tabInfo.LayoutPage.$destroy()
    // this.TabsPanes.splice(this.TabsPanes.indexOf(tabInfo), 1)
    // if (this.TabsPanes.length > 0) {
    //   this.activeKey = this.TabsPanes[this.TabsPanes.length - 1].Id
    // } else {
    //   this.activeKey = ''
    // }
  }

  get tabStyle(): string {
    if (this.FindProperties(PropertyGroupName.special, '页签样式')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '页签样式')[0].value === '线条') return 'line'
      else if (this.FindProperties(PropertyGroupName.special, '页签样式')[0].value === '卡片') return 'card'
      else if (this.FindProperties(PropertyGroupName.special, '页签样式')[0].value === '可编辑') return 'editable-card'
      else return 'editable-card'
    }
    return 'editable-card'
  }

  get tabPosition(): string {
    if (this.FindProperties(PropertyGroupName.special, '页签位置')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '页签位置')[0].value === '上边') return 'top'
      else if (this.FindProperties(PropertyGroupName.special, '页签位置')[0].value === '下边') return 'bottom'
      else if (this.FindProperties(PropertyGroupName.special, '页签位置')[0].value === '左边') return 'left'
      else if (this.FindProperties(PropertyGroupName.special, '页签位置')[0].value === '右边') return 'right'
      else return 'top'
    }
    return 'top'
  }
  get tabBarGutter(): number {
    if (this.FindProperties(PropertyGroupName.special, '页签间距')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '页签间距')[0].value)
        return this.FindProperties(PropertyGroupName.special, '页签间距')[0].value
    }
    return 5
  }

  //公有属性
  get fontColor(): String {
    if (this.FindProperties(PropertyGroupName.normal, '前景色')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '前景色')[0].value)
        return this.FindProperties(PropertyGroupName.normal, '前景色')[0].value as string
    }
    return ''
  }
  get backgroundColor(): string {
    if (this.FindProperties(PropertyGroupName.normal, '背景色')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '背景色')[0].value)
        return this.FindProperties(PropertyGroupName.normal, '背景色')[0].value as string
    }
    return ''
  }

  protected renderChildFromData(data: SaveInfo) {}
}
</script>
<style scoped>
</style>










