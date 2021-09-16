 <template>
  <a-layout oncontextmenu="self.event.returnValue=false" :style="{width:'100%',height:'100%'}" tabindex="-1">
    <!-- *************************************************** -->
    <a-layout-header @click="onCancleChoose" theme='light' style="background:#03303B;padding: 0;height:58px">
      <quickActionBar ref="quickBar" :height="58" :CurrentPage="currentPage" @onQuit="quickbar_onQuit" @onAddModel="model_addModel"
        @onDblClick="onDblClick" @onOpenCommonPage="onOpenPage" @onPrint="onPrint" />
    </a-layout-header>
    <!-- *************************************************** -->
    <a-layout>
      <!-- *************************************************** -->
      <a-layout-content @click="onCancleChoose" style="position:relative"
        :style="{'overflow-x': 'hidden','overflow-y': 'hidden','width':'100%','height':'100%'}">
        <a-tabs size="small" ref="anttabs" v-model="tabsActiveKey" type="editable-card" :hideAdd="true"
          :style="{'overflow': 'hidden','width':'100%','height':'100%'}" :tabBarStyle="{'margin':'0px','height':'4%',background:'#ACACAC'}">
          <!-- *************************************************** -->
          <a-tab-pane style="width:100%;height:100%;overflow:hidden" v-for="page in allPages" :tab="page.nameShow" :closable="true" :key="page.Id"
            :forceRender='true'>
            <div style="width:100%;height:100%;overflow:auto">
              <!-- <Rule style="width:100%;height:100%;overflow:auto"> -->
              <geno-layoutProfessional style="width:100%;height:100%;overflow:auto" slot="content" :pageId="page.Id" @onMounted="onPageMounted" />
              <!-- </Rule> -->
            </div>
          </a-tab-pane>
        </a-tabs>
        <!-- *************************************************** -->
        <div ref="rightSideBtn" style="position:absolute;right:0;top:0;bottom:0;width:15px;height:30px;margin:auto 0" class="flexHorilanLayout">
          <div style="height:30px;width:15px;background:#fff;cursor:pointer" @click="rightButtonClick" class="flexHorilanLayout showbtn">
            <a-icon v-if="rightBtnWidth!=0" type="right" />
            <a-icon v-else type="left" />
          </div>
        </div>
      </a-layout-content>
      <!-- *************************************************** -->
      <a-layout-sider theme='light' :width="rightBtnWidth" :trigger="null" :style="{'overflow-x': 'hidden','overflow-y': 'hidden'}">
        <geno-propertyGrid @selectDict="selectDict" ref="compPropertyGrid" :currentPage="currentPage" :currentLayouts="selectedComponents"
          style="height:100%;width:100%;" />
      </a-layout-sider>
      <!-- *************************************************** -->
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
// require('./assets/iconfont1/iconfont')
import PageBase from './05designerLayouts/PageBase'
import ComponentBase from './04designerComponents/ComponentBase'
import LayoutBase from './03designerLayoutBase/LayoutBase'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, modelDataTypeEnum, modelFilter } from './02common/commonClasses/modelBingding'

import common from './02common/commonMethod'
import quickActionBar from './05designerLayouts/layout_QuickActionBar/quickActionBar.vue'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { CurrentApis, CurrentContext, pagenNodeType } from './01designerContext'
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { Property } from './02common/commonClasses/LayoutProperty'
import propertyGrid from './06propertyGrid/PropertyGrid.vue'
import pageList from './components/PageListControl.vue'
import modelControl from './components/ModelControl.vue'
import { clearAllSearchCache } from './02common/behavior/04_actionReaourceTree'
import genoDesigner from './genoDesigner.vue'
import { modelAnalysis } from './02common/impResourcesCache'
import APIs from './01designerContext/APIs_Test'
import Rule from './components/Rule.vue'

enum designerType {
  printComp = 1,
  reportPage = 2
}

class modelIn {
  modelCode: string
  isList: boolean
  data: any
}
class TabsInfo {
  name?: string
  Id?: string
  type?: pagenNodeType
  isNeedSave: boolean = false
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
    Rule: Rule
  }
})
export default class genoPrintDesigner extends Vue {
  private get quickBar(): quickActionBar {
    return this.$refs.quickBar as quickActionBar
  }
  protected get compPropertyGrid(): propertyGrid {
    return this.$refs.compPropertyGrid as propertyGrid
  }
  //当前选中的布局页面，数量只有一个。但是属性窗需要的是一个列表
  public get currentPage(): PageBase {
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    if (tabInfo) {
      // window.console.log('当前打开的页面:', tabInfo.Id)
      var layout = this.getPageLayoutById(tabInfo.Id)
      return layout
    } else {
      return null
    }
  }
  // ************Tabs控制上下文*************************************************************************
  protected allPages: TabsInfo[] = []
  protected pageLayouts: PageBase[] = []
  protected tabsActiveKey: string = ''
  // ************打印特性上下文*******************************************************************
  private designerType: designerType = designerType.printComp
  private modelIns: modelIn[] = []
  private onlyPreView: boolean = false
  private onlyPrint: boolean = false

  private printOpenCallback: any

  public StartPrint() {
    this.designerType = designerType.printComp
    this.quickBar.title = '打印组件'
    this.quickBar.saveAsBtnVisible = false
    this.quickBar.saveAndCloseBtnVisible = true
    this.quickBar.quitBtnVisible = false
    this.quickBar.modelComponentsVisible = false
    this.quickBar.compComponentsVisible = false
    this.quickBar.limitSysCompGroup(['打印模板', '流程组件', '报表组件'])
    this.quickBar.limitSysComps(['MediaComponent'])
  }
  public StartReport() {
    this.designerType = designerType.reportPage
  }
  /////////////////////////////////////////////////
  public NewPage(modelIns: modelIn[]) {
    if (!modelIns) {
      modelIns = []
    }
    this.modelIns = modelIns
    var newId = CurrentApis.GetServerUUID()
    // newId = '98978626600960'
    this.onOpenPage(newId, '打印模板', 2)
  }
  public OpenPage(pageId: string, data: modelIn[]) {
    if (!data) {
      data = []
    }
    this.modelIns = data
    this.onOpenPage(pageId, '打印模板', 2)
  }

  public PreviewPrint(pageId: string, data: modelIn[], printOpenCallback: any) {
    if (!data) {
      data = []
    }
    this.modelIns = data
    this.printOpenCallback = printOpenCallback
    this.onlyPreView = true
    this.onOpenPage(pageId, '打印模板', 2)
  }

  public PrintPage(pageId: string, data: modelIn[], printOpenCallback: any) {
    if (!data) {
      data = []
    }
    window.console.log('PrintPage')
    this.modelIns = data
    this.printOpenCallback = printOpenCallback
    // this.onlyPrint = true
    this.onlyPreView = true
    this.onOpenPage(pageId, '打印模板', 2)
  }
  /////////////////////////////////////////////////
  mounted() {
    window.console.log('***************************genoPrintDesigner', this.$refs.compPropertyGrid)
    if (this.quickBar) {
      this.quickBar.pageResourcesVisible = false
      this.quickBar.leadInBtnVisible = false
      this.quickBar.leadOutBtnVisible = false
      this.quickBar.previewBtnVisible = false
      this.quickBar.printBtnVisible = true
      this.quickBar.savePage = this.savePage
      this.quickBar.savePageAndClose = this.savePageAndClose
    }
  }

  private onPrint(callback: any) {
    window.console.log('开始打印了')
    // =============================复选框 特殊处理=======================================
    // let checkboxs = this.currentPage.$el.getElementsByClassName('ant-checkbox ant-checkbox-checked')
    // if (checkboxs && checkboxs.length > 0) {
    //   for (let index = 0; index < checkboxs.length; index++) {
    //     const element = checkboxs[index]
    //     let checkbox = element.children[0]
    //     checkbox.setAttribute('checked', 'checked')
    //   }
    // }
    let lastchild = $(this.currentPage.$el).children()[$(this.currentPage.$el).children().length - 1]
    let aheight = $(lastchild).height()

    if (aheight > $(this.currentPage.$el).height()) {
      $(this.currentPage.$el).css('height', aheight)
    }
    //==============================复选框 特殊处理======================================
    $(this.currentPage.$el).printThis({
      debug: false, // show the iframe for debugging
      importCSS: true, // import parent page css
      importStyle: true, // import style tags
      printContainer: true, // print outer container/$.selector
      loadCSS: '', // path to additional css file - use an array [] for multiple
      pageTitle: '', // add title to print page
      removeInline: false, // remove inline styles from print elements
      removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
      printDelay: 3000, // variable print delay
      header: null, // prefix to html
      footer: null, // postfix to html
      base: true, // preserve the BASE tag or accept a string for the URL
      formValues: true, // preserve input/form values
      canvas: true, // copy canvas content
      doctypeString: '', // enter a different doctype for older markup
      removeScripts: false, // remove script tags from print content
      copyTagClasses: true, // copy classes from the html & body tag
      beforePrintEvent: callback, // function for printEvent in iframe
      beforePrint: null, // function called before iframe is filled
      afterPrint: null // function called before iframe is removed
    })
  }
  private async savePage() {
    var pageData = this.quickBar.CurrentPage.GetSaveData()
    var pageDatastr = common.serialize(pageData)
    pageDatastr = common.strZip(pageDatastr)
    var Id = this.quickBar.CurrentPage.Id
    var res = await CurrentApis.SavePrintContent(Id, pageDatastr)
    // window.console.log('页面保存结果:', res)
    this.quickBar.title = '打印组件'
    this.onSaved(Id)
  }

  private async savePageAndClose() {
    await this.savePage()
    this.onNeedClose()
  }
  // **********************override****************************************************************
  protected onPageMounted(layout: PageBase) {
    if (this.onlyPreView || this.onlyPrint) {
      layout.IsDesigning = false
    } else {
      layout.IsDesigning = true
    }
    var pageId = layout.$attrs['pageId']
    var tabInfo = this.allPages.filter((o) => o.Id == pageId)[0]
    CurrentApis.SearchPrintContent(pageId).then((res) => {
      var contentdata = res[0]
      //window.console.log('SearchPrintContent:', contentdata)
      if (contentdata && contentdata.design_content) {
        contentdata = atob(contentdata.design_content)
        contentdata = common.strUnZip(contentdata)
        contentdata = common.deserialize(contentdata)
      } else {
        contentdata = null
      }
      ////////////////////////////////////////////
      layout.LoadPageByData(pageId, contentdata) //给layout加载新数据
      layout.Id = pageId
      this.tabsActiveKey = pageId
      this.pageLayouts.push(layout)
      /////////nextTickde/////////////////////////
      layout.$nextTick(() => {
        layout.$on('onChildrenCountChange', this.onChildrenCountChange)
        layout.$on('onComponentChildrenCountChange', this.onChildrenCountChange)
        layout.$on('onPropertyChanged', this.onPropertyChanged)
        layout.$on('onComponentPropertyChanged', this.onComponentPropertyChanged)
        layout.$on('onPageSaveSuccess', this.onPageSaveSuccess)
        for (let index = 0; index < this.modelIns.length; index++) {
          const mdin = this.modelIns[index]
          let modelInfo = modelAnalysis.getModelInfoByCode(mdin.modelCode)
          var modelBindName = modelInfo.modelIndo.modelName + (index + 1)
          layout.setModelBindVal(modelBindName, mdin.data)
        }
        if (this.onlyPrint) {
          this.onPrint(this.printOpenCallback)
        }
      })
      ////////////////////////////////////////////
      if (this.designerType == designerType.printComp && this.onlyPreView == false && this.onlyPrint == false && layout.modelBindings.length < 1) {
        // window.console.log('onPageMounted')
        for (let index = 0; index < this.modelIns.length; index++) {
          const mcode = this.modelIns[index].modelCode
          const islist = this.modelIns[index].isList
          let modelInfo = modelAnalysis.getModelInfoByCode(mcode)
          let modelBinding: modelBingding = new modelBingding()
          modelBinding.modelBindingName = modelInfo.modelIndo.modelName + (index + 1)
          modelBinding.modelBindingType = 1
          modelBinding.modelBindingInfo = {
            name: modelInfo.modelIndo.modelName,
            modelCode: modelInfo.modelIndo.modelCode,
            modelId: modelInfo.modelIndo.id
          }
          if (islist) {
            modelBinding.modelDataType = modelDataTypeEnum.list
          } else {
            modelBinding.modelDataType = modelDataTypeEnum.single
          }
          layout.addModelBinding(modelBinding)
        }
      }
    })
  }

  protected updated() {
    if (this.designerType == designerType.printComp) {
      $(this.$el)
        .find('.ant-tabs-card-content')
        .css('height', '100%')
      $(this.$el)
        .find('.ant-tabs-bar')
        .css('display', 'none')
    }
  }
  public onClosePage(pageId: string) {
    let closeTab = this.allPages.find((o) => o.Id == pageId)
    if (closeTab) {
      this.closeTab(closeTab)
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
    clearAllSearchCache()
  }
  protected onChildrenCountChange() {
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    tabInfo.isNeedSave = true
  }
  protected onPropertyChanged(id: string, property: Property, page: PageBase): void {
    // window.console.log('页面属性变化')
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    tabInfo.isNeedSave = true
    this.compPropertyGrid.refreshProperty(property)
    this.quickBar.title = '打印组件*'
  }
  protected onComponentPropertyChanged(id: string, property: Property, comp: ComponentBase): void {
    // window.console.log('页面组件属性变化')
    var tabInfo = this.allPages.filter((o) => o.Id == this.tabsActiveKey)[0]
    tabInfo.isNeedSave = true
    this.compPropertyGrid.refreshProperty(property)
    this.quickBar.title = '打印组件*'
  }
  protected onPageSaveSuccess(pageid: string) {
    // window.console.log('页面保存成功')
    var tabInfo = this.allPages.filter((o) => o.Id == pageid)[0]
    tabInfo.isNeedSave = false
  }
  protected getPageLayoutById(pageid: String) {
    return this.pageLayouts.find((o) => o.Id == pageid)
  }
  protected onOpenPage(pageId: string, pageName: string, type?: pagenNodeType) {
    var page = this.allPages.filter((o) => o.Id == pageId)[0]
    if (page) {
      this.tabsActiveKey = pageId
      return
    }
    page = new TabsInfo()
    page.name = pageName
    page.Id = pageId
    page.type = type
    // window.console.log(page)
    this.allPages.push(page)
  }
  protected onCancleChoose() {
    for (let index = 0; index < this.pageLayouts.length; index++) {
      const o = this.pageLayouts[index]
      o.chooseComps([])
    }
  }
  protected get selectedComponents(): LayoutBase[] {
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
  // **************************************************************************************
  @Emit('onSaved')
  private onSaved(pageId) {
    // window.console.log('onSave')
  }

  @Emit('onNeedClose')
  private onNeedClose() {}

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
.ant-tabs-bar {
  height: 0px !important;
}
</style>

 