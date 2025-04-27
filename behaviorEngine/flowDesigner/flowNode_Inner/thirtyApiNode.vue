<template>
  <el-row style="width: 100%; height: 100%">
    <el-tree-select node-key="id" size="small" :check-on-click-node="true" v-model="currentSelectId" :data="allApisTree" :render-after-expand="true"
      @check-change="onCurrentNodeChange" default-expand-all check-strictly />
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.thirtyApi, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class thirtyApiNode extends Vue {
  @Prop()
  private i18n: any
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  mounted() {
    this.loadAllApis()

    if (this.actObj.resourceFilter.apiInfo) {
      this.currentSelectId = this.actObj.resourceFilter.apiInfo.id
    }
  }

  private currentSelectId: string = null
  private allApisTree: any[] = []
  private loadAllApis() {
    let allApis = behaviorContext.allThirtyApis
    this.allApisTree = this.orgnizeTree(allApis)
  }

  private orgnizeTree(allApis: any[]): any[] {
    let trees: any = []
    for (let index = 0; index < allApis.length; index++) {
      const apiinfo = allApis[index]
      if (apiinfo.groupName) {
        let children = apiinfo.childrenAPIs.concat(apiinfo.childrenGroups)
        let childrenTree = this.orgnizeTree(children)
        trees.push({
          type: 'group',
          id: apiinfo.id,
          label: apiinfo.groupName,
          children: childrenTree
        })
      } else {
        trees.push({
          type: 'api',
          id: apiinfo.id,
          label: apiinfo.name,
          apidata: apiinfo
        })
      }
    }

    return trees
  }

  private onCurrentNodeChange(nodedata, node, e: Event) {
    if (nodedata.type === 'group') {
      throw '分组不能被选中'
    }

    this.actObj.resourceFilter.apiInfo = nodedata.apidata
    this.currentSelectId = this.actObj.resourceFilter.apiInfo.id
    this.actObj.inputParams = []

    if (nodedata.apidata.headers) {
      for (let index = 0; index < nodedata.apidata.headers.length; index++) {
        const header = nodedata.apidata.headers[index]
        this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, header.key + '&header'), name: 'Header-' + header.name })
      }
    }

    if (nodedata.apidata.inParams) {
      for (let index = 0; index < nodedata.apidata.inParams.length; index++) {
        const inparam = nodedata.apidata.inParams[index]
        this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, inparam.key + '&param'), name: 'UrlParam-' + inparam.name })
      }
    }

    //除了Get请求，其它的都需要使用body
    if (nodedata.apidata.requestType !== 'Get' && nodedata.apidata.bodyIsParam) {
      for (let index = 0; index < nodedata.apidata.bodyContent.length; index++) {
        const body = nodedata.apidata.bodyContent[index]
        this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, body.key + '&body'), name: 'BodyParam-' + body.name })
      }
    } else if (nodedata.apidata.requestType !== 'Get' && !nodedata.apidata.bodyIsParam) {
      this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, 'body'), name: 'BodyParam' })
    }

    this.actObj.outParam = { key: makeParamKey(this.actObj.id, 'output'), name: 'output' }
  }
}
</script>

<style lang="less" scoped></style>
