<template>
  <el-container style="height:100%;width:100%">
    <el-header class="toolbarheader">Header</el-header>
    <el-container class="designcontainer">
      <el-aside width="250px">
        <pagelist :currentAppId="applicationId" :pageGroups="pageDataList" @onEditPage="onEditPage" @onDeletePage="onDeletePage"></pagelist>
      </el-aside>
      <el-container>
        <el-tabs v-model="currentOpenPageId" closable type="border-card" style="width:100%">
          <el-tab-pane v-for="page in openPages" :key="page.id" :label="page.name" :name="page.id">
            <div style="width:100%;height:100%" :ref="page.id"></div>
          </el-tab-pane>
          <!-- 
          <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
            我的行程
          </el-tab-pane>
          <el-tab-pane label="消息中心">消息中心</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
        </el-tabs>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { DesignPageDC, GetPageDetail } from '@src/apis/designPage'
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
  }
  // **********页面Tabs**********************************************************
  private currentOpenPageId: string = null
  private openPages: DesignPageDC[] = []
  private openPage(page: DesignPageDC) {
    let findopen = this.openPages.find((o) => o.id === page.id)
    if (!findopen) {
      this.openPages.push(page)
    }
    this.currentOpenPageId = page.id
  }

  // **********页面列表**********************************************************
  private async onEditPage(pageId: string) {
    let res = await GetPageDetail(pageId)
    this.openPage(res)
    await this.$nextTick()
    window.console.log('onEditPage:', this.$refs[res.id])
  }
  private async onDeletePage(pageId: string) {}
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