<template>
  <a-layout style="">
    <a-layout-sider width="80px" :class="['sider' ]" :trigger="null" collapsible v-model="collapsed">
      <logo />
      <a-spin style="min-height:500px" size="large" :spinning="menuPageData.length===0">
        <a-menu theme="dark" mode="inline" @click="menuItemClick" @openChange="menuOpend" :selectedKeys="selectedMenuIds" :openKeys="menuOpenIds"
          :defaultSelectedKeys="menuDefaultSelectedKeys">
          <template v-for="item in menuPageData">
            <sub-menu v-if="item.type==0" :menu-info="item" :key="item.id" :subMenuCollapsed='collapsed' :isLeaf="true" />
            <a-menu-item v-else :key="item.id">
              <span class="circleNodeStyle"></span>
              <span>{{item.text}}</span>
            </a-menu-item>
          </template>
        </a-menu>
      </a-spin>
    </a-layout-sider>
    <a-layout :style="{ minHeight: '100vh',height:'100%',overflow:'hidden' }">
      <!-- <a-layout-header class="preview-header">
       
        <a-icon class="trigger preview-export" type="export" @click="closePreview" />
        <a-icon v-if="activeTabKey" class="trigger historyicon" style="position:absolute;right:56px" @click="()=>{ this.showPageHistory()}"
          :component="historyIcon" />
        <PageHistory @onSelectHistory="viewHistroy" ref="historyPopup"></PageHistory>

      </a-layout-header> -->
      <a-layout-content style="" :style="{'overflow': 'hidden','width':'100%','height':'100%'}">
        <div class="ant-pro-multi-tab" style="height:100%;width: 100%;z-index: 0;">
          <div class="ant-pro-multi-tab-wrapper">
             <!-- style="height: calc(100% - 100px) !important;" -->
            <a-tabs
              :tabBarStyle="{'background': '#FFF','margin': 0,'paddingLeft': '16px','paddingTop': '0px','border-bottom': '1px solid #18aeb7'}" hideAdd
              :activeKey="activeTabKey" @change="changeActiveTab" @edit="onTabsEdit" type="editable-card">
              <a-tab-pane style="width:100%;height:100%;overflow:auto;background: #E0E3E9;" v-for="pane in panes" :key="pane.key" :closable="pane.closable">
                <!-- :tab="pane.title" -->
                <span class="np-tab-span" :title="pane.title" slot="tab">
                  {{pane.title}}
                </span>
                <div style="height: calc(100% - 28px) !important; margin: 12px 16px 16px 16px; background: #E0E3E9;">
                  <div class="page-content" style="overflow-y:auto;height:100%; width:100%;">
                    <geno-layoutProfessional v-if="pane.tag.jumpMode !== 2" :isActive="activeTabKey===pane.key" :ref="pane.key" :id="pane.key"
                      style="top:0;left:0;" :pageId="pane.key" @onMounted="(layout)=>onPageMounted(layout,pane.pageId,pane.param)" />
                    <iframe v-else style="overflow-y:auto;height:100%;min-width:1624px;" frameborder='0' :src="pane.tag.routeUrl">
                    </iframe>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
         <div style="top: 0;position: fixed;right: 0;"> <a-icon class="trigger preview-export" type="export" @click="closePreview" />
        <a-icon v-if="activeTabKey" class="trigger historyicon" style="position:absolute;right:56px" @click="()=>{ this.showPageHistory()}"
          :component="historyIcon" />
        <PageHistory @onSelectHistory="viewHistroy" ref="historyPopup"></PageHistory></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import SubMenu from './tool/SuMenu'
import common from '../../02common/commonMethod'
import Logo from '../../../tools/Logo'
import position from '../../assets/imges/position.svg?inline'
import Icon from 'ant-design-vue/es/icon'
import { CurrentApis, CurrentContext, pagenNodeType, APIRequestClass, PageOrderClass } from '../../01designerContext'
import { assign } from 'xe-utils/methods'

import { history_preview } from '../../02common/icons.js'
import PageHistory from '../../components/PageHistory.vue'

export default {
  name: 'PagePreview',
  // eslint-disable-next-line vue/no-unused-components
  components: { Logo, Icon, position, SubMenu, PageHistory },
  props: {
    pageId: {
      default: null
    }
  },
  data() {
    return {
      historyIcon: history_preview,
      breadList: [],
      loadingTab: false,
      collapsed: true,
      panes: [],
      initial: false,
      newTabIndex: 0,
      menuOpenIds: [],
      menuDefaultSelectedKeys: [],
      menuPageData: [],
      selectedMenuIds: [],
      rootSubmenuKeys: [],
      openKeys: [],
      activeTabKey: '',
      param: {
        filter: {
          appId: CurrentContext.AppID,
          show: true
        },
        orders: [
          {
            direction: 'ASC',
            fieldName: 'orderIndex'
          },
          {
            direction: 'ASC',
            fieldName: 'modifyTime'
          }
        ]
      }
    }
  },
  created() {
    CurrentContext.RoutePage = (pageId, param) => {
      console.info('menuPageData',this.menuPageData)
      if (pageId == this.activeTabKey) {
        return
      }
      for (let index = 0; index < this.menuPageData.length; index++) {
        const menu = this.menuPageData[index]
        let pathItems = []
        let data = this.getTabPaneDataById(pageId, menu, pathItems)
        if (data) {
          pageId = data.key
          let targetPane = this.panes.find((x) => x.key == pageId)
          if (!targetPane) {
            data['param'] = param
            this.panes.push(data)
          } else {
            let thePage = this.$refs[pageId][0]
            if (thePage) {
              if (!Array.isArray(param)) {
                param = [param]
              }
              thePage.SetPageInParams(param)
            }
          }
          let sumenuIds = pathItems.filter((x) => x.id != pageId).map((x) => x.id)
          this.menuOpenIds = sumenuIds
          this.selectedMenuIds = [pageId]
          this.activeTabKey = pageId
          //window.console.log('-----------------this.panespanespanespanespanes', this.panes)
          //window.console.log('-----------------this.activeTabKey', this.activeTabKey)
          break
        }
      }
    }
    this.$nextTick(() => {
      CurrentApis.GetAppMenuTree(this.param)
        .then((res) => {
          this.menuPageData = []
          //window.console.log('-----------------------------res', res)
          // res.forEach(element => {
          //   let children = []
          //   element.children.forEach((single)=>{
          //     children.push({id:single.key,text:single.title,type:single.leaf?'1':'0',obj:single.tag})
          //   })
          //   this.menuPageData.push({id:element.key,text:element.title,type:element.leaf?'1':'0',obj:element.tag,children:children})
          // })
          this.initTreeNode(this.menuPageData, res)
          //window.console.log('this.menuPageData', this.menuPageData)
        })
        .catch((error) => {
          this.$message.error(error)
        })
    })
  },
  mounted() {
    //window.console.log('IsDesigning变成' + false + '了')
    this.$store.state.isDesigning = false
  },
  beforeDestroy() {
    //window.console.log('IsDesigning变成' + true + '了')
    this.$store.state.isDesigning = true
  },
  methods: {
    initTreeNode(menuPage, res) {
      res.forEach((element) => {
        //let children = []
        let menu = { id: element.key, text: element.title, type: element.leaf ? '1' : '0', obj: element.tag, children: [] }
        if (element.children && element.children.length > 0) {
          this.initTreeNode(menu.children, element.children)
          // element.children.forEach((single)=>{
          //   children.push({id:single.key,text:single.title,type:single.leaf?'1':'0',obj:single.tag})
          // })
        }
        menuPage.push(menu)
      })
    },
    closePreview() {
      this.$emit('close')
    },
    menuOpend(openKeys) {
      this.menuOpenIds = openKeys
    },
    menuItemClick(data) {
      let targetMenuId = data.key
      let menuIdPath = common.clone(data.keyPath)
      let firstParentMenuId = menuIdPath.reverse()[0]
      let firstParentMenu = this.menuPageData.find((x) => x.id == firstParentMenuId)
      if (firstParentMenu) {
        let targetPane = this.panes.find((x) => x.key == targetMenuId)
        if (!targetPane) {
          let menuNames = []
          let cloneMenuIdPath = common.clone(menuIdPath)
          let targetPane = this.getTabPaneDataByPath(cloneMenuIdPath, firstParentMenu)
          if (targetPane) {
            this.panes.push(targetPane)
          }
        }
        this.activeTabKey = targetMenuId
        this.selectedMenuIds = [targetMenuId]
      }
    },
    getTabPaneDataByPath(menuIdPath, menu, menuNames) {
      let theMenuId = menuIdPath[0]
      if (theMenuId == menu.id) {
        if (!menuNames) {
          menuNames = []
        }
        menuNames.push(menu.text)
      }
      if (menuIdPath.length > 1) {
        menuIdPath.shift()
        let theSonMenu = menu.children.find((x) => x.id == menuIdPath[0])
        let paneData = this.getTabPaneDataByPath(menuIdPath, theSonMenu, menuNames)
        if (paneData) {
          return paneData
        }
      } else {
        return { title: menu.text, key: menu.id, pathList: menuNames, pageType: menu.type, pageId: menu.obj.pageId, tag: menu.obj }
      }
    },
    getTabPaneDataById(targetMenuId, menu, pathItems) {
      pathItems.push({ id: menu.id, name: menu.text })
      //兼容两种情况，菜单点击，直接从pageid来跳转
      if (menu.id == targetMenuId || menu.obj.pageId == targetMenuId) {
        let menuNames = pathItems.map((x) => x.name)
        return {
          title: menu.text,
          key: menu.id,
          pathList: menuNames,
          pageType: menu.type,
          isShow: menu.obj.show,
          pageId: menu.obj.pageId,
          tag: menu.obj
        }
      } else {
        for (let j = 0; j < menu.children.length; j++) {
          let sonMenu = menu.children[j]
          let sonpathItems = common.clone(pathItems)
          let data = this.getTabPaneDataById(targetMenuId, sonMenu, sonpathItems)
          if (data) {
            return data
          }
        }
      }
    },
    changeActiveTab(tabKey) {
      //window.console.log('-----------------切换页签changeActiveTab',this.$refs[tabKey])
      this.activeTabKey = tabKey
      this.selectedMenuIds = [tabKey]

      // if (this.$refs[tabKey][0]){
      //   this.$refs[tabKey][0].resizeChange(this.$refs[tabKey][0].children)
      // }
    },
    onTabsEdit(tabKey) {
      let targetindex = this.panes.findIndex((x) => x.key == tabKey)
      if (targetindex >= 0) {
        this.panes.splice(targetindex, 1)
        if (this.activeTabKey == tabKey) {
          if (this.panes.length > 0) {
            this.activeTabKey = this.panes[this.panes.length - 1].key
            this.selectedMenuIds = [this.activeTabKey]
          } else {
            this.activeTabKey = ''
            this.selectedMenuIds = []
          }
        }
      }
    },
    async onPageMounted(layout, id, param) {
      if (param) {
        if (!Array.isArray(param)) {
          param = [param]
        }
        await layout.Load(id, param)
      } else {
        await layout.Load(id)
      }

      let findpane = this.panes.find((o) => o.pageId == id)
      findpane.page = layout
      //window.console.log('-----------------渲染页面xxxxxx,onPageMounted')
      layout.StartShow(false)
    },
    async viewHistroy(histroyId) {
      let histroydata = await CurrentApis.GetPageHistoryContent(histroyId)

      let pagecontent = common.strUnZip(histroydata.designContentString)
      let pagedata = common.deserialize(pagecontent)
      let targetPane = this.panes.find((x) => x.key == this.activeTabKey)
      targetPane.page.reLoadPageData(pagedata)
    },
    showPageHistory() {
      let targetPane = this.panes.find((x) => x.key == this.activeTabKey)
      this.$refs.historyPopup.show(targetPane.pageId)
      this.$refs.historyPopup.startViewHistory()
    }
  },
  watch: {
    menuPageData: function(val) {
      if (val.length > 0 && !this.initial) {
        if (this.pageId) {
          for (let index = 0; index < val.length; index++) {
            const menu = val[index]
            let pathItems = []
            let data = this.getTabPaneDataById(this.pageId, menu, pathItems)
            if (data) {
              // this.pageId = data.key
              this.panes.push(data)
              let sumenuIds = pathItems.filter((x) => x.id != data.key).map((x) => x.id)
              this.menuOpenIds = sumenuIds
              this.selectedMenuIds = [data.key]
              this.activeTabKey = data.key
              break
            }
          }
        }
        this.initial = true
      }
    }
  }
}
</script>
 
<style lang="less" scoped>
@import './tool/preview.less';

.sider {
  flex: 0 0 80px;
  max-width: 80px;
  min-width: 80px;
  width: 80px;
  background: #001529;
  position: relative;
  z-index: 10;
  min-height: 100vh;
  transition: all 0.2s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);

  /deep/ .ant-layout-sider-children {
    background-color: #03303b;
    overflow-y: hidden;

    &:hover {
      overflow-y: auto;
    }
  }
}

.firstbreadcrumb /deep/ .ant-breadcrumb-separator {
  display: none;
}

.trigger {
  font-size: 20px;
  line-height: 50px;
  padding: 0 20px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.preview-export {
  right: 8px;
  position: absolute;
}

/* @import url('global.less'); */

.preview-header {
  height: 50px;
  padding: 0 12px 0 0;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  z-index: 2;
}

.page-header {
  padding: 6px 0 6px 20px;
  font-size: 14px;
  background-color: #effefc;
  .detail {
    display: flex;
    .avatar {
      flex: 0 1 72px;
      margin: 0 24px 8px 0;

      & > span {
        border-radius: 72px;
        display: block;
        width: 72px;
        height: 72px;
      }
    }

    .main {
      width: 100%;
      flex: 0 1 auto;

      .row {
        display: flex;
        width: 100%;

        .avatar {
          margin-bottom: 16px;
        }
      }

      .title {
        font-size: 20px;
        font-weight: 500;

        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
        flex: auto;
      }
      .logo {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        margin-right: 16px;
      }
      .content,
      .headerContent {
        flex: auto;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;

        .link {
          margin-top: 16px;
          line-height: 24px;

          a {
            font-size: 14px;
            margin-right: 32px;
          }
        }
      }
      .extra {
        flex: 0 1 auto;
        margin-left: 88px;
        min-width: 242px;
        text-align: right;
      }
      .action {
        margin-left: 56px;
        min-width: 266px;
        flex: 0 1 auto;
        text-align: right;
        &:empty {
          display: none;
        }
      }
    }
  }
}

.preview-tabs {
  // padding-top: 9px;
  // position: fixed;
  // width: 100%;
  z-index: 10;
  background: #fff;
  div {
    color: #000;
  }
}

.ant-pro-multi-tab-wrapper /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  height: 32px;
  line-height: 32px;
  border-radius: 6px 6px 0 0;
  margin-right: 6px;
  width: 134px;
  padding: 0 10px;
  border: 0;
}
.ant-pro-multi-tab-wrapper /deep/ .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab .ant-tabs-close-x {
  float: right;
  margin-top: 11px;
}
.ant-pro-multi-tab-wrapper /deep/ .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active .ant-tabs-close-x {
  color: #fff;
}

/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
  height: 50px;
  padding-top: 18px;
}

.content {
  height: 786px;
  overflow-y: auto;
  // margin: 24px 24px 0;
  .link {
    margin-top: 16px;
    &:not(:empty) {
      margin-bottom: 16px;
    }
    a {
      margin-right: 32px;
      height: 24px;
      line-height: 24px;
      display: inline-block;
      i {
        font-size: 24px;
        margin-right: 8px;
        vertical-align: middle;
      }
      span {
        height: 24px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.np-tab-span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100px;
}
/deep/ .ant-tabs-bar{
  height: 50px;
}

/deep/ .ant-tabs-tab div{
  height: 32px;
}
/deep/ .ant-pro-multi-tab-wrapper{
  height: 100%;
}
/deep/ .ant-tabs{
  height: 100%;
}
/deep/ .ant-tabs-top-content{
  height:calc(100% - 50px) !important;
}
</style>