<template>
  <a-locale-provider oncontextmenu="self.event.returnValue=false" tabindex="-1">
    <a-layout :style="{width:'100%',height:'100%'}">
      <!-- *************************************************** -->
      <a-layout-header @click="onCancleChoose" theme='light' style="background:#03303B;padding: 0;height:58px">
        <quickActionBar ref="quickBar" :height="58" :CurrentPage="currentPage" @onSaveAs="quickbar_onSaveAs" @onLeadIn="quickbar_onLeadIn"
          @onLeadOut="quickbar_onLeadout" @onQuit="quickbar_onQuit" @onOpenComponentTemplate="onOpenPageTemplate" @onAddModel="model_addModel"
          @onDblClick="onDblClick" @onOpenCommonPage="onOpenPage" @onCheckOut="quickbar_checkOutPage" @onCancelCheckOut="quickbar_cancelCheckOutPage"
          @onCheckIn="quickbar_checkInPage" @onViewHistroy="quickbar_onViewHistroy" @onRestoreHistroy="quickbar_onRestoreHistroy" />
      </a-layout-header>
      <!-- *************************************************** -->
      <a-layout>
        <!-- *************************************************** -->
        <a-layout-sider ref="pageListSide" theme='light' :width="leftBtnWidth" :trigger="null"
          :style="{'overflow-x': 'hidden','overflow-y': 'hidden'}">
          <geno-pageListControl ref="pageList" style="height:100%;width:100%;" @onOpenPage='onOpenPage' @RestorPage='RestorPage'
            @onClosePage='onClosePage' @onNameChanged="onPageNameChanged" />
        </a-layout-sider>
        <!-- *************************************************** -->
        <a-layout-content @click="onCancleChoose" style="position:relative"
          :style="{'overflow-x': 'hidden','overflow-y': 'hidden','width':'100%','height':'100%'}">
          <a-tabs size="small" ref="anttabs" v-model="tabsActiveKey" type="editable-card" :hideAdd="true" @change="onTabChange"
            :style="{'overflow': 'hidden','width':'100%','height':'100%'}" :tabBarStyle="{'margin':'0px','height':'4%',background:'#ACACAC'}">
            <!-- ****************** -->
            <a-tab-pane style="width:100%;height:100%;overflow:auto;" :style='{"overflow":page.checkoutStatus!=2?"hidden":"auto"}'
              v-for="page in allPages" :key="page.Id" :forceRender='true'>
              <div slot="tab" style="position:relative;">
                <a-tooltip v-if="page.checkoutStatus==1" placement="topLeft" arrow-point-at-center :title="'已经被['+page.checkoutUsername+']签出'">
                  <a-icon :component="lock_tab_icon" />
                </a-tooltip>
                <a-tooltip v-if="page.checkoutStatus==2" placement="topLeft" title="正在签出编辑" arrow-point-at-center>
                  <a-icon :component="unlock_tab_icon" />
                </a-tooltip>
                <span>{{page.nameShow}}</span>
                <a-icon type="close" style="margin-left:15px" @click="onTabClose(page.Id)" />
              </div>
              <geno-layoutProfessional :pageId="page.Id" @onMounted="onPageMounted" style="background: #fff;" />
            </a-tab-pane>
          </a-tabs>
          <!-- *************************************************** -->
          <div ref="rightSideBtn" style="position:absolute;right:0;top:0;bottom:0;width:15px;height:30px;margin:auto 0;z-index:4"
            class="flexHorilanLayout">
            <div style="height:30px;width:15px;background:#fff;cursor:pointer" @click="rightButtonClick" class="flexHorilanLayout showbtn">
              <a-icon v-if="rightBtnWidth!=0" type="right" />
              <a-icon v-else type="left" />
            </div>
          </div>
          <!-- *************************************************** -->
          <div ref="leftSideBtn" style="position:absolute;left:0;top:0;bottom:0;width:15px;height:30px;margin:auto 0;z-index:4"
            class="flexHorilanLayout">
            <div style="height:30px;width:15px;background:#fff;cursor:pointer" @click="leftButtonClick" class="flexHorilanLayout showbtn">
              <a-icon v-if="leftBtnWidth!=0" type="left" />
              <a-icon v-else type="right" />
            </div>
          </div>
          <div v-if="currentPage&&currentPage.checkoutInfo.checkoutStatus!=2&&currentPage.IsComponentTemplate==false"
            style="width:100%;height:100%;position:absolute;let:0px;top:36px;tabindex:1;background:rgba(0,0,0,0.2);z-index:3"></div>
        </a-layout-content>
        <!-- *************************************************** -->
        <a-layout-sider theme='light' :width="rightBtnWidth" :trigger="null" :style="{'overflow-x': 'hidden','overflow-y': 'hidden'}">
          <geno-propertyGrid v-show="(currentPage&&currentPage.checkoutInfo.checkoutStatus==2)||(currentPage&&currentPage.IsComponentTemplate)==true"
            @selectDict="selectDict" ref="compPropertyGrid" :currentPage="currentPage" :currentLayouts="selectedComponents"
            style="height:100%;width:100%;" />
        </a-layout-sider>
        <!-- *************************************************** -->
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
import { Modal, message } from 'ant-design-vue'
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { Property } from './02common/commonClasses/LayoutProperty'
import propertyGrid from './06propertyGrid/PropertyGrid.vue'
import pageList from './components/PageListControl.vue'
import modelControl from './components/ModelControl.vue'
import { clearAllSearchCache } from './02common/behavior/04_actionReaourceTree'
import { modelAnalysis, functionCache, dictCache, modelMapperCache, pageCache, pageContentTable, pageStatus } from './02common/impResourcesCache'
import { lock, unLock } from './02common/icons.js'
import Layout_Professional from './05designerLayouts/layout_Professional/Layout_Professional.vue'

class TabsInfo {
  name?: string
  Id?: string
  type?: pagenNodeType
  isNeedSave: boolean = false
  isComponentTemplate: boolean = false
  checkoutStatus: pageStatus = pageStatus.unCheckout
  checkoutUsername: string

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
    modelControl: modelControl
  }
})
export default class genoDesigner extends Vue {
  private lock_tab_icon: any = lock
  private unlock_tab_icon: any = unLock

  // ************当前页面上所有的原始数据*************************************************************************
  protected allPages: TabsInfo[] = []
  protected pageLayouts: PageBase[] = []
  protected tabsActiveKey: string = ''
  protected get selectedComponents(): LayoutBase[] {
    if (this.currentPage) {
      var findchilds = this.currentPage.FindSelectedLayoutsRecursion()
      // window.console.log('pppppppppppppppp',findchilds)
      if (findchilds.length > 0) {
        return findchilds
      } else {
        return [this.currentPage]
      }
    } else {
      return null
    }
  }
  // ************当前页面上的组件**************************************************************************
  protected get compPropertyGrid(): propertyGrid {
    return this.$refs.compPropertyGrid as propertyGrid
  }
  //当前选中的布局页面，数量只有一个。但是属性窗需要的是一个列表
  protected get currentPage(): PageBase {
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    if (tabInfo) {
      // window.console.log('当前打开的页面:', tabInfo.Id)
      var layout = this.getPageLayoutById(tabInfo.Id)
      return layout
    } else {
      return null
    }
  }
  //当前页面列表控件
  protected get pageList(): pageList {
    return this.$refs.pageList as pageList
  }
  // ************基础方法**************************************************************************
  protected onCancleChoose() {
    for (let index = 0; index < this.pageLayouts.length; index++) {
      const o = this.pageLayouts[index]
      o.chooseComps([])
    }
  }
  // ************pageList**************************************************************************
  protected onPropertyChanged(id: string, property: Property, page: PageBase): void {
    // window.console.log('页面属性变化')
    var tabInfo = this.allPages.find((o) => o.Id == this.tabsActiveKey)
    tabInfo.isNeedSave = true
    this.compPropertyGrid.refreshProperty(property)
  }
  protected onComponentPropertyChanged(id: string, property: Property, comp: ComponentBase): void {
    // window.console.log('页面组件属性变化')
    var tabInfo = this.allPages.find((o) => o.Id == this.tabsActiveKey)
    tabInfo.isNeedSave = true
    this.compPropertyGrid.refreshProperty(property)
  }
  protected onChildrenCountChange() {
    var tabInfo = this.allPages.find((o) => o.Id == this.tabsActiveKey)
    tabInfo.isNeedSave = true
  }
  protected onOpenPage(pageId: string, pageName: string, type?: pagenNodeType) {
    var pageTab = this.allPages.find((o) => o.Id == pageId)
    if (pageTab) {
      this.tabsActiveKey = pageId
      return
    }
    pageTab = new TabsInfo()
    pageTab.name = pageName
    pageTab.Id = pageId
    pageTab.type = type
    this.allPages.push(pageTab)
    this.tabsActiveKey = pageId
  }
  //IsComponentTemplate
  protected onOpenPageTemplate(pageId: string, pageName: string, type?: pagenNodeType) {
    let pageTab = this.allPages.filter((o) => o.Id == pageId)[0]
    if (pageTab) {
      this.tabsActiveKey = pageId
      return
    }
    pageTab = new TabsInfo()
    pageTab.name = pageName
    pageTab.Id = pageId
    pageTab.type = type
    pageTab.isComponentTemplate = true
    // window.console.log(page)
    this.allPages.push(pageTab)
    this.tabsActiveKey = pageId
  }
  protected onClosePage(pageId: string) {
    let closeTab = this.allPages.find((o) => o.Id == pageId)
    // window.console.log('onClosePage:', pageId)
    if (closeTab) {
      this.onTabClose(pageId)
    }
  }
  protected onPageNameChanged(pageId: string, pageName: string) {
    var find = this.allPages.find((o) => o.Id == pageId)
    if (find) {
      find.name = pageName
    }
  }
  // ************Tabs操作**************************************************************************
  protected onTabClose(pageId: any) {
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
        cancelText: '不保存'
      })
    } else {
      this.closeTab(tabInfo)
    }
  }
  protected closeTab(tabInfo: TabsInfo) {
    var layout = this.getPageLayoutById(tabInfo.Id)

    this.pageLayouts.splice(this.pageLayouts.indexOf(layout), 1)
    clearAllSearchCache()
    this.allPages.splice(this.allPages.indexOf(tabInfo), 1)
    if (this.allPages.length > 0) {
      this.tabsActiveKey = this.allPages[this.allPages.length - 1].Id
    } else {
      this.tabsActiveKey = ''
    }
    this.pageList.unselectNode(tabInfo.Id)
    clearAllSearchCache()
  }
  protected onTabChange(activeKey: any) {}
  protected RestorPage(pageId: string) {}
  //添加一个Tabs后触发
  protected async onPageMounted(layout: PageBase) {
    layout.IsDesigning = true
    var pageId = layout.$attrs['pageId']
    var tabInfo = this.allPages.find((o) => o.Id == pageId)
    layout.IsComponentTemplate = tabInfo.isComponentTemplate
    await layout.Load(pageId) //给layout加载新数据
    this.tabsActiveKey = pageId
    this.pageLayouts.push(layout)
    await this.$nextTick()
    layout.$on('onChildrenCountChange', this.onChildrenCountChange)
    layout.$on('onComponentChildrenCountChange', this.onChildrenCountChange)
    layout.$on('onPropertyChanged', this.onPropertyChanged)
    layout.$on('onComponentPropertyChanged', this.onComponentPropertyChanged)
    layout.$on('onPageSaveSuccess', this.onPageSaveSuccess)
    this.renderStyle()
    this.updateCheckoutState(layout)
  }

  protected renderStyle() {
    $(this.$el)
      .find('.ant-tabs-card-content')
      .css('height', '96%')
  }
  protected getPageLayoutById(pageid: String) {
    return this.pageLayouts.find((o) => o.Id == pageid)
  }
  protected onPageSaveSuccess(pageid: string) {
    // window.console.log('页面保存成功')
    var tabInfo = this.allPages.filter((o) => o.Id == pageid)[0]
    tabInfo.isNeedSave = false
  }
  // ************左右功能**************************************************************************
  protected leftBtnWidth: number = 280
  protected leftButtonClick(e: any) {
    // window.console.log('leftButtonClick')
    if (this.leftBtnWidth == 0) {
      localStorage.setItem('app_left_show', 'true')
      this.leftBtnWidth = 280
    } else {
      localStorage.setItem('app_left_show', 'false')
      this.leftBtnWidth = 0
    }
  }
  protected rightBtnWidth: number = 280
  protected rightButtonClick(e: any) {
    // window.console.log('rightButtonClick')
    if (this.rightBtnWidth == 0) {
      localStorage.setItem('app_right_show', 'true')
      this.rightBtnWidth = 280
    } else {
      localStorage.setItem('app_right_show', 'false')
      this.rightBtnWidth = 0
    }
  }
  // ************快捷栏操作**************************************************************************
  protected quickbar_onLeadout() {}
  protected quickbar_onLeadIn() {}
  protected quickbar_onSaveAs() {}

  public async quickbar_onViewHistroy(histroyId: number) {
    let histroydata = (await CurrentApis.GetPageHistoryContent(histroyId)) as any
    // window.console.log('onViewHistroy:', histroydata)
    let pagecontent = common.strUnZip(histroydata.designContentString)
    let pagedata = common.deserialize(pagecontent)
    let popupPage: PageBase = new Layout_Professional() as PageBase
    //
    let pagevnode = this.$createElement('geno-layoutProfessional', {
      key: common.getUuid(),
      keepAlive: false,
      on: {}
    })

    let domid = common.getUuid()
    let div = ' <div id="' + domid + '"> </div> '

    let layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '历史版本',
      skin: 'popup-class',
      area: ['90%', '80%'],
      closeBtn: 1,
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: div,
      end: () => {
        popupPage.IsDesigning = true
        popupPage.Destory()
      },
      cancel: () => {},
      success: function(layero, index) {
        //优化样式
        $(layero)
          .find('.layui-layer-close')
          .attr('draggable', 'false')
      }
    })
    popupPage.$once('onMounted', async (layout: PageBase) => {
      layout.IsDesigning = false
      await layout.LoadPageByData(pagedata.Id, pagedata)
      layout.StartShow(false)
    })
    popupPage.$mount('#' + domid)
  }
  public async quickbar_onRestoreHistroy(histroyId: number) {
    let histroydata = (await CurrentApis.GetPageHistoryContent(histroyId)) as any
    let pagecontent = common.strUnZip(histroydata.designContentString)
    let pagedata = common.deserialize(pagecontent)
    // window.console.log('quickbar_onRestoreHistroy:', pagedata)
    await this.currentPage.reLoadPageData(pagedata)
  }
  private async quickbar_checkOutPage() {
    if (!this.currentPage) {
      return
    }
    try {
      let res = await CurrentApis.CheckOutPage([this.currentPage.Id])
      this.currentPage.checkoutInfo.checkoutStatus = pageStatus.checkoutBySelf
      await this.currentPage.upDataPageCheckStatus()
      this.updateCheckoutState(this.currentPage)
    } catch (error) {
      message.warn(error)
      let res = CurrentApis.GetPageData(this.currentPage.Id) as any
      this.currentPage.checkoutInfo.checkoutStatus = res.pageInfo.status
      await this.currentPage.upDataPageCheckStatus()
      this.currentPage.checkoutInfo.checkoutUsername = res.pageInfo.modifier
      this.updateCheckoutState(this.currentPage)
    }
  }

  private async quickbar_cancelCheckOutPage() {
    this.$confirm({
      title: '撤销将删除当前所有的更改(无法恢复),回退到上一个版本。',
      onOk: async () => {
        await CurrentApis.CancelCheckOutPage([this.currentPage.Id])
        this.currentPage.checkoutInfo.checkoutStatus = pageStatus.unCheckout
        await this.currentPage.upDataPageCheckStatus()
        this.updateCheckoutState(this.currentPage)
        let pageTab = this.allPages.find((o) => o.Id == this.currentPage.Id)
        this.onClosePage(pageTab.Id)
        await this.$nextTick()
        this.onOpenPage(pageTab.Id, pageTab.name, pageTab.type)
        await this.$nextTick()
      },
      onCancel: () => {},
      class: 'test',
      okText: '确定',
      cancelText: '取消'
    })
  }

  private async quickbar_checkInPage(desc: string) {
    if (!this.currentPage) {
      return
    }
    let savedata = this.currentPage.GetSaveData()
    let saveConentStr = this.currentPage.GetPageZipStr(savedata)
    this.currentPage.recordResources(savedata)
    let res = await CurrentApis.CheckInPage(this.currentPage.Id, saveConentStr, this.currentPage.resourceObj, desc)
    this.currentPage.checkoutInfo.checkoutStatus = pageStatus.unCheckout
    await this.currentPage.upDataPageCheckStatus()
    this.updateCheckoutState(this.currentPage)
  }

  private updateCheckoutState(layout: PageBase) {
    let pageTab = this.allPages.find((o) => o.Id == layout.Id)
    if (!pageTab) {
      return
    }
    pageTab.isNeedSave = false
    pageTab.checkoutStatus = layout.checkoutInfo.checkoutStatus
    pageTab.checkoutUsername = layout.checkoutInfo.checkoutUsername
    ;(this.$refs.pageList as any).updatePageCheckStatus(layout.Id, layout.checkoutInfo.checkoutStatus, layout.checkoutInfo.checkoutUsername)
  }

  // **************************************************************************************

  @Emit('onQuit')
  protected quickbar_onQuit() {
    // window.console.log('点击了退出')
  }
  @Emit('onAddModel')
  protected model_addModel() {
    // window.console.log('点击了模型新增')
  }
  @Emit('onDblClick')
  protected onDblClick(record) {}
  @Emit('selectDict')
  protected selectDict() {
    // window.console.info("进入主页面")
  }
  @Emit('selectDicted')
  protected selectDicted(param) {
    window.console.info('返回设计器', param)
    this.compPropertyGrid.selectDicted(param)
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