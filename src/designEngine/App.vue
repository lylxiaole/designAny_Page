<template>
  <a-locale-provider oncontextmenu="self.event.returnValue=false">
    <a-layout :style="{width:'100%',height:'100%'}">
      <!--标题 -->
      <a-layout-header theme='light' style="background:#03303B;padding: 0;height:58px">
        <quickActionBar :height="58" :CurrentPage="currentPage" @onSaveAs="quickbar_onSaveAs" @onLeadIn="quickbar_onLeadIn"
          @onLeadOut="quickbar_onLeadout" @onQuit="quickbar_onQuit" @onOpenPage='onOpenPageTemplate' @onAddModel="model_addModel" />
      </a-layout-header>

      <a-layout>
        <a-layout-sider theme='light' :width="leftBtnWidth" :trigger="null" :style="{'overflow-x': 'hidden','overflow-y': 'hidden'}">
          <geno-pageListControl ref="pageList" style="height:100%;width:100%;" @onOpenPage='onOpenPage' @RestorPage='RestorPage'
            @onClosePage='onClosePage' @onNameChanged="onPageNameChanged" />
        </a-layout-sider>
        <!-- *************************************************** -->
        <a-layout-content style="position:relative" :style="{'overflow-x': 'hidden','overflow-y': 'hidden','width':'100%','height':'100%'}">
          <a-tabs size="small" ref="anttabs" v-model="tabsActiveKey" type="editable-card" :hideAdd="true" @edit="onTabsEdit" @change="onTabChange"
            :style="{'overflow': 'hidden','width':'100%','height':'100%'}" :tabBarStyle="{'margin':'0px','height':'4%',background:'#ACACAC'}">
            <!-- ****************** -->
            <a-tab-pane style="width:100%;height:100%;overflow:auto" v-for="page in allPages" :tab="page.nameShow" :closable="true" :key="page.Id"
              :forceRender='true'>
              <geno-layoutProfessional v-if="page.type==2" :pageId="page.Id" @onMounted="onPageMounted" />
              <geno-layoutSimple v-else :pageId="page.Id" @onMounted="onPageMounted" />
            </a-tab-pane>
          </a-tabs>
          <!-- *************************************************** -->
          <div style="position:absolute;right:0;top:0;bottom:0;width:15px;height:30px;margin:auto 0" class="flexHorilanLayout">
            <div style="height:30px;width:15px;background:#fff;cursor:pointer" @click="rightButtonClick" class="flexHorilanLayout showbtn">
              <a-icon v-if="rightBtnWidth!=0" type="right" />
              <a-icon v-else type="left" />
            </div>
          </div>
          <!-- *************************************************** -->
          <div style="position:absolute;left:0;top:0;bottom:0;width:15px;height:30px;margin:auto 0 " class="flexHorilanLayout">
            <div style="height:30px;width:15px;background:#fff;cursor:pointer" @click="leftButtonClick" class="flexHorilanLayout showbtn">
              <a-icon v-if="leftBtnWidth!=0" type="left" />
              <a-icon v-else type="right" />
            </div>
          </div>
        </a-layout-content>
        <!-- *************************************************** -->
        <a-layout-sider theme='light' :width="rightBtnWidth" :trigger="null" :style="{'overflow-x': 'hidden','overflow-y': 'hidden'}">
          <geno-propertyGrid @selectDict="selectDict" ref="compPropertyGrid" :currentPage="currentPage" :currentLayouts="selectedComponents" style="height:100%;width:100%;" />
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>

<script lang="ts">
// require('./assets/iconfont1/iconfont')
import PageBase from './05designerLayouts/PageBase'
import ComponentBase from './04designerComponents/ComponentBase'
import LayoutBase from './03designerLayoutBase/LayoutBase'

import common from './02common/commonMethod'
import quickActionBar from './05designerLayouts/layout_QuickActionBar/quickActionBar.vue'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { CurrentApis, CurrentContext, pagenNodeType } from './01designerContext'
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { Property } from './02common/commonClasses/LayoutProperty'
import propertyGrid from './06propertyGrid/PropertyGrid.vue'
import pageList from './components/PageListControl.vue'
import modelControl from './components/ModelControl.vue'

class TabsInfo {
  name?: string
  Id?: string
  type?: pagenNodeType
  isNeedSave: boolean = false
  isComponentTemplate: boolean = false
  get nameShow(): string {
    if (this.isNeedSave == true) {
      return this.name + '*'
    }
    if (this.isNeedSave == false) {
      return this.name
    }
    return null
  }
}
@Component({
  components: {
    quickActionBar: quickActionBar,
    modelControl: modelControl,
  },
})
export default class App extends Vue {
  // private locale: any = zhCN
  private allPages: TabsInfo[] = []
  private pageLayouts: PageBase[] = []
  private tabsActiveKey: string = ''

  private get pagePropertyGrid(): propertyGrid {
    return this.$refs.pagePropertyGrid as propertyGrid
  }
  private get compPropertyGrid(): propertyGrid {
    return this.$refs.compPropertyGrid as propertyGrid
  }
  //当前选中的布局页面，数量只有一个。但是属性窗需要的是一个列表
  private get currentPage(): PageBase {
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    if (tabInfo) {
      window.console.log('当前打开的页面:', tabInfo.Id)
      var layout = this.getPageLayoutById(tabInfo.Id)
      return layout
    } else {
      return null
    }
  }
  //当前页面列表控件
  private get pageList(): pageList {
    return this.$refs.pageList as pageList
  }
  private get selectedComponents(): LayoutBase[] {
    if (this.currentPage) {
      var findchilds = this.currentPage.FindSelectedLayoutsRecursion()
      if (findchilds.length > 0) {
        return findchilds
      } else {
        return [this.currentPage]
      }
    } else {
      return null
    }
  }
  private renderStyle() {
    $(this.$el)
      .find('.ant-tabs-card-content')
      .css('height', '96%')
  }
  // ************pageList**************************************************************************
  private onPropertyChanged(id: string, property: Property, page: PageBase): void {
    // window.console.log('页面属性变化')
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    tabInfo.isNeedSave = true
    if (this.pagePropertyGrid) {
      this.pagePropertyGrid.refreshProperty(property)
    }
  }
  private onComponentPropertyChanged(id: string, property: Property, comp: ComponentBase): void {
    // window.console.log('页面组件属性变化')
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    tabInfo.isNeedSave = true
    this.compPropertyGrid.refreshProperty(property)
  }
  private onChildrenCountChange() {
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    tabInfo.isNeedSave = true
  }
  private onOpenPage(pageId: string, pageName: string, type?: pagenNodeType) {
    var page = this.allPages.filter((o) => o.Id == pageId)[0]
    if (page) {
      this.tabsActiveKey = pageId
      return
    }
    page = new TabsInfo()
    page.name = pageName
    page.Id = pageId
    page.type = type
    window.console.log(page)
    this.allPages.push(page)
  }
  //IsComponentTemplate
  private onOpenPageTemplate(pageId: string, pageName: string, type?: pagenNodeType) {
    var page = this.allPages.filter((o) => o.Id == pageId)[0]
    if (page) {
      this.tabsActiveKey = pageId
      return
    }
    page = new TabsInfo()
    page.name = pageName
    page.Id = pageId
    page.type = type
    page.isComponentTemplate = true
    window.console.log(page)
    this.allPages.push(page)
  }
  private onClosePage(pageId: string) {
    let closeTab = this.allPages.find((o) => o.Id == pageId)
    if (closeTab) {
      this.closeTab(closeTab)
    }
  }
  private onPageNameChanged(pageId: string, pageName: string) {
    var find = this.allPages.find((o) => o.Id == pageId)
    if (find) {
      find.name = pageName
    }
  }
  // ************Tabs操作**************************************************************************
  private onTabsEdit(pageId: any, action: any) {
    if (action == 'remove') {
      var tabInfo = this.allPages.filter((o) => o.Id == pageId)[0]
      if (tabInfo.isNeedSave == true) {
        this.$confirm({
          title: '当前页面有未保存的内容，是否要保存',
          onOk: () => {
            var layout = this.getPageLayoutById(tabInfo.Id)
            layout.Save()
            this.closeTab(tabInfo)
          },
          onCancel: () => {
            this.closeTab(tabInfo)
          },
          class: 'test',
          okText: '保存',
          cancelText: '不保存',
        })
      } else {
        this.closeTab(tabInfo)
      }
    }
  }
  private closeTab(tabInfo: TabsInfo) {
    var layout = this.getPageLayoutById(tabInfo.Id)
    this.pageLayouts.splice(this.pageLayouts.indexOf(layout), 1)
    layout.$destroy()

    this.allPages.splice(this.allPages.indexOf(tabInfo), 1)
    if (this.allPages.length > 0) {
      this.tabsActiveKey = this.allPages[this.allPages.length - 1].Id
    } else {
      this.tabsActiveKey = ''
    }
    this.pageList.unselectNode(tabInfo.Id)
  }
  private onTabChange(activeKey: any) {}
  private RestorPage(pageId: string) {
    //this.allPages.findIndex((o) => o.Id == pageId)
    //this.currentPage.Load(pageId)
    // this.onPageMounted(this.currentPage)
  }
  //添加一个Tabs后触发
  private onPageMounted(layout: PageBase) {
    var pageId = layout.$attrs['pageId']
    var tabInfo = this.allPages.filter((o) => o.Id == pageId)[0]
    layout.IsComponentTemplate = tabInfo.isComponentTemplate
    layout.PageType = tabInfo.type
    layout.Load(pageId) //给layout加载新数据
    this.tabsActiveKey = pageId
    this.pageLayouts.push(layout)
    this.$nextTick(() => {
      layout.$on('onChildrenCountChange', this.onChildrenCountChange)
      layout.$on('onComponentChildrenCountChange', this.onChildrenCountChange)
      layout.$on('onPropertyChanged', this.onPropertyChanged)
      layout.$on('onComponentPropertyChanged', this.onComponentPropertyChanged)
      layout.$on('onPageSaveSuccess', this.onPageSaveSuccess)
      this.renderStyle()
    })
  }
  private getPageLayoutById(pageid: String) {
    return this.pageLayouts.find((o) => o.Id == pageid)
  }
  private onPageSaveSuccess(pageid: string) {
    window.console.log('页面保存成功')
    var tabInfo = this.allPages.filter((o) => o.Id == pageid)[0]
    tabInfo.isNeedSave = false
  }
  // ************左右功能**************************************************************************
  private leftBtnWidth: number = 280
  private leftButtonClick(e: any) {
    window.console.log('leftButtonClick')
    if (this.leftBtnWidth == 0) {
      localStorage.setItem('app_left_show', 'true')
      this.leftBtnWidth = 280
    } else {
      localStorage.setItem('app_left_show', 'false')
      this.leftBtnWidth = 0
    }
  }
  private rightBtnWidth: number = 280
  private rightButtonClick(e: any) {
    window.console.log('rightButtonClick')
    if (this.rightBtnWidth == 0) {
      localStorage.setItem('app_right_show', 'true')
      this.rightBtnWidth = 280
    } else {
      localStorage.setItem('app_right_show', 'false')
      this.rightBtnWidth = 0
    }
  }
  // ************快捷栏操作**************************************************************************
  private quickbar_onLeadout() {}
  private quickbar_onLeadIn() {}
  private quickbar_onSaveAs() {}
  @Emit('onQuit')
  private quickbar_onQuit() {
    window.console.log('点击了退出')
  }
  @Emit('onAddModel')
  private model_addModel() {
    window.console.log('点击了模型新增')
  }
  @Emit('selectDict')
  private selectDict(){
    window.console.info("进入主页面")
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;
}
.ant-tabs-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.ant-tabs-card-content {
  height: 96%;
}

.showbtn:hover {
  background-color: #9e9e9e;
  background: #9e9e9e;
}
</style>