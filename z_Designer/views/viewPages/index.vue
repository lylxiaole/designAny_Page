<template>
  <el-row style="height:100%;width:100%">
    <el-row style="height:100%;width:100%;display:block;position:relative;display:block">
      <div ref="renderArea" style="width:100%;height:100%;overflow:auto"></div>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import { pageType, DesignPageDC, GetPageDetail } from '@common/apis/designPage'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'
import pagelist from './pagelist.vue'
import PropertyGrid from './PropertyGrid.vue'
import toolBar from './toolBar/index.vue'
import {
  Property,
  PropertyType,
  Text_Property,
  Behavior_Property,
  Number_Property,
  PropertyGroupName,
  Color_Property,
  UploadFile_Property,
  Boolean_Property,
  EnumModal_Property,
  Enum_Property,
  CompPosition_Property
} from '@designEngine/03designerLayoutBase/commonClasses/LayoutProperty'
import { drawVueOnVirtualDom } from '@common/utils'
import { EnginePage, MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview, EngineLayout } from '@designEngine/index'
import { behaviorList } from '@behaviorEngine/index'

@Options({
  components: {
    mobilePageDesign: MobilePageDesign,
    mobilePagePreview: MobilePagePreview,
    pCPageDesign: PCPageDesign,
    pCPagePreview: PCPagePreview,
    behaviorList: behaviorList
  }
})
export default class index extends PageBase {
  // **********当前应用**********************************************************
  private applicationId: string = null
  private application: ApplicationDC = null
  mounted() {
    this.applicationId = this.$route.query.appId as string
    GetApplication(this.applicationId).then((res) => {
      this.application = res
    })
  }

  // *****************************************************
  private async onEditPage(pageId: string) {
    if (this.isHaveOpened(pageId)) {
      this.currentOpenPageId = pageId
      return
    }

    let res = await GetPageDetail(pageId)
    await this.$nextTick()
    let designLayout: any = typeof EnginePage
    switch (res.type) {
      case pageType.pcPage:
        designLayout = PCPageDesign
        break
      case pageType.mobilePage:
        designLayout = MobilePageDesign
        break
      default:
        break
    }
    /************************渲染页面 */
    let { virtualDom, vueComp } = drawVueOnVirtualDom(designLayout)
    await (vueComp as any).loadPageByData(pageId, res.designDetail)
    ;(vueComp as any).name = res.name
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0
    this.openPage(res, vueComp as any)
    await this.$nextTick()
    $(this.$refs[pageId][0]).append(virtualDom)
  }
}
</script>

<style lang="less">
.toolbarheader {
  height: 42px;
  padding: 0px;
}
.designcontainer {
  height: calc(100% - 42px);
}

.pageList > .el-tabs--border-card {
  box-sizing: border-box;
}
.pageList > .el-tabs--border-card > .el-tabs__header {
  height: 39px;
  box-sizing: border-box;
}
.pageList > .el-tabs--border-card > .el-tabs__content {
  padding: 0px;
  height: calc(100% - 39px);
  box-sizing: border-box;
}
</style>