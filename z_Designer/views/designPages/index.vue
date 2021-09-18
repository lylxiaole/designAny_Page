<template>
  <el-container style="height:100%;width:100%">
    <el-header class="toolbarheader">Header</el-header>
    <el-container class="designcontainer">
      <el-aside width="250px">
        <pagelist :currentAppId="applicationId" :pageGroups="pageDataList"></pagelist>
      </el-aside>
      <el-container>

      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { GetApplicationPages } from '@src/apis/designPage'
import pagelist from './pagelist.vue'

@Component({
  components: {
    pagelist: pagelist
  }
})
export default class index extends PageBase {
  private applicationId: string = null
  private pageDataList: any[] = []
  mounted() {
    this.applicationId = this.$route.query.appId as string
    this.initDesigner()
  }
  private async initDesigner() {
    this.pageDataList = await GetApplicationPages(this.applicationId)
  }
}
</script>

<style lang="less">
.toolbarheader {
  height: 42px;
}
.designcontainer {
  height: calc(100% - 42px);
}
</style>