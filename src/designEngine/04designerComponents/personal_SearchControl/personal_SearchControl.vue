 
<template>
  <div style="overflow:hidden;height:100%;width:100%">
    <a-form ref="form" style="width:100%" layout="horizontal" :form="form" :selfUpdate="true" :style="{'overflow':formOverflow}">
      <template v-for="item in personalConfig">
        <div :style="itemBoardStyle(item.compId)" style="display:inline-block;*display:inline;*zoom:1; " :key="item.compId" :ref="item.compId"
          @click="onSelectItem(item.compId)">
          <a-form-item :style="{width:getItemComponentWidth(item.compId)+'px', 
            marginTop:getItemMarginTop(item.compId)+'px',
            marginRight:getItemMarginRight(item.compId)+'px',
            marginBottom:getItemMarginBottom(item.compId)+'px',
            marginLeft:getItemMarginLeft(item.compId)+'px' }"
            :label-col=" { span: getLabelColSpan(item.compId),offset:getLabelColOffset(item.compId) }"
            :wrapper-col=" {span: getWrapperColSpan(item.compId),offset:getWrapperColOffset(item.compId) }">
            <template slot="label">
              <!-- :style="{'text-align':getItemTextFloat(item.compId)}" -->
              <span style="height:auto;width:100%">{{getItemShowName(item.compId) }}</span>
            </template>
            <div :id="item.compId" />
          </a-form-item>
          <div class="widget-view-action-left" v-show="getItemCanDelete(item.compId)">
            <a-button type="link" icon="delete" @click="()=>{onFormItemDelete(item)}" ghost />
          </div>
          <div class="widget-view-action-left" v-show="getItemCanHide(item.compId)" style="margin-left:36px">
            <a-button type="link" :icon="itemDisplay(item.compId)==true?'eye-invisible':'eye'" @click="()=>{showOrHideItem(item.compId)}" ghost />
          </div>
          <!-- ******************************* -->
          <div class="widget-view-action-right" v-show="getItemCanMove(item.compId)" style="margin-right:36px">
            <a-button type="link" icon="arrow-up" @click="()=>{onChangeItemIndex(item,true)}" ghost />
          </div>
          <div class="widget-view-action-right" v-show="getItemCanMove(item.compId)">
            <a-button type="link" icon="arrow-down" @click="()=>{onChangeItemIndex(item,false)}" ghost />
          </div>
          <!-- ******************************* -->
        </div>
        <!-- border: '2px dashed #faad14', padding: '-2px' -->
      </template>
      <div :style="{border:'0px dashed #bfbfbfd9', padding:  '-1px' }" ref="optionBtns"
        style="display:inline-block;*display:inline;*zoom:1;float:right;">
        <a-form-item :style="{width:'300px', margin:'13px 0px 0px 0px' }" :label-col=" { span:0,offset:0 }" :wrapper-col=" {span:24,offset:0 }">
          <template slot="label">
            <span style="height:auto;width:100%"> </span>
          </template>
          <div style="width:100%;height:100%">
            <span class="table-page-search-submitButtons" style="margin-top:13px">
              <a-button type="primary" class="searchBtn" @click="onSearchBtnClick"
                :style="{fontSize: fontSize+'px',width:'90px',height:'30px','box-shadow':'none','text-shadow': '0px'}">
                <a-icon :component="searchIcon" />
                查询
              </a-button>
              <a-button type="primary" class="resetBtn" @click="onResetBtnClick"
                :style="{fontSize: fontSize+'px',width:'90px',height:'30px','box-shadow':'none','text-shadow': '0px','margin-left':'20px'}">
                <a-icon :component="resetIcon" />
                重置
              </a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
              <a @click="startPersonalSetting" style="margin-left: 8px">
                <a-icon :type="isSettingPersonal ? 'stop' : 'setting'" />
                <personalSettingModal @onOK="onSureSetting" @onCancel="onCancelSetting" ref="settingModal"></personalSettingModal>
              </a>
            </span>
          </div>
        </a-form-item>
      </div>
      <div v-if="personalConfig.length===0">
        <a-empty />
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { ComponentBase } from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'

import { Property, Number_Property, NumberList_Property, Text_Property, Enum_Property, PropertyGroupName } from '../../03designerLayoutBase'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { SaveInfo, LayoutType, LayoutInfo, DragItemTypeEnum, LayoutBase } from '../../03designerLayoutBase'
import searchItem from './searchItem.vue'
import { search, reset } from '../../02common/icons.js'
import { CurrentApis } from '../../01designerContext'
import personalSettingModal from './personalSettingModal.vue'

var formItemGroupName: string = '拓展属性'
var itemShowName: string = '显示文字'
var itemFloat: string = '对齐方式'
var LabelColSpanName: string = '标签占位'
var LabelColOffsetName: string = '标签偏移'
var WrapperColSpanName: string = '控件占位'
var WrapperColOffsetName: string = '控件偏移'
var MarginTop: string = '顶部边距'
var MarginLeft: string = '左边距'
var MarginRight: string = '右边距'
var MarginBottom: string = '底部边距'

/**个性化的查询组件 */
class compRecord {
  documentFrag: DocumentFragment
  compId: string
}

class personal_config {
  compId: string
  show: boolean
}

@Component({
  components: { searchItem: searchItem, personalSettingModal: personalSettingModal }
})
export default class personal_SearchControl extends ComponentBase {
  form: any
  private resetIcon: any = reset
  private searchIcon: any = search
  private personalConfigId: any = null
  // 高级搜索 展开/关闭
  private advanced: boolean = false
  private isSettingPersonal: boolean = false
  private compRecords: compRecord[] = []
  private personalConfig: personal_config[] = []
  //
  private get settingModal(): any {
    return this.$refs.settingModal
  }

  private get fontSize(): number {
    // '宋体', '楷体', '黑体', '隶书'
    var property = this.findPropertyByName(PropertyGroupName.normal, '字体')
    if (!property) {
      return 12
    }
    return property.value
  }
  beforeCreate() {
    this.form = this.$form.createForm(this)
  }
  created() {
    let inparam = new param()
    inparam.name = '组件名称'
    inparam.type = paramType.complexType
    this.registerMethods(
      '隐藏查询项',
      '手动调用',
      (inpd) => {
        window.console.log('asasas', inpd)
        this.hideItem(inpd[0])
      },
      [inparam],
      null
    )
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)
  }
  mounted() {
    if (this.IsDesigning) {
      this.width = 600
      this.height = 200
      this.canDrag = true
      this.canDrop = true
    }
    // this.registerProperty('控件占位', PropertyGroupName.special, new Number_Property(1, 24), 4, true, true) //span
    this.registerEvents('查询按钮点击事件', '', [], null)
    this.registerEvents('重置按钮点击事件', '', [], null)
  }

  private onCurrentPropertyChanged(propertyId: string, property: Property, layout: LayoutBase): void {}
  // **************组件渲染*************************************************************************
  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    let tmpNode = window.document.createElement('div')
    let domCache = window.document.createDocumentFragment()
    compCon.parentPage = this.parentPage
    domCache.appendChild(tmpNode)
    compCon.$mount(tmpNode)

    if (layoutInfo.compCode === 'NpForm') {
      // window.console.log('renderComponent:', compCon.layoutChildren)
      this.loadModelComponents(compCon.layoutChildren as any[])
      this.removeChild(compCon)
      return compCon
    }

    /**在组件壳子中添加组件 */
    this.rendered(this.$el)
    compCon.left = 0
    compCon.top = 0
    ////////////////////////////////
    let compid = compCon.Id
    if (data) {
      compid = data.id
    }
    this.registerCompProperty(compCon)
    this.compRecords.push({
      documentFrag: domCache,
      compId: compid
    })

    this.addCompRecord(compid, domCache, compCon)
    return compCon
  }
  public deleteChildComponents(compId: string): boolean {
    this.rendered(this.$el)
    return true
  }
  protected loadCompleted(childrenData: SaveInfo[]) {
    this.loadPersonalConfig_afterload()
  }
  private async addCompRecord(compId: string, domCache: DocumentFragment, compCon: ComponentBase) {
    this.personalConfig.push({
      compId: compId,
      show: true
    })
    await this.$nextTick()
    await this.drawCompUseSearchItem(compId, domCache, compCon)
  }
  private async loadPersonalConfig_afterload() {
    await this.$nextTick()
    let personalSetting = this.topParentPage.getCompPersonalSetting(this.Id)
    if (!personalSetting) {
      return
    }
    this.advanced = personalSetting.com_configuration.advanced
    let configsTemp = personalSetting.com_configuration.config
    let notInConfigsIndex: any[] = []
    /*初始化显示状态 */
    for (let index = 0; index < this.personalConfig.length; index++) {
      const element = this.personalConfig[index]
      let comp = this.layoutChildren.find((o) => o.Id === element.compId)
      if (comp) {
        element.show = (comp as ComponentBase).display
      }
    }

    /*********找到配置中有，但是控件已经删除的********** */
    for (let index = 0; index < configsTemp.length; index++) {
      const element = configsTemp[index]
      let find = this.personalConfig.find((o) => o.compId == element.compId)
      if (!find) {
        notInConfigsIndex.push(index)
      }
    }
    /**删除配置中找不到对应控件的配置 */
    for (let index = 0; index < notInConfigsIndex.length; index++) {
      const dindex = notInConfigsIndex[index]
      configsTemp.splice(dindex, 1)
    }
    /**添加控件中有,但是配置中没有的 */
    for (let index = 0; index < this.personalConfig.length; index++) {
      const element = this.personalConfig[index]
      let find = configsTemp.find((o) => o.compId == element.compId)
      if (!find) {
        configsTemp.push(element)
      }
    }

    this.personalConfig = configsTemp
    this.personalConfigId = personalSetting.id
    await this.$nextTick()
    if (this.advanced == true) {
      this.expand()
    } else {
      this.collage()
    }
  }
  private async drawCompUseSearchItem(compId: string, docufrag: DocumentFragment, compCon: ComponentBase) {
    let searchitem = new searchItem()
    let cachediv = $(this.$el).find('#' + compId)[0]
    searchitem.$mount(cachediv)
    searchitem.mountComp(docufrag)
    searchitem.innerComp = compCon
  }
  private registerCompProperty(dropcomp: ComponentBase) {
    let numberProperty = new Number_Property()
    numberProperty.min = -9999
    numberProperty.max = 9999
    dropcomp.registerProperty(itemShowName, formItemGroupName, new Text_Property(), null)
    /***************************** */
    dropcomp.registerProperty(itemFloat, formItemGroupName, new Enum_Property(true, ['左对齐', '右对齐']), '右对齐', true, true)
    dropcomp.registerProperty(LabelColSpanName, formItemGroupName, { ...numberProperty }, 10, true, true)
    dropcomp.registerProperty(LabelColOffsetName, formItemGroupName, { ...numberProperty }, 0, true, true)
    dropcomp.registerProperty(WrapperColSpanName, formItemGroupName, { ...numberProperty }, 14, true, true)
    dropcomp.registerProperty(WrapperColOffsetName, formItemGroupName, { ...numberProperty }, 0, true, true)
    dropcomp.registerProperty(MarginTop, formItemGroupName, { ...numberProperty }, 13, true, true, 'px')
    dropcomp.registerProperty(MarginBottom, formItemGroupName, { ...numberProperty }, 0, true, true, 'px')
    dropcomp.registerProperty(MarginLeft, formItemGroupName, { ...numberProperty }, 0, true, true, 'px')
    dropcomp.registerProperty(MarginRight, formItemGroupName, { ...numberProperty }, 0, true, true, 'px')
  }
  // *********formItem的事件******************************************************************************
  get formOverflow(): string {
    if (this.IsDesigning || this.isSettingPersonal) {
      return 'auto'
    } else {
      return 'hidden'
    }
  }
  private onSelectItem(id: string) {
    window.event.stopPropagation()
    let comp = this.getItemComponent(id)
    if (!comp) {
      return false
    }

    this.parentPage.chooseComps([comp])
  }
  private onFormItemDelete(itemdata: personal_config) {
    let comp = this.getItemComponent(itemdata.compId)
    this.removeChild(comp)
    let index = this.personalConfig.findIndex((o) => o.compId == itemdata.compId)
    this.personalConfig.splice(index, 1)
  }
  private async showOrHideItem(compId: string) {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return
    }
    comp.display = !comp.display
    this.personalConfig.find((o) => o.compId == comp.Id).show = comp.display
  }

  private async hideItem(compName: string) {
    let comps = this.layoutChildren.filter((o) => o.name === compName) as ComponentBase[]
    if (!comps) {
      return
    }

    for (let index = 0; index < comps.length; index++) {
      const comp = comps[index]
      comp.display = false
      this.personalConfig.find((o) => o.compId == comp.Id).show = false
    }
  }
  /**upOrDown：true向上，false向下 */
  private async onChangeItemIndex(data: personal_config, upOrDown: boolean) {
    window.event.stopPropagation()
    let comp = this.getItemComponent(data.compId)
    this.parentPage.chooseComps([comp])
    /**调换item位置 */
    let changedIndex = upOrDown == true ? -1 : 1
    let itemIndex = this.personalConfig.indexOf(data)
    this.personalConfig.splice(itemIndex, 1)
    this.personalConfig.splice(itemIndex + changedIndex, 0, data)
    this.onChildrenCountChange()
  }
  private itemBoardStyle(compId: string): any {
    let comp = this.getItemComponent(compId)
    let selectedStyle = { border: '2px dashed #faad14', padding: '-2px' }
    let unSelectedStyle = { border: '0px dashed #bfbfbfd9', padding: '-1px' }

    if (!comp) {
      return {}
    }
    let resStyle: any = {}
    if (this.IsDesigning == false && this.isSettingPersonal == false) {
      resStyle = {}
    } else if (comp.isSelected) {
      resStyle = selectedStyle
    } else {
      resStyle = unSelectedStyle
    }

    if (comp.display == false && this.IsDesigning == false && this.isSettingPersonal == false) {
      resStyle.display = 'none'
    }

    return resStyle
  }
  private itemDisplay(compId: string): any {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return
    }
    return comp.display
  }
  // *********根据Id获取formItem组件的属性******************************************************************************
  private getItemComponent(compId: string): ComponentBase {
    let comp = this.layoutChildren.find((o) => o.Id == compId) as ComponentBase

    if (!comp) {
      return
    }

    let textalign = ''
    let fproperty = comp.findPropertyByName(formItemGroupName, itemFloat)
    if (!fproperty) {
      textalign = ''
    } else if (fproperty.value === '左对齐') {
      textalign = 'left'
    } else {
      textalign = 'right'
    }

    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-form-item-label')
        .find('label')
        .css('width', '100%')
      $(this.$el)
        .find('.ant-form-item-label')
        .find('label')
        .css('display', 'inline-block')
      $(this.$el)
        .find('.ant-form-item-label')
        .find('label')
        .css('box-sizing', 'border-box')

      $(this.$el)
        .find('.ant-form-item-label')
        .find('label')
        .css('text-align', textalign)
    })

    return comp
  }
  private getItemComponentWidth(compId: string): number {
    let comp = this.layoutChildren.find((o) => o.Id == compId) as ComponentBase
    if (!comp) {
      return 80
    }
    return comp.width
  }
  private getItemShowName(compId: string) {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return '待定'
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, itemShowName)
    if (!fproperty) {
      return '待定'
    }
    return fproperty.value
  }

  private getItemTextFloat(compId: string) {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return '待定'
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, itemFloat)
    if (!fproperty) {
      return ''
    }
    if (fproperty.value === '左对齐') {
      return 'left'
    } else {
      return 'right'
    }
  }
  private getLabelColSpan(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 1
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, LabelColSpanName)
    if (!fproperty) {
      return 1
    }
    return fproperty.value
  }
  private getLabelColOffset(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 1
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, LabelColOffsetName)
    if (!fproperty) {
      return 1
    }
    return fproperty.value
  }
  private getWrapperColSpan(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 1
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, WrapperColSpanName)
    if (!fproperty) {
      return 1
    }
    return fproperty.value
  }
  private getWrapperColOffset(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 1
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, WrapperColOffsetName)
    if (!fproperty) {
      return 1
    }
    return fproperty.value
  }
  private getItemMarginTop(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 0
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, MarginTop)
    if (!fproperty) {
      return 0
    }
    return fproperty.value
  }
  private getItemMarginLeft(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 0
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, MarginLeft)
    if (!fproperty) {
      return 0
    }
    return fproperty.value
  }
  private getItemMarginRight(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 0
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, MarginRight)
    if (!fproperty) {
      return 0
    }
    return fproperty.value
  }
  private getItemMarginBottom(compId: string): number {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return 0
    }
    let fproperty = comp.findPropertyByName(formItemGroupName, MarginBottom)
    if (!fproperty) {
      return 0
    }
    return fproperty.value
  }
  private getItemCanMove(compId: string): boolean {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return false
    }

    if (this.IsDesigning == true && comp.isSelected == true) {
      return true
    } else if (this.IsDesigning == false && this.isSettingPersonal == true && comp.isSelected == true) {
      return true
    } else {
      return false
    }
  }
  private getItemCanHide(compId: string): boolean {
    let comp = this.getItemComponent(compId)
    if (!comp) {
      return false
    }

    if (this.IsDesigning == false && this.isSettingPersonal == true && comp.isSelected == true) {
      return true
    } else {
      return false
    }
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
  // ***************************************************************************************
  //收缩
  private async toggleAdvanced() {
    this.advanced = !this.advanced

    if (this.advanced == true) {
      this.expand()
    } else {
      this.collage()
    }
    if (this.IsDesigning == false) {
      await this.saveCompConfig()
    }
  }
  private expand() {
    // window.console.log('expand')
    for (let index = 0; index < this.personalConfig.length; index++) {
      const element = this.personalConfig[index]
      let comp = this.getItemComponent(element.compId)
      if (comp) {
        comp.display = element.show
      }
    }
    this.$nextTick(() => {
      this.height = $((this.$refs.form as any).$el).height()
    })
  }
  private collage() {
    // window.console.log('collage')
    let currentWidth = $(this.$el).width()
    let optionWidth = $(this.$refs.optionBtns).width()
    let itemWidth = 0
    for (let index = 0; index < this.personalConfig.length; index++) {
      const element = this.personalConfig[index]
      let comp = this.getItemComponent(element.compId)
      comp.display = element.show
      if (element.show == false) {
        continue
      }

      let elementWidth = $(this.$refs[element.compId]).width()
      if (itemWidth + optionWidth + elementWidth > currentWidth) {
        comp.display = false
      }
      if (itemWidth + elementWidth > currentWidth) {
        comp.display = false
      }
      itemWidth += $(this.$refs[element.compId]).width()
    }
    this.$nextTick(() => {
      this.height = $((this.$refs.form as any).$el).height()
    })
  }
  // ***************************************************************************************
  private startPersonalSetting() {
    if (this.IsDesigning) {
      return
    }
    // window.console.log('startPersonalSetting:', this.personalConfig)
    // this.isSettingPersonal = !this.isSettingPersonal
    let configs: any[] = []
    for (let index = 0; index < this.personalConfig.length; index++) {
      const element = this.personalConfig[index]
      let showName = this.getItemShowName(element.compId)
      configs.push({
        compId: element.compId,
        showName: showName,
        show: element.show
      })
    }
    this.settingModal.show(configs)
  }
  private async onSureSetting(configs: any[]) {
    // window.console.log('onSureSetting:', configs)
    let newconfig: personal_config[] = []
    for (let index = 0; index < configs.length; index++) {
      const element = configs[index]
      this.getItemComponent(element.compId).display = element.show
      newconfig.push({ show: element.show, compId: element.compId })
    }
    this.personalConfig = newconfig
    await this.saveCompConfig()
  }
  private async saveCompConfig() {
    if (!this.personalConfigId) {
      this.personalConfigId = await CurrentApis.GetUniqueIds(1)[0]
    }
    await CurrentApis.SaveComponentConfig(
      this.Id,
      this.topParentPage.Id,
      { advanced: this.advanced, config: this.personalConfig },
      this.personalConfigId
    )
  }
  private onCancelSetting() {}
  // ***************************************************************************************
  private onSearchBtnClick() {
    this.triggeEvent('查询按钮点击事件', null)
  }
  private onResetBtnClick() {
    this.triggeEvent('重置按钮点击事件', null)
  }
  // ***************************************************************************************
  private loadModelComponents(components: ComponentBase[]) {
    for (let index = 0; index < components.length; index++) {
      let comp = components[index]
      let showname = comp.findPropertyByName(PropertyGroupName.special, '表单项显示').value
      let compClass = this.findSystemCompByCode(comp.layoutInfo.compCode)
      var compVue = this.insertComponentLayout(compClass, comp.layoutInfo, null, null)
      if (compVue) {
        compVue.LoadData(null)
      }
      compVue.findPropertyByName(formItemGroupName, itemShowName).value = showname
    }
  }
}
</script>



<style scoped>
.searchBtn {
  background: #4076a8;
  border-color: #4076a8;
}
.searchBtn:hover {
  background: #6691b9;
  border-color: #6691b9;
}

.searchBtn:active {
  background: #335e86;
  border-color: #335e86;
}

.resetBtn {
  color: #4076a8;
  background: #4076a81f;
  border-color: #6691b9;
}
.resetBtn:hover {
  color: #6691b9;
  background: #6691b905;
  border-color: #6691b9;
}

.resetBtn:active {
  color: #ffffff;
  background: #335e86;
  border-color: #335e86;
}
.resetBtn:active #resetid {
  fill: #ffffff;
}
.widget-view-action-left {
  position: relative;
  margin-top: -32px;
  z-index: 999;
  float: left;
  background: #faad14;
}

.widget-view-action-right {
  position: relative;
  margin-top: -32px;
  z-index: 999;
  float: right;
  background: #faad14;
}

.widget-view-model {
  position: relative;
  top: -20px;
  right: 3px;
  float: right;
  font-size: 12px;
  color: #faad14;
  z-index: 999;
}
</style>